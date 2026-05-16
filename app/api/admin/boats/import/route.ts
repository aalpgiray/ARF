import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface CsvRow {
  rowNum: number;
  id: string;
  name: string;
  category: string;
  yearBuilt: string;
  weightKg: string;
  rackLocation: string;
  state: string;
  isActive: string;
  retiredReason: string;
}

interface RowError {
  row: number;
  field: string;
  message: string;
}

interface BoatDiff {
  id?: string;
  name: string;
  category: string;
  yearBuilt: number | null;
  weightKg: number | null;
  rackLocation: string | null;
  state: string;
  isActive: boolean;
  retiredReason: string | null;
}

function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

const ALLOWED_CATEGORIES = ['1X', '2X', '2-', '4X', '4+', '4-', '8+'];

function parseCsv(text: string): { rows: CsvRow[]; errors: RowError[] } {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) {
    return { rows: [], errors: [{ row: 0, field: 'file', message: 'File is empty' }] };
  }

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const required = ['name', 'category'];
  const missing = required.filter((h) => !headers.includes(h));
  if (missing.length > 0) {
    return {
      rows: [],
      errors: [{ row: 1, field: 'header', message: `Missing required columns: ${missing.join(', ')}` }],
    };
  }

  const rows: CsvRow[] = [];
  const errors: RowError[] = [];

  for (let i = 1; i < lines.length; i++) {
    const vals = splitCsvLine(lines[i]);
    const get = (col: string) => vals[headers.indexOf(col)]?.trim() ?? '';

    const row: CsvRow = {
      rowNum: i + 1,
      id: get('id'),
      name: get('name'),
      category: get('category'),
      yearBuilt: get('yearbuilt'),
      weightKg: get('weightkg'),
      rackLocation: get('racklocation'),
      state: get('state') || 'AVAILABLE',
      isActive: get('isactive') || 'true',
      retiredReason: get('retiredreason'),
    };

    if (!row.name) errors.push({ row: row.rowNum, field: 'name', message: 'name is required' });
    if (!row.category) {
      errors.push({ row: row.rowNum, field: 'category', message: 'category is required' });
    } else if (!ALLOWED_CATEGORIES.includes(row.category.toUpperCase())) {
      errors.push({ row: row.rowNum, field: 'category', message: `category must be one of: ${ALLOWED_CATEGORIES.join(', ')}` });
    }

    rows.push(row);
  }

  return { rows, errors };
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('mode');

  if (mode !== 'dry-run' && mode !== 'apply') {
    return NextResponse.json({ error: 'mode must be dry-run or apply' }, { status: 400 });
  }

  const text = await req.text();
  const { rows, errors } = parseCsv(text);

  if (errors.length > 0) {
    return NextResponse.json({ errors, diff: null });
  }

  const existing = await prisma.boat.findMany({
    select: { id: true, name: true, category: true, yearBuilt: true, weightKg: true, rackLocation: true, state: true, isActive: true, retiredReason: true },
  });
  const byId = new Map(existing.map((b) => [b.id, b]));
  const byName = new Map(existing.map((b) => [b.name.toLowerCase(), b]));

  const added: BoatDiff[] = [];
  const updated: BoatDiff[] = [];
  const unchanged: BoatDiff[] = [];
  const rowErrors: RowError[] = [];
  const namesSeen = new Set<string>();

  for (const row of rows) {
    const nameLower = row.name.toLowerCase();

    if (namesSeen.has(nameLower)) {
      rowErrors.push({ row: row.rowNum, field: 'name', message: `Duplicate name in CSV: ${row.name}` });
      continue;
    }
    namesSeen.add(nameLower);

    const isActive = !['false', '0'].includes(row.isActive.toLowerCase());
    const yearBuilt = row.yearBuilt ? Number(row.yearBuilt) : null;
    const weightKg = row.weightKg ? Number(row.weightKg) : null;
    const rackLocation = row.rackLocation || null;
    const retiredReason = row.retiredReason || null;
    const state = ['AVAILABLE', 'MAINTENANCE'].includes(row.state.toUpperCase())
      ? row.state.toUpperCase()
      : 'AVAILABLE';

    const current = row.id ? byId.get(row.id) : byName.get(nameLower);

    if (!current && row.id) {
      rowErrors.push({ row: row.rowNum, field: 'id', message: `No boat found with id: ${row.id}` });
      continue;
    }

    if (!current) {
      added.push({ name: row.name, category: row.category, yearBuilt, weightKg, rackLocation, state, isActive, retiredReason });
    } else {
      const changed =
        current.name !== row.name ||
        current.category !== row.category ||
        current.yearBuilt !== yearBuilt ||
        current.weightKg !== weightKg ||
        current.rackLocation !== rackLocation ||
        current.state !== state ||
        current.isActive !== isActive ||
        current.retiredReason !== retiredReason;

      if (changed) {
        updated.push({ id: current.id, name: row.name, category: row.category, yearBuilt, weightKg, rackLocation, state, isActive, retiredReason });
      } else {
        unchanged.push({ id: current.id, name: row.name, category: row.category, yearBuilt, weightKg, rackLocation, state, isActive, retiredReason });
      }
    }
  }

  const csvIds = new Set(rows.filter((r) => r.id).map((r) => r.id));
  const csvNames = new Set(rows.map((r) => r.name.toLowerCase()));
  const deactivated: BoatDiff[] = existing
    .filter((b) => b.isActive && !csvIds.has(b.id) && !csvNames.has(b.name.toLowerCase()))
    .map((b) => ({ id: b.id, name: b.name, category: b.category, yearBuilt: b.yearBuilt, weightKg: b.weightKg, rackLocation: b.rackLocation, state: b.state, isActive: false, retiredReason: b.retiredReason }));

  if (rowErrors.length > 0) {
    return NextResponse.json({ errors: rowErrors, diff: null });
  }

  const diff = { added, updated, deactivated, unchanged };

  if (mode === 'dry-run') {
    return NextResponse.json({ errors: [], diff });
  }

  await prisma.$transaction([
    ...added.map((b) =>
      prisma.boat.create({
        data: { name: b.name, category: b.category, yearBuilt: b.yearBuilt, weightKg: b.weightKg, rackLocation: b.rackLocation, state: (b.state as 'AVAILABLE' | 'MAINTENANCE'), isActive: true, retiredReason: b.retiredReason },
      })
    ),
    ...updated.map((b) =>
      prisma.boat.update({
        where: { id: b.id },
        data: { name: b.name, category: b.category, yearBuilt: b.yearBuilt, weightKg: b.weightKg, rackLocation: b.rackLocation, state: (b.state as 'AVAILABLE' | 'MAINTENANCE'), isActive: b.isActive, retiredReason: b.retiredReason },
      })
    ),
    ...deactivated.map((b) =>
      prisma.boat.update({ where: { id: b.id }, data: { isActive: false } })
    ),
  ]);

  return NextResponse.json({ errors: [], diff, applied: true });
}
