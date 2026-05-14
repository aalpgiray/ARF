'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Chrome from '@/components/Chrome';
import Footer from '@/components/Footer';
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

interface MemberInfo { displayName: string }
interface BoatInfo { name: string; category: string; weightKg: number | null }

export default function ReturnTimePage() {
  const router = useRouter();
  const params = useSearchParams();
  const memberId = params.get('member_id');
  const boatId = params.get('boat_id');

  const [member, setMember] = useState<MemberInfo | null>(null);
  const [boat, setBoat] = useState<BoatInfo | null>(null);
  const [durationMinutes, setDurationMinutes] = useState(75);
  const [submitting, setSubmitting] = useState(false);

  const now = useMemo(() => new Date(), []);
  const returnTime = addMinutes(now, durationMinutes);
  const initials = (name: string) =>
    name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();

  useEffect(() => {
    if (memberId) {
      fetch(`/api/members/${memberId}`)
        .then((r) => r.json())
        .then(setMember);
    }
    if (boatId) {
      fetch(`/api/boats/${boatId}`)
        .then((r) => r.json())
        .then(setBoat);
    }
  }, [memberId, boatId]);

  async function handleConfirm() {
    if (!memberId || !boatId) return;
    setSubmitting(true);
    const res = await fetch('/api/sessions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId, boatId, durationMinutes }),
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

        <div className="time-pick">
          <div className="dial">
            <div className="lbl">Duration</div>
            <div className="big">{durationLabel(durationMinutes)}</div>
            <div className="lbl">Common durations</div>
            <div className="duration-chips">
              {PRESETS.map((p) => (
                <button
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
            {member && boat && (
              <div className="who">
                <div className="av">{initials(member.displayName)}</div>
                <div>
                  <div className="nm">{member.displayName}</div>
                  <div className="boat">
                    {boat.name} · {boat.category}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <Footer>
          <button
            className="btn btn-ghost btn-lg"
            onClick={() => router.push(`/sign-out/boat?member_id=${memberId}`)}
          >
            ← Back
          </button>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 14, alignItems: 'center' }}>
            <span style={{ color: 'var(--ink-mute)', fontSize: 14, maxWidth: 280, textAlign: 'right' }}>
              We&rsquo;ll flag overdue if you&rsquo;re not back by{' '}
              <b style={{ color: 'var(--ink)' }}>{fmtTime(addMinutes(returnTime, 15))}</b>.
            </span>
            <button
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
