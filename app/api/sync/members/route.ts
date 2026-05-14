import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { fetchWorkspaceUsers } from '@/lib/google-directory';

export async function POST(req: NextRequest) {
  // Protect cron endpoint
  const secret = req.headers.get('x-cron-secret');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let users;
  try {
    users = await fetchWorkspaceUsers();
  } catch (err) {
    console.error('[sync/members] Google Directory fetch failed:', err);
    return NextResponse.json(
      { error: 'Directory fetch failed, cache retained' },
      { status: 503 },
    );
  }

  const now = new Date();
  await Promise.all(
    users.map((u) =>
      prisma.member.upsert({
        where: { googleUserId: u.googleUserId },
        update: { displayName: u.displayName, email: u.email, syncedAt: now },
        create: { ...u, syncedAt: now },
      }),
    ),
  );

  return NextResponse.json({ synced: users.length });
}
