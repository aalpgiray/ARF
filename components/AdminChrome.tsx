'use client';

import Link from 'next/link';
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

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface AdminChromeProps {
  breadcrumb?: BreadcrumbItem[];
}

export default function AdminChrome({ breadcrumb }: AdminChromeProps) {
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
        {breadcrumb && breadcrumb.length > 0 && (
          <span className="crumb" style={{ marginLeft: 18 }}>
            {breadcrumb.map((item, i) => (
              <span key={i}>
                {i > 0 && <i />}
                {i === breadcrumb.length - 1 ? (
                  <b>{item.label}</b>
                ) : item.href ? (
                  <Link href={item.href}>{item.label}</Link>
                ) : (
                  <span>{item.label}</span>
                )}
              </span>
            ))}
          </span>
        )}
      </div>

      <div className="arf-meta">
        <span>
          <span className="dot" />
          Live
        </span>
        {now && <span>{formatDate(now)}</span>}
        {now && <span className="now">{formatTime(now)}</span>}
        <Link href="/admin" aria-label="Admin" title="Admin" className="gear active">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" role="presentation">
            <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" strokeWidth="1.6"/>
            <path d="M19.4 13.7a1.7 1.7 0 0 0 .4 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.4 1.7 1.7 0 0 0-1 1.5v.2a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.4l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .4-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.4-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.4h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.4l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.4 1.9v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" stroke="currentColor" strokeWidth="1.4"/>
          </svg>
        </Link>
      </div>
    </header>
  );
}
