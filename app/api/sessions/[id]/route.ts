import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await prisma.session.findUnique({
    where: { id },
    include: { boat: { select: { name: true, category: true } } },
  });
  if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const member = session.googleUserId
    ? await prisma.member.findUnique({
        where: { googleUserId: session.googleUserId },
        select: { displayName: true },
      })
    : null;

  return NextResponse.json({ ...session, member });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { distanceMeters, sessionType, notes } = await req.json();

  const session = await prisma.session.findUnique({ where: { id } });
  if (!session) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const updated = await prisma.session.update({
    where: { id },
    data: {
      ...(distanceMeters !== undefined && { distanceMeters }),
      ...(sessionType !== undefined && { sessionType }),
      ...(notes !== undefined && { notes }),
    },
  });

  return NextResponse.json(updated);
}
