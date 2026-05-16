import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

function csvEscape(val: unknown): string {
  const s = val == null ? '' : String(val);
  if (s.includes(',') || s.includes('"') || s.includes('\n')) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const template = searchParams.get('template') === '1';

  const header = 'id,name,category,yearBuilt,weightKg,rackLocation,state,isActive,retiredReason\n';

  const boats = await prisma.boat.findMany({
    select: {
      id: true,
      name: true,
      category: true,
      yearBuilt: true,
      weightKg: true,
      rackLocation: true,
      state: true,
      isActive: true,
      retiredReason: true,
    },
    orderBy: { name: 'asc' },
  });

  const rows = boats.map((b) =>
    [b.id, b.name, b.category, b.yearBuilt ?? '', b.weightKg ?? '', b.rackLocation ?? '', b.state, b.isActive, b.retiredReason ?? '']
      .map(csvEscape)
      .join(',')
  );

  const date = new Date().toISOString().slice(0, 10);

  if (template) {
    const body = rows.length > 0
      ? `${header}${rows.join('\n')}\n`
      : `${header},Example Boat,1x,2021,14,A · 3,AVAILABLE,true,\n`;
    return new NextResponse(body, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=boats-template-${date}.csv`,
      },
    });
  }

  const csv = `${header}${rows.join('\n')}\n`;

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename=boats-${date}.csv`,
    },
  });
}
