'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Chrome from '@/components/Chrome';
import Footer from '@/components/Footer';

const DISTANCE_PRESETS = [4, 6, 8, 10, 12];
const SESSION_TYPES = ['STEADY', 'UT2', 'UT1', 'AT', 'INTERVALS', 'RACE', 'OUTING'] as const;
type SessionType = (typeof SESSION_TYPES)[number];

const SESSION_TYPE_LABELS: Record<SessionType, string> = {
  STEADY: 'Steady',
  UT2: 'UT2',
  UT1: 'UT1',
  AT: 'AT',
  INTERVALS: 'Intervals',
  RACE: 'Race',
  OUTING: 'Outing',
};

interface SessionInfo {
  id: string;
  departedAt: string;
  returnedAt: string | null;
  member: { displayName: string };
  boat: { name: string; category: string };
}

function durationLabel(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function paceLabel(distanceKm: number, durationMinutes: number): string {
  if (!distanceKm || !durationMinutes) return '—';
  const secsPerKm = (durationMinutes * 60) / distanceKm;
  const per500 = secsPerKm / 2;
  const m = Math.floor(per500 / 60);
  const s = Math.round(per500 % 60);
  return `${m}:${String(s).padStart(2, '0')} / 500m`;
}

function strokesEstimate(distanceKm: number): string {
  if (!distanceKm) return '—';
  const strokes = Math.round(distanceKm * 175);
  return `≈ ${strokes.toLocaleString()}`;
}

export default function TrainingPage() {
  const router = useRouter();
  const params = useSearchParams();
  const sessionId = params.get('session_id');

  const [session, setSession] = useState<SessionInfo | null>(null);
  const [distanceKm, setDistanceKm] = useState<number | null>(null);
  const [customDistanceInput, setCustomDistanceInput] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [sessionType, setSessionType] = useState<SessionType | null>(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!sessionId) return;
    fetch(`/api/sessions/${sessionId}`)
      .then((r) => r.json())
      .then(setSession);
  }, [sessionId]);

  const durationMinutes = useMemo(() => {
    if (!session) return 0;
    const departed = new Date(session.departedAt);
    const returned = session.returnedAt ? new Date(session.returnedAt) : new Date();
    return Math.floor((returned.getTime() - departed.getTime()) / 60_000);
  }, [session]);

  const eyebrow = session
    ? `You're back · ${session.member.displayName} · ${session.boat.name} · ${session.boat.category}`
    : "You're back";

  async function handleSave() {
    if (!sessionId) return;
    setSaving(true);
    await fetch(`/api/sessions/${sessionId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        distanceMeters: distanceKm ? Math.round(distanceKm * 1000) : null,
        sessionType: sessionType ?? null,
        notes: notes.trim() || null,
      }),
    });
    router.push('/');
  }

  function handleCustomDistance() {
    const val = parseFloat(customDistanceInput);
    if (!isNaN(val) && val > 0) {
      setDistanceKm(val);
      setShowCustom(false);
    }
  }

  return (
    <>
      <Chrome />
      <div className="arf-body">
        <div className="screen-h">
          <div>
            <div className="eyebrow">{eyebrow}</div>
            <h1>Log a few details — or skip.</h1>
          </div>
          <span className="chip">Optional</span>
        </div>

        <div className="training">
          <div className="panel">
            <div>
              <div className="lbl">Distance</div>
              <div className="field">
                <div className="v">
                  {distanceKm !== null ? (
                    <>{distanceKm}<small>km</small></>
                  ) : (
                    <span style={{ color: 'var(--ink-mute)', fontSize: 28 }}>—</span>
                  )}
                </div>
              </div>
              <div className="duration-chips" style={{ marginTop: 8 }}>
                {DISTANCE_PRESETS.map((d) => (
                  <button
                    key={d}
                    className={distanceKm === d && !showCustom ? 'on' : ''}
                    onClick={() => { setDistanceKm(d); setShowCustom(false); }}
                  >
                    {d} km
                  </button>
                ))}
                <button
                  className={showCustom ? 'on' : ''}
                  onClick={() => setShowCustom(true)}
                >
                  Custom
                </button>
              </div>
              {showCustom && (
                <div style={{ display: 'flex', gap: 8, marginTop: 8, alignItems: 'center' }}>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    placeholder="km"
                    value={customDistanceInput}
                    onChange={(e) => setCustomDistanceInput(e.target.value)}
                    style={{ width: 80, padding: '6px 10px', borderRadius: 'var(--rad-sm)', border: '1px solid var(--ink-3)', fontFamily: 'var(--mono)', fontSize: 14 }}
                  />
                  <button className="btn btn-primary" onClick={handleCustomDistance}>Set</button>
                </div>
              )}
            </div>

            <div>
              <div className="lbl">Session type</div>
              <div className="seg" style={{ marginTop: 8, flexWrap: 'wrap' }}>
                {SESSION_TYPES.map((t) => (
                  <button
                    key={t}
                    className={sessionType === t ? 'on' : ''}
                    onClick={() => setSessionType(sessionType === t ? null : t)}
                  >
                    {SESSION_TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="lbl">Notes</div>
              <textarea
                placeholder="Conditions, observations, boat issues…"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>

          <div className="summary">
            <div className="lbl">Today's row</div>
            <div className="row">
              <span>Duration</span>
              <span className="v">{durationLabel(durationMinutes)}</span>
            </div>
            <div className="row">
              <span>Distance</span>
              <span className="v">{distanceKm !== null ? `${distanceKm} km` : '—'}</span>
            </div>
            <div className="row">
              <span>Avg pace</span>
              <span className="v">{paceLabel(distanceKm ?? 0, durationMinutes)}</span>
            </div>
            <div className="row">
              <span>Strokes</span>
              <span className="v">{strokesEstimate(distanceKm ?? 0)}</span>
            </div>
            {session && (
              <div style={{ marginTop: 'auto', fontSize: 13, color: 'rgba(242,237,227,0.7)', lineHeight: 1.5 }}>
                Logged under <b style={{ color: 'var(--sand)' }}>{session.boat.category}</b>.
              </div>
            )}
          </div>
        </div>

        <Footer>
          <button className="btn btn-text" onClick={() => router.push('/')}>
            Skip — just sign me in
          </button>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 14, alignItems: 'center' }}>
            <span style={{ color: 'var(--ink-mute)', fontSize: 14 }}>Saves to your training log</span>
            <button
              className="btn btn-primary btn-lg"
              disabled={saving}
              onClick={handleSave}
            >
              {saving ? 'Saving…' : 'Save row'} <span className="arr">→</span>
            </button>
          </div>
        </Footer>
      </div>
    </>
  );
}
