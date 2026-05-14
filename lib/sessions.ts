import { prisma } from './prisma';

export type ActiveSession = {
  id: string;
  who: string;
  av: string;
  boatName: string;
  category: string;
  outTime: string;
  expectedReturn: string;
  elapsedMinutes: number;
  overdue: boolean;
  overdueMinutes: number;
};

function initials(name: string) {
  return name
    .split(/[\s+]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function fmt(d: Date) {
  return d.toTimeString().slice(0, 5);
}

export async function getActiveSessions(): Promise<ActiveSession[]> {
  const now = new Date();
  const rows = await prisma.session.findMany({
    where: { returnedAt: null },
    include: { member: true, boat: true },
    orderBy: { departedAt: 'asc' },
  });

  return rows.map((s) => {
    const elapsed = Math.floor((now.getTime() - s.departedAt.getTime()) / 60_000);
    const overdue = now > s.expectedReturn;
    const overdueMinutes = overdue
      ? Math.floor((now.getTime() - s.expectedReturn.getTime()) / 60_000)
      : 0;
    return {
      id: s.id,
      who: s.member.displayName,
      av: initials(s.member.displayName),
      boatName: s.boat.name,
      category: s.boat.category,
      outTime: fmt(s.departedAt),
      expectedReturn: fmt(s.expectedReturn),
      elapsedMinutes: elapsed,
      overdue,
      overdueMinutes,
    };
  });
}

export async function getReturnedTodayCount(): Promise<number> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  return prisma.session.count({
    where: {
      returnedAt: { gte: startOfDay },
    },
  });
}
