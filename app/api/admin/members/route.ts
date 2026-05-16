import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const members = await prisma.member.findMany({
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      squad: true,
      isActive: true,
      deactivationReason: true,
      updatedAt: true,
    },
    orderBy: { lastName: 'asc' },
  });
  const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN ?? null;
  return NextResponse.json({ members, allowedDomain });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { firstName, lastName, email, squad } = body ?? {};

  if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'firstName, lastName, and email are required' }, { status: 422 });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const allowedDomain = process.env.ALLOWED_EMAIL_DOMAIN;
  if (allowedDomain) {
    const domain = normalizedEmail.split('@')[1];
    if (domain !== allowedDomain) {
      return NextResponse.json(
        { error: `Email must be @${allowedDomain}` },
        { status: 422 }
      );
    }
  }

  const existing = await prisma.member.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return NextResponse.json({ error: 'A member with this email already exists' }, { status: 409 });
  }

  const member = await prisma.member.create({
    data: {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      squad: squad?.trim() || null,
      isActive: true,
    },
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

  return NextResponse.json(member, { status: 201 });
}
