import { ActiveSession } from '@/lib/sessions';

interface Props {
  sessions: ActiveSession[];
  overdueIntensity?: 'subtle' | 'medium' | 'loud';
}

function elapsedLabel(minutes: number) {
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m ago`;
}

export default function SessionTable({ sessions, overdueIntensity = 'medium' }: Props) {
  const pulse = overdueIntensity !== 'subtle';

  return (
    <div className="sess-grid">
      <div className="sess-head">
        <div>Crew</div>
        <div>Boat</div>
        <div>Out</div>
        <div>Expected</div>
        <div>Time</div>
        <div style={{ textAlign: 'right' }}>Status</div>
      </div>

      {sessions.map((s) => (
        <div
          key={s.id}
          className={[
            'sess-row',
            s.overdue ? 'overdue' : '',
            s.overdue && pulse ? 'pulse' : '',
          ]
            .filter(Boolean)
            .join(' ')}
        >
          <div className="who">
            <div className="av">{s.av}</div>
            <div>{s.who}</div>
          </div>

          <div className="boat">
            {s.boatName}
            <span className="sub">{s.category}</span>
          </div>

          <div className="tcell">
            {s.outTime}
            <span className="sub">{elapsedLabel(s.elapsedMinutes)}</span>
          </div>

          <div className="tcell eta">
            {s.expectedReturn}
            {s.overdue && (
              <span className="sub" style={{ color: 'var(--clay)' }}>
                {s.overdueMinutes}m late
              </span>
            )}
          </div>

          <div className="tcell">{elapsedLabel(s.elapsedMinutes)}</div>

          <div className="status">
            {s.overdue ? (
              <span className="chip clay">{s.overdueMinutes}m overdue</span>
            ) : (
              <span className="chip ok">On water</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
