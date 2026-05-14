import Link from 'next/link';

interface Props {
  tone?: 'friendly' | 'neutral';
}

export default function EmptyState({ tone = 'friendly' }: Props) {
  return (
    <div className="arf-body">
      <div className="empty">
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--ink-mute)',
          }}
        >
          All boats home
        </p>
        <h2 className="big" style={{ marginTop: 14 }}>
          {tone === 'friendly' ? 'All quiet on the water.' : 'No active sessions.'}
        </h2>
        <p className="sub">
          {tone === 'friendly'
            ? 'Nobody out right now. Be the first one off the pontoon.'
            : 'No crews are currently signed out.'}
        </p>
        <div style={{ marginTop: 40, display: 'flex', gap: 14 }}>
          <Link href="/sign-out" className="btn btn-primary btn-lg">
            Sign out a boat <span className="arr">→</span>
          </Link>
          <Link href="/boats" className="btn btn-ghost btn-lg">
            Boat registry
          </Link>
        </div>
        <div className="bands" />
      </div>
    </div>
  );
}
