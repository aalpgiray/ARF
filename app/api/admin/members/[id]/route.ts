import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { action, firstName, lastName, squad, deactivationReason } = body ?? {};

  const existing = await prisma.member.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: 'Member not found' }, { status: 404 });
  }

  let data: Record<string, unknown> = {};

  if (action === 'deactivate') {
    data = { isActive: false, deactivationReason: deactivationReason?.trim() || null };
  } else if (action === 'reactivate') {
    data = { isActive: true, deactivationReason: null };
  } else {
    if (firstName !== undefined) data.firstName = firstName.trim();
    if (lastName !== undefined) data.lastName = lastName.trim();
    if (squad !== undefined) data.squad = squad?.trim() || null;
  }

  const member = await prisma.member.update({
    where: { id },
    data,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      squad: true,
      isActive: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(member);
}
