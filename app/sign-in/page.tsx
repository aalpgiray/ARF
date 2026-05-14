'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import Chrome from '@/components/Chrome';
import Footer from '@/components/Footer';
import PageContent from '@/components/PageContent';

function elapsedLabel(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

interface Session {
  id: string;
  crewNames: string[];
  boatName: string;
  category: string;
  outTime: string;
  expectedReturn: string;
  elapsedMinutes: number;
  overdue: boolean;
  overdueMinutes: number;
}

export default function SignInPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [returning, setReturning] = useState<string | null>(null);

  const load = useCallback(() => {
    fetch('/api/sessions/active')
      .then((r) => r.json())
      .then((data) => { setSessions(data); setLoading(false); });
  }, []);

  useEffect(() => { load(); }, [load]);

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
    <>
      <Chrome />
      <div className="arf-body">
        <div className="screen-h">
          <div>
            <div className="eyebrow">Welcome back</div>
            <h1>Who just landed?</h1>
          </div>
          {!loading && sessions.length > 0 && (
            <span className="chip">{sessions.length} crew{sessions.length !== 1 ? 's' : ''} still out</span>
          )}
        </div>

        <PageContent>
          {loading && (
            <div className="empty">
              <p>Loading…</p>
            </div>
          )}

          {!loading && sessions.length === 0 && (
            <div className="empty">
              <p>No active sessions — everyone is ashore.</p>
            </div>
          )}

          {!loading && sessions.length > 0 && (
            <div className="signin-grid">
              {sessions.map((s, i) => (
                <div key={s.id} className={`signin-row${i === 0 ? ' featured' : ''}`}>
                  <div className="who">
                    <div>
                      <div className="nm">{s.crewNames.join(', ')}</div>
                      <div className="sub">
                        Signed out {s.outTime} · {elapsedLabel(s.elapsedMinutes)} ago
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="boat">{s.boatName}</div>
                    <div className="meta">{s.category}</div>
                  </div>
                  <div className="tcol">
                    {s.expectedReturn}
                    <span className="meta">Expected</span>
                  </div>
                  <div
                    className="tcol"
                    style={{
                      color: s.overdue
                        ? 'var(--clay)'
                        : i === 0
                        ? 'rgba(242,237,227,0.85)'
                        : 'var(--ink-2)',
                    }}
                  >
                    {s.overdue ? `+${s.overdueMinutes}m` : 'On time'}
                    <span className="meta">vs plan</span>
                  </div>
                  <button
                    type="button"
                    className={`btn ${i === 0 ? 'btn-ghost' : 'btn-primary'}`}
                    style={
                      i === 0
                        ? { borderColor: 'rgba(242,237,227,0.4)', color: 'var(--sand)' }
                        : {}
                    }
                    disabled={returning === s.id}
                    onClick={() => handleReturn(s.id)}
                  >
                    {returning === s.id ? 'Recording…' : "I'm back"} <span className="arr">→</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </PageContent>

        <Footer>
          <button type="button" className="btn btn-ghost btn-lg" onClick={() => router.push('/')}>
            ← Cancel
          </button>
        </Footer>
      </div>
    </>
  );
}
