'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import Chrome from '@/components/Chrome';
import Footer from '@/components/Footer';
import PageContent from '@/components/PageContent';
import StepIndicator from '@/components/StepIndicator';

const PRESETS = [
  { label: '30 min', minutes: 30 },
  { label: '45 min', minutes: 45 },
  { label: '1 h', minutes: 60 },
  { label: '1 h 15 m', minutes: 75 },
  { label: '1 h 30 m', minutes: 90 },
  { label: '2 h', minutes: 120 },
];

function pad(n: number) { return String(n).padStart(2, '0'); }

function addMinutes(d: Date, m: number) {
  return new Date(d.getTime() + m * 60_000);
}

function fmtTime(d: Date) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function durationLabel(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return <>{m}<small>m</small></>;
  if (m === 0) return <>{h}<small>h</small></>;
  return <>{h}<small>h</small> {m}<small>m</small></>;
}

interface BoatInfo { name: string; category: string; weightKg: number | null }

function ReturnTimePageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const memberIdsParam = params.get('member_ids') ?? '';
  const boatId = params.get('boat_id');

  const crewMemberIds = useMemo(
    () => memberIdsParam.split(',').filter(Boolean),
    [memberIdsParam]
  );

  const [boat, setBoat] = useState<BoatInfo | null>(null);
  const [durationMinutes, setDurationMinutes] = useState(75);
  const [submitting, setSubmitting] = useState(false);

  const now = useMemo(() => new Date(), []);
  const returnTime = addMinutes(now, durationMinutes);

  useEffect(() => {
    if (boatId) {
      fetch(`/api/boats/${boatId}`)
        .then((r) => r.json())
        .then(setBoat);
    }
  }, [boatId]);

  async function handleConfirm() {
    if (!crewMemberIds.length || !boatId) return;
    setSubmitting(true);
    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ crewMemberIds, boatId, durationMinutes }),
    });
    if (res.ok) {
      router.push('/');
    } else {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Chrome />
      <div className="arf-body">
        <div className="screen-h">
          <div>
            <div className="eyebrow">Sign out · Step 3 of 3</div>
            <h1>When will you be back?</h1>
          </div>
          <StepIndicator current="return" />
        </div>

        <PageContent>
          <div className="time-pick">
            <div className="dial">
              <div className="lbl">Duration</div>
              <div className="big">{durationLabel(durationMinutes)}</div>
              <div className="lbl">Common durations</div>
              <div className="duration-chips">
                {PRESETS.map((p) => (
                  <button
                    type="button"
                    key={p.minutes}
                    className={durationMinutes === p.minutes ? 'on' : ''}
                    onClick={() => setDurationMinutes(p.minutes)}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="return-card">
              <div className="lbl">Expected back</div>
              <div className="when">{fmtTime(returnTime)}</div>
              <div className="for">Have a great row!</div>
              {boat && (
                <div className="who">
                  <div>
                    <div className="nm">{crewMemberIds.length} crew</div>
                    <div className="boat">
                      {boat.name} · {boat.category}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </PageContent>

        <Footer>
          <button
            type="button"
            className="btn btn-ghost btn-lg"
            onClick={() => router.push(`/sign-out/boat?member_ids=${memberIdsParam}&boat_id=${boatId}`)}
          >
            ← Back
          </button>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 14, alignItems: 'center' }}>
            <span style={{ color: 'var(--ink-mute)', fontSize: 14, maxWidth: 280, textAlign: 'right' }}>
              We&rsquo;ll flag overdue if you&rsquo;re not back by{' '}
              <b style={{ color: 'var(--ink)' }}>{fmtTime(addMinutes(returnTime, 15))}</b>.
            </span>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              disabled={submitting}
              onClick={handleConfirm}
            >
              Off you go <span className="arr">→</span>
            </button>
          </div>
        </Footer>
      </div>
    </>
  );
}

export default function ReturnTimePage() {
  return (
    <Suspense fallback={null}>
      <ReturnTimePageInner />
    </Suspense>
  );
}
