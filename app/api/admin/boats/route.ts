import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const boats = await prisma.boat.findMany({
    select: {
      id: true,
      name: true,
      category: true,
      yearBuilt: true,
      weightKg: true,
      state: true,
      rackLocation: true,
      isActive: true,
      retiredReason: true,
      updatedAt: true,
      sessions: { where: { returnedAt: null }, select: { id: true } },
    },
    orderBy: { name: 'asc' },
  });
  return NextResponse.json(
    boats.map(({ sessions, ...b }) => ({ ...b, onWater: sessions.length > 0 }))
  );
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, category, yearBuilt, weightKg, rackLocation } = body ?? {};

  if (!name?.trim() || !category?.trim()) {
    return NextResponse.json({ error: 'name and category are required' }, { status: 422 });
  }

  const existing = await prisma.boat.findUnique({ where: { name: name.trim() } });
  if (existing) {
    return NextResponse.json({ error: 'A boat with this name already exists' }, { status: 409 });
  }

  const boat = await prisma.boat.create({
    data: {
      name: name.trim(),
      category: category.trim(),
      yearBuilt: yearBuilt ? Number(yearBuilt) : null,
      weightKg: weightKg ? Number(weightKg) : null,
      rackLocation: rackLocation?.trim() || null,
      isActive: true,
    },
    select: {
      id: true,
      name: true,
      category: true,
      yearBuilt: true,
      weightKg: true,
      state: true,
      rackLocation: true,
      isActive: true,
      retiredReason: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(boat, { status: 201 });
}
