import { NextResponse } from 'next/server';
import { getActiveSessions } from '@/lib/sessions';

export const dynamic = 'force-dynamic';

export async function GET() {
  const sessions = await getActiveSessions();
  return NextResponse.json(sessions);
}
