'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { ActiveSession } from '@/lib/sessions';

interface Props {
  sessions: ActiveSession[];
  overdueIntensity?: 'subtle' | 'medium' | 'loud';
}

function elapsedLabel(minutes: number) {
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m ago`;
}

export default function SessionTable({ sessions, overdueIntensity = 'medium' }: Props) {
  const router = useRouter();
  const pulse = overdueIntensity !== 'subtle';
  const [returning, setReturning] = useState<string | null>(null);

  async function handleReturn(sessionId: string) {
    setReturning(sessionId);
    const res = await fetch(`/api/sessions/${sessionId}/return`, { method: 'POST' });
    if (res.ok) {
      router.push(`/sign-in/training?session_id=${sessionId}`);
    } else {
      setReturning(null);
    }
  }

  return (
    <div className="sess-grid">
      <table className="sess-table">
        <thead>
          <tr>
            <th>Crew</th>
            <th>Boat</th>
            <th>Out</th>
            <th>Expected</th>
            <th>Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr
              key={s.id}
              className={[
                s.overdue ? 'overdue' : '',
                s.overdue && pulse ? 'pulse' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <td className="who">{s.crewNames.join(', ')}</td>

              <td className="boat">
                {s.boatName}
                <span className="sub">{s.category}</span>
              </td>

              <td className="tcell">
                {s.outTime}
                <span className="sub">{elapsedLabel(s.elapsedMinutes)}</span>
              </td>

              <td className="tcell eta">
                {s.expectedReturn}
                {s.overdue && (
                  <span className="sub" style={{ color: 'var(--clay)' }}>
                    {s.overdueMinutes}m late
                  </span>
                )}
              </td>

              <td className="tcell">{elapsedLabel(s.elapsedMinutes)}</td>

              <td className="status">
                {s.overdue ? (
                  <span className="chip clay">{s.overdueMinutes}m overdue</span>
                ) : (
                  <span className="chip ok">On water</span>
                )}
              </td>

              <td className="sess-action">
                <button
                  type="button"
                  className="btn btn-primary"
                  disabled={returning === s.id}
                  onClick={() => handleReturn(s.id)}
                >
                  {returning === s.id ? 'Recording…' : "I'm back"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
