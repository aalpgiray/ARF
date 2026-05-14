import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const session = await prisma.session.findUnique({ where: { id } });
  if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  if (session.returnedAt) return NextResponse.json({ error: 'Already returned' }, { status: 409 });

  await prisma.$transaction([
    prisma.session.update({ where: { id }, data: { returnedAt: new Date() } }),
    prisma.boat.update({ where: { id: session.boatId }, data: { state: 'AVAILABLE' } }),
  ]);

  return NextResponse.json({ ok: true });
}
