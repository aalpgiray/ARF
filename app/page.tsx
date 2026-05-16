import Link from 'next/link';
import AlertBar from '@/components/dashboard/AlertBar';
import DashboardPoller from '@/components/dashboard/DashboardPoller';
import EmptyState from '@/components/dashboard/EmptyState';
import SessionTable from '@/components/dashboard/SessionTable';
import SummaryTiles from '@/components/dashboard/SummaryTiles';
import Chrome from '@/components/Chrome';
import Footer from '@/components/Footer';
import PageContent from '@/components/PageContent';
import { getActiveSessions, getReturnedTodayCount } from '@/lib/sessions';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [sessions, returnedToday] = await Promise.all([
    getActiveSessions(),
    getReturnedTodayCount(),
  ]);

  const overdueCount = sessions.filter((s) => s.overdue).length;
  const headingText =
    sessions.length === 0
      ? 'All quiet on the water.'
      : overdueCount > 0
        ? `${sessions.length} out, ${overdueCount} running late.`
        : `${sessions.length} ${sessions.length === 1 ? 'crew' : 'crews'} on the water.`;

  if (sessions.length === 0) {
    return (
      <>
        <Chrome />
        <EmptyState />
      </>
    );
  }

  return (
    <>
      <Chrome />
      <DashboardPoller />
      <div className="arf-body">
        <div className="screen-h">
          <div>
            <div className="eyebrow">On the water · {sessions.length} crews</div>
            <h1>{headingText}</h1>
          </div>
          <span className="chip">Auto-refresh · 30s</span>
        </div>

        <PageContent>
          <SummaryTiles sessions={sessions} returnedToday={returnedToday} />
          <AlertBar sessions={sessions} />
          <SessionTable sessions={sessions} />
        </PageContent>

        <Footer>
          <Link href="/sign-out" className="btn btn-primary btn-lg">
            Sign out a boat <span className="arr">→</span>
          </Link>
          <div className="arf-foot-end">
            <span className="chip">Stay safe on the water 🚣</span>
            <Link href="/boats" className="btn btn-text">
              Boat registry
            </Link>
          </div>
        </Footer>
      </div>
    </>
  );
}
