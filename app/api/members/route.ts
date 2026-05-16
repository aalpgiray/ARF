import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const members = await prisma.member.findMany({
    where: { isActive: true },
    select: { id: true, firstName: true, lastName: true, squad: true },
    orderBy: { lastName: 'asc' },
  });
  return NextResponse.json(members);
}
