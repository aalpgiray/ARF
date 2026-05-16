import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface CsvRow {
  rowNum: number;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  squad: string;
  isActive: string;
}

interface RowError {
  row: number;
  field: string;
  message: string;
}

interface MemberDiff {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  squad: string | null;
  isActive: boolean;
  _prev?: { firstName: string; lastName: string; squad: string | null; isActive: boolean };
}

function parseCsv(text: string): { rows: CsvRow[]; errors: RowError[] } {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) {
    return { rows: [], errors: [{ row: 0, field: 'file', message: 'File is empty' }] };
  }

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const required = ['firstname', 'lastname', 'email'];
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
      firstName: get('firstname'),
      lastName: get('lastname'),
      email: get('email'),
      squad: get('squad'),
      isActive: get('isactive') || 'true',
    };

    if (!row.firstName) errors.push({ row: row.rowNum, field: 'firstName', message: 'firstName is required' });
    if (!row.lastName) errors.push({ row: row.rowNum, field: 'lastName', message: 'lastName is required' });
    if (!row.email) {
      errors.push({ row: row.rowNum, field: 'email', message: 'email is required' });
    } else {
      const normalizedEmail = row.email.toLowerCase();
      const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN;
      if (allowedDomain && normalizedEmail.split('@')[1] !== allowedDomain) {
        errors.push({ row: row.rowNum, field: 'email', message: `Email must be @${allowedDomain}` });
      }
    }

    rows.push(row);
  }

  return { rows, errors };
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

  const existing = await prisma.member.findMany({
    select: { id: true, firstName: true, lastName: true, email: true, squad: true, isActive: true },
  });
  const byEmail = new Map(existing.map((m) => [m.email.toLowerCase(), m]));

  const added: MemberDiff[] = [];
  const updated: MemberDiff[] = [];
  const unchanged: MemberDiff[] = [];
  const deactivated: MemberDiff[] = [];
  const emailsSeen = new Set<string>();
  const rowErrors: RowError[] = [];

  for (const row of rows) {
    const email = row.email.toLowerCase();

    if (emailsSeen.has(email)) {
      rowErrors.push({ row: row.rowNum, field: 'email', message: `Duplicate email in CSV: ${email}` });
      continue;
    }
    emailsSeen.add(email);

    const isActive = !['false', '0'].includes(row.isActive.toLowerCase());
    const squad = row.squad || null;
    const current = byEmail.get(email);

    if (!current) {
      added.push({ firstName: row.firstName, lastName: row.lastName, email, squad, isActive });
    } else if (!isActive && current.isActive) {
      deactivated.push({ id: current.id, firstName: current.firstName, lastName: current.lastName, email, squad: current.squad, isActive: false });
    } else {
      const changed =
        current.firstName !== row.firstName ||
        current.lastName !== row.lastName ||
        current.squad !== squad ||
        current.isActive !== isActive;

      if (changed) {
        updated.push({
          id: current.id,
          firstName: row.firstName,
          lastName: row.lastName,
          email,
          squad,
          isActive,
          _prev: { firstName: current.firstName, lastName: current.lastName, squad: current.squad, isActive: current.isActive },
        });
      } else {
        unchanged.push({ id: current.id, firstName: row.firstName, lastName: row.lastName, email, squad, isActive });
      }
    }
  }

  const csvEmails = new Set(rows.map((r) => r.email.toLowerCase()));
  for (const m of existing) {
    if (m.isActive && !csvEmails.has(m.email.toLowerCase())) {
      deactivated.push({ id: m.id, firstName: m.firstName, lastName: m.lastName, email: m.email, squad: m.squad, isActive: false });
    }
  }

  if (rowErrors.length > 0) {
    return NextResponse.json({ errors: rowErrors, diff: null });
  }

  const diff = { added, updated, deactivated, unchanged };

  if (mode === 'dry-run') {
    return NextResponse.json({ errors: [], diff });
  }

  await prisma.$transaction([
    ...added.map((m) =>
      prisma.member.create({
        data: { firstName: m.firstName, lastName: m.lastName, email: m.email, squad: m.squad, isActive: true },
      })
    ),
    ...updated.map((m) =>
      prisma.member.update({
        where: { id: m.id },
        data: { firstName: m.firstName, lastName: m.lastName, squad: m.squad, isActive: m.isActive },
      })
    ),
    ...deactivated.map((m) =>
      prisma.member.update({ where: { id: m.id }, data: { isActive: false } })
    ),
  ]);

  return NextResponse.json({ errors: [], diff, applied: true });
}
