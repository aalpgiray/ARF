import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const members = await prisma.member.findMany({
    select: { id: true, displayName: true, squad: true },
    orderBy: { displayName: 'asc' },
  });
  return NextResponse.json(members);
}
