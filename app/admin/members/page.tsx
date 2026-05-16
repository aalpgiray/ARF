'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import AdminChrome from '@/components/AdminChrome';
import ConfirmNameModal from '@/components/admin/ConfirmNameModal';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  squad: string | null;
  isActive: boolean;
  deactivationReason: string | null;
  updatedAt: string;
}

function initials(first: string, last: string) {
  return `${first[0] ?? ''}${last[0] ?? ''}`.toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function AddMemberModal({
  onClose,
  onAdded,
  allowedDomain,
}: {
  onClose: () => void;
  onAdded: () => void;
  allowedDomain: string | null;
}) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [squad, setSquad] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, squad }),
      });
      if (res.ok) {
        onAdded();
        onClose();
      } else {
        const data = await res.json();
        setError(data.error ?? 'Failed to add member');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-scrim">
      <div className="modal">
        <div className="mhead">
          <div className="lbl">Members · Add new</div>
          <h2>Welcome a new rower.</h2>
        </div>
        <div className="mbody">
          <div className="form-grid">
            <div className="field">
              <label htmlFor="am-first">First name <span className="req">●</span></label>
              <input id="am-first" className="input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="am-last">Last name <span className="req">●</span></label>
              <input id="am-last" className="input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div className="field full">
              <label htmlFor="am-email">Email <span className="req">●</span></label>
              <input
                id="am-email"
                className={`input${error?.includes('mail') ? ' error' : ''}`}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {allowedDomain && (
                <div className="hint">Must use a <b>@{allowedDomain}</b> address.</div>
              )}
            </div>
            <div className="field full">
              <label htmlFor="am-squad">Squad <span style={{ color: 'var(--ink-faint)', fontWeight: 400, marginLeft: 4 }}>Optional</span></label>
              <input id="am-squad" className="input" value={squad} onChange={(e) => setSquad(e.target.value)} placeholder="e.g. Senior · S1" />
            </div>
          </div>
          {error && (
            <div className="error-banner" style={{ marginTop: 12 }}>{error}</div>
          )}
        </div>
        <div className="mfoot">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!firstName.trim() || !lastName.trim() || !email.trim() || submitting}
            onClick={submit}
          >
            Add member
          </button>
        </div>
      </div>
    </div>
  );
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'active' | 'inactive'>('active');
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [deactivateTarget, setDeactivateTarget] = useState<Member | null>(null);
  const [reactivating, setReactivating] = useState<string | null>(null);
  const [allowedDomain, setAllowedDomain] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/members')
      .then((r) => r.json())
      .then((data) => {
        setMembers(data.members);
        setAllowedDomain(data.allowedDomain);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = members
    .filter((m) => m.isActive === (tab === 'active'))
    .filter((m) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        m.firstName.toLowerCase().includes(q) ||
        m.lastName.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q)
      );
    });

  const activeCount = members.filter((m) => m.isActive).length;
  const inactiveCount = members.filter((m) => !m.isActive).length;

  async function deactivate(member: Member, reason?: string) {
    await fetch(`/api/admin/members/${member.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'deactivate', deactivationReason: reason ?? null }),
    });
    setDeactivateTarget(null);
    load();
  }

  async function reactivate(id: string) {
    setReactivating(id);
    await fetch(`/api/admin/members/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reactivate' }),
    });
    setReactivating(null);
    load();
  }

  function exportCsv() {
    const a = document.createElement('a');
    a.href = '/api/admin/members/export';
    a.click();
  }

  return (
    <>
      <AdminChrome breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Admin', href: '/admin' }, { label: 'Members' }]} />
      <div className="arf-body">
        <div className="screen-h">
          <div>
            <div className="eyebrow">Members · {activeCount} active</div>
            <h1>Roster</h1>
          </div>
          <div className="tabs">
            <button type="button" className={tab === 'active' ? 'on' : ''} onClick={() => setTab('active')}>
              Active <span className="badge">{activeCount}</span>
            </button>
            <button type="button" className={tab === 'inactive' ? 'on' : ''} onClick={() => setTab('inactive')}>
              Inactive <span className="badge">{inactiveCount}</span>
            </button>
          </div>
        </div>

        <div className="ahead-row">
          {tab === 'active' ? (
            <>
              <div className="search" style={{ flex: '1 1 auto', maxWidth: 420 }}>
                <svg className="ic" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
                  <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                <input
                  placeholder="Search name or email…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                <button type="button" className="btn btn-ghost" style={{ padding: '10px 16px', fontSize: 13.5 }} onClick={exportCsv}>
                  ↓ Export CSV
                </button>
                <Link href="/admin/members/import" className="btn btn-ghost" style={{ padding: '10px 16px', fontSize: 13.5 }}>
                  ↑ Import CSV
                </Link>
                <button type="button" className="btn btn-primary" style={{ padding: '10px 18px', fontSize: 13.5 }} onClick={() => setShowAdd(true)}>
                  + Add member
                </button>
              </div>
            </>
          ) : (
            <div style={{ color: 'var(--ink-mute)', fontSize: 14, lineHeight: 1.55, maxWidth: 640 }}>
              These members were deactivated. Their session history is preserved — they just don&apos;t appear on the sign-out kiosk.
            </div>
          )}
        </div>

        <div className="page-content">
          {loading ? (
            <div style={{ padding: '40px 32px', color: 'var(--ink-mute)' }}>Loading…</div>
          ) : (
            <div className="atable">
              <div className="ahead">
                <div>Member</div>
                <div>Email</div>
                <div>Squad</div>
                <div>{tab === 'active' ? 'Last modified' : 'Deactivated'}</div>
                <div style={{ textAlign: 'right' }}>Actions</div>
              </div>
              {filtered.length === 0 ? (
                <div style={{ padding: '32px', color: 'var(--ink-mute)', fontSize: 14 }}>No members found.</div>
              ) : filtered.map((m) => (
                <div key={m.id} className={`arow${tab === 'inactive' ? ' inactive' : ''}`}>
                  <div className="who">
                    <div className="av" style={tab === 'inactive' ? { background: 'var(--mist)' } : {}}>
                      {initials(m.firstName, m.lastName)}
                    </div>
                    <div>
                      <div className="nm">{m.firstName} {m.lastName}</div>
                      {tab === 'inactive' && m.deactivationReason && (
                        <div style={{ fontSize: 11.5, color: 'var(--ink-mute)', marginTop: 2 }}>{m.deactivationReason}</div>
                      )}
                    </div>
                  </div>
                  <div className="email">{m.email}</div>
                  <div>
                    {m.squad && <span className="chip" style={{ fontSize: 10, padding: '3px 8px' }}>{m.squad}</span>}
                  </div>
                  <div className="date">{formatDate(m.updatedAt)}</div>
                  <div className="acts">
                    {tab === 'active' ? (
                      <button type="button" className="danger" onClick={() => setDeactivateTarget(m)}>Deactivate</button>
                    ) : (
                      <button
                        type="button"
                        className="brass"
                        disabled={reactivating === m.id}
                        onClick={() => reactivate(m.id)}
                      >
                        ↺ Reactivate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="arf-foot">
          <Link href="/admin" className="btn btn-ghost">← Back</Link>
          {filtered.length > 0 && (
            <div style={{ marginLeft: 'auto', color: 'var(--ink-mute)', fontSize: 13 }}>
              Showing {filtered.length} of {tab === 'active' ? activeCount : inactiveCount}
            </div>
          )}
        </div>
      </div>

      {showAdd && (
        <AddMemberModal
          allowedDomain={allowedDomain}
          onClose={() => setShowAdd(false)}
          onAdded={load}
        />
      )}

      {deactivateTarget && (
        <ConfirmNameModal
          title={`Deactivate ${deactivateTarget.firstName} ${deactivateTarget.lastName}?`}
          body="This member will be hidden from sign-out and all normal flows. Their session history is preserved — they can be reactivated at any time."
          confirmName={`${deactivateTarget.firstName} ${deactivateTarget.lastName}`}
          confirmLabel="Deactivate"
          reasonLabel="Reason for deactivating"
          onConfirm={(reason) => deactivate(deactivateTarget, reason)}
          onCancel={() => setDeactivateTarget(null)}
        />
      )}
    </>
  );
}
