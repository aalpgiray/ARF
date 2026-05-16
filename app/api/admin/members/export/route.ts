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

  const header = 'id,firstName,lastName,email,squad,isActive\n';

  const members = await prisma.member.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      squad: true,
      isActive: true,
    },
    orderBy: { lastName: 'asc' },
  });

  const rows = members.map((m) =>
    [m.id, m.firstName, m.lastName, m.email, m.squad ?? '', m.isActive]
      .map(csvEscape)
      .join(',')
  );

  const date = new Date().toISOString().slice(0, 10);

  if (template) {
    const body = rows.length > 0
      ? `${header}${rows.join('\n')}\n`
      : `${header},Example,Member,example.member@club.org,Senior · S1,true\n`;
    return new NextResponse(body, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=members-template-${date}.csv`,
      },
    });
  }

  const csv = `${header}${rows.join('\n')}\n`;

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename=members-${date}.csv`,
    },
  });
}
