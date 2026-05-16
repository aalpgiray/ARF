import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const boats = await prisma.boat.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
    include: {
      sessions: {
        where: { returnedAt: null },
        select: { id: true },
      },
    },
  });

  const result = boats.map((b) => ({
    id: b.id,
    name: b.name,
    category: b.category,
    yearBuilt: b.yearBuilt,
    weightKg: b.weightKg,
    effectiveState: b.sessions.length > 0 ? 'out' : b.state.toLowerCase(),
  }));

  return NextResponse.json(result);
}
