import { ActiveSession } from '@/lib/sessions';

interface Props {
  sessions: ActiveSession[];
  returnedToday: number;
}

export default function SummaryTiles({ sessions, returnedToday }: Props) {
  const rowerCount = sessions.length; // approximate; refine if crew size tracked
  const overdueCount = sessions.filter((s) => s.overdue).length;

  return (
    <div className="tile-row" style={{ marginTop: 20 }}>
      <div className="tile featured">
        <div className="k">Currently on water</div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div className="v">
            {rowerCount} <small>crews</small>
          </div>
          <div className="v" style={{ fontSize: 34, opacity: 0.8 }}>
            {rowerCount} boats
          </div>
        </div>
      </div>

      <div className="tile">
        <div className="k">Overdue</div>
        <div className="v" style={{ color: overdueCount > 0 ? 'var(--clay)' : undefined }}>
          {overdueCount}
        </div>
      </div>

      <div className="tile">
        <div className="k">Returned today</div>
        <div className="v">{returnedToday}</div>
      </div>
    </div>
  );
}
