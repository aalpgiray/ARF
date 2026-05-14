import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const { memberId, boatId, durationMinutes } = await req.json();

  if (!memberId || !boatId || !durationMinutes) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const boat = await prisma.boat.findUnique({ where: { id: boatId }, include: { sessions: { where: { returnedAt: null } } } });
  if (!boat) return NextResponse.json({ error: 'Boat not found' }, { status: 404 });
  if (boat.sessions.length > 0) return NextResponse.json({ error: 'Boat already out' }, { status: 409 });

  const now = new Date();
  const expectedReturn = new Date(now.getTime() + durationMinutes * 60_000);

  const session = await prisma.session.create({
    data: { memberId, boatId, departedAt: now, expectedReturn },
  });

  return NextResponse.json(session, { status: 201 });
}
