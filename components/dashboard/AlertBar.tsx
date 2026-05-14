import { ActiveSession } from '@/lib/sessions';

interface Props {
  sessions: ActiveSession[];
}

export default function AlertBar({ sessions }: Props) {
  const overdue = sessions.filter((s) => s.overdue);
  if (overdue.length === 0) return null;

  return (
    <div style={{ padding: '16px 32px 0' }}>
      {overdue.map((s) => (
        <div key={s.id} className="alert-bar" style={{ marginBottom: 8 }}>
          <span className="lbl">Overdue</span>
          <span>
            <b>{s.who}</b> · expected {s.expectedReturn} ·{' '}
            <b>{s.overdueMinutes} minutes late</b>
          </span>
        </div>
      ))}
    </div>
  );
}
