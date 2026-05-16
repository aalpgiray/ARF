import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { action, name, category, yearBuilt, weightKg, rackLocation, retiredReason } = body ?? {};

  const existing = await prisma.boat.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Boat not found' }, { status: 404 });
  }

  let data: Record<string, unknown> = {};

  if (action === 'retire') {
    data = { isActive: false, retiredReason: retiredReason?.trim() || null };
  } else if (action === 'restore') {
    data = { isActive: true, retiredReason: null };
  } else {
    if (name !== undefined) {
      const conflict = await prisma.boat.findFirst({ where: { name: name.trim(), id: { not: id } } });
      if (conflict) {
        return NextResponse.json({ error: 'A boat with this name already exists' }, { status: 409 });
      }
      data.name = name.trim();
    }
    if (category !== undefined) data.category = category.trim();
    if (yearBuilt !== undefined) data.yearBuilt = yearBuilt ? Number(yearBuilt) : null;
    if (weightKg !== undefined) data.weightKg = weightKg ? Number(weightKg) : null;
    if (rackLocation !== undefined) data.rackLocation = rackLocation?.trim() || null;
  }

  const boat = await prisma.boat.update({
    where: { id },
    data,
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

  return NextResponse.json(boat);
}
