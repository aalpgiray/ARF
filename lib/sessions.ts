import { prisma } from './prisma';

export type ActiveSession = {
  id: string;
  crewNames: string[];
  boatName: string;
  category: string;
  outTime: string;
  expectedReturn: string;
  elapsedMinutes: number;
  overdue: boolean;
  overdueMinutes: number;
};

function fmt(d: Date) {
  return d.toTimeString().slice(0, 5);
}

export async function getActiveSessions(): Promise<ActiveSession[]> {
  const now = new Date();
  const rows = await prisma.session.findMany({
    where: { returnedAt: null },
    include: { boat: true },
    orderBy: { departedAt: 'asc' },
  });

  const allCrewIds = [...new Set(rows.flatMap((s) => s.crewMemberIds))];
  const members = allCrewIds.length
    ? await prisma.member.findMany({ where: { id: { in: allCrewIds } } })
    : [];
  const memberMap = new Map(members.map((m) => [m.id, `${m.firstName} ${m.lastName}`]));

  return rows.map((s) => {
    const elapsed = Math.floor((now.getTime() - s.departedAt.getTime()) / 60_000);
    const overdue = now > s.expectedReturn;
    const overdueMinutes = overdue
      ? Math.floor((now.getTime() - s.expectedReturn.getTime()) / 60_000)
      : 0;
    return {
      id: s.id,
      crewNames: s.crewMemberIds.map((id) => memberMap.get(id) ?? id),
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
