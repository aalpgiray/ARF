'use client';

import { useEffect, useState } from 'react';

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function formatTime(d: Date) {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatDate(d: Date) {
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
}

export default function Chrome() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const clubName = process.env.NEXT_PUBLIC_CLUB_NAME ?? 'Rowing Club';

  return (
    <header className="arf-chrome">
      <div className="arf-brand">
        <svg className="mark" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M2 14c3-2 5-2 8 0s5 2 8 0c1.5-1 2-1 4-1"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <path
            d="M2 18c3-2 5-2 8 0s5 2 8 0c1.5-1 2-1 4-1"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            opacity=".4"
          />
          <ellipse
            cx="12"
            cy="9"
            rx="9"
            ry="2.2"
            stroke="currentColor"
            strokeWidth="1.4"
            fill="none"
          />
        </svg>
        <div className="name">ARF</div>
        <div className="club">{clubName}</div>
      </div>

      <div className="arf-meta">
        <span>
          <span className="dot" />
          Live
        </span>
        {now && <span>{formatDate(now)}</span>}
        {now && <span className="now">{formatTime(now)}</span>}
        <span>Tide info</span>
      </div>
    </header>
  );
}
