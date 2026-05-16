'use client';

import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import AdminChrome from '@/components/AdminChrome';

interface Boat {
  id: string;
  name: string;
  category: string;
  yearBuilt: number | null;
  weightKg: number | null;
  state: string;
  rackLocation: string | null;
  isActive: boolean;
  retiredReason: string | null;
  onWater: boolean;
  updatedAt: string;
}

function stateChip(state: string) {
  if (state === 'MAINTENANCE') return <span className="chip brass" style={{ fontSize: 10, padding: '3px 8px' }}>Workshop</span>;
  return <span className="chip ok" style={{ fontSize: 10, padding: '3px 8px' }}>Available</span>;
}

function AddBoatModal({ onClose, onAdded }: { onClose: () => void; onAdded: () => void }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [yearBuilt, setYearBuilt] = useState('');
  const [weightKg, setWeightKg] = useState('');
  const [rackLocation, setRackLocation] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setError('');
    setSubmitting(true);
    try {
      const res = await fetch('/api/admin/boats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category, yearBuilt, weightKg, rackLocation }),
      });
      if (res.ok) {
        onAdded();
        onClose();
      } else {
        const data = await res.json();
        setError(data.error ?? 'Failed to add boat');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-scrim">
      <div className="modal">
        <div className="mhead">
          <div className="lbl">Boats · Add new</div>
          <h2>Add a boat to the fleet.</h2>
        </div>
        <div className="mbody">
          <div className="form-grid">
            <div className="field full">
              <label htmlFor="ab-name">Name <span className="req">●</span></label>
              <input id="ab-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Kingfisher" />
            </div>
            <div className="field">
              <label htmlFor="ab-cat">Category <span className="req">●</span></label>
              <select id="ab-cat" className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select…</option>
                <option>1x</option>
                <option>2x</option>
                <option>2-</option>
                <option>4x</option>
                <option>4+</option>
                <option>4-</option>
                <option>8+</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="ab-year">Year built <span style={{ color: 'var(--ink-faint)', fontWeight: 400, marginLeft: 4 }}>Optional</span></label>
              <input id="ab-year" className="input" type="number" value={yearBuilt} onChange={(e) => setYearBuilt(e.target.value)} placeholder="e.g. 2021" />
            </div>
            <div className="field">
              <label htmlFor="ab-weight">Weight (kg) <span style={{ color: 'var(--ink-faint)', fontWeight: 400, marginLeft: 4 }}>Optional</span></label>
              <input id="ab-weight" className="input" type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} placeholder="e.g. 14" />
            </div>
            <div className="field">
              <label htmlFor="ab-rack">Rack location <span style={{ color: 'var(--ink-faint)', fontWeight: 400, marginLeft: 4 }}>Optional</span></label>
              <input id="ab-rack" className="input" value={rackLocation} onChange={(e) => setRackLocation(e.target.value)} placeholder="e.g. A · 3" />
            </div>
          </div>
          {error && <div className="error-banner" style={{ marginTop: 12 }}>{error}</div>}
        </div>
        <div className="mfoot">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            type="button"
            className="btn btn-primary"
            disabled={!name.trim() || !category || submitting}
            onClick={submit}
          >
            Add boat
          </button>
        </div>
      </div>
    </div>
  );
}

function RetireBoatModal({ boat, onClose, onRetired }: { boat: Boat; onClose: () => void; onRetired: () => void }) {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function submit() {
    setSubmitting(true);
    await fetch(`/api/admin/boats/${boat.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'retire', retiredReason: reason }),
    });
    setSubmitting(false);
    onRetired();
    onClose();
  }

  return (
    <div className="modal-scrim">
      <div className="modal">
        <div className="mhead">
          <div className="lbl" style={{ color: '#8A2E22' }}>● Destructive · Confirm required</div>
          <h2>Retire {boat.name}?</h2>
        </div>
        <div className="mbody">
          <p style={{ color: 'var(--ink-2)', fontSize: 15, lineHeight: 1.55, margin: '0 0 18px' }}>
            This boat will be hidden from the sign-out boat picker. Past sessions are preserved for fleet records — you can restore the boat to the fleet at any time.
          </p>
          {boat.onWater && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, padding: '10px 14px', background: '#FFF3CD', borderRadius: 8, fontSize: 13.5 }}>
              <span style={{ fontSize: 16 }}>⚠️</span>
              <span style={{ color: '#7A5F00' }}><b>This boat is currently on the water.</b> A crew has it signed out. You can still retire it, but it won&apos;t be returned automatically.</span>
            </div>
          )}
          <div style={{ display: 'flex', gap: 14, marginBottom: 18, padding: '14px 18px', background: 'var(--sand-2)', borderRadius: 10, alignItems: 'center' }}>
            <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 24 }}>{boat.name}</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-mute)' }}>
              {[boat.category, boat.yearBuilt, boat.weightKg ? `${boat.weightKg}kg` : null, boat.rackLocation].filter(Boolean).join(' · ')}
            </div>
          </div>
          <div className="field">
            <label htmlFor="retire-reason">Reason for retiring <span style={{ color: 'var(--ink-faint)', fontWeight: 400, marginLeft: 4 }}>Optional</span></label>
            <input id="retire-reason" className="input" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. Hull damage beyond repair" />
          </div>
        </div>
        <div className="mfoot">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button
            type="button"
            className="btn btn-primary"
            style={{ background: 'var(--clay)' }}
            disabled={submitting}
            onClick={submit}
          >
            Retire boat
          </button>
        </div>
      </div>
    </div>
  );
}

const CATEGORIES = ['All', '1x', '2x', '2-', '4x', '4+', '4-', '8+'];

export default function BoatsPage() {
  const [boats, setBoats] = useState<Boat[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'active' | 'retired'>('active');
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [retireTarget, setRetireTarget] = useState<Boat | null>(null);
  const [restoring, setRestoring] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/boats')
      .then((r) => r.json())
      .then((data) => setBoats(data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = boats
    .filter((b) => b.isActive === (tab === 'active'))
    .filter((b) => catFilter === 'All' || b.category === catFilter)
    .filter((b) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return b.name.toLowerCase().includes(q) || b.category.toLowerCase().includes(q);
    });

  const activeCount = boats.filter((b) => b.isActive).length;
  const retiredCount = boats.filter((b) => !b.isActive).length;

  async function restore(id: string) {
    setRestoring(id);
    await fetch(`/api/admin/boats/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'restore' }),
    });
    setRestoring(null);
    load();
  }

  function exportCsv() {
    const a = document.createElement('a');
    a.href = '/api/admin/boats/export';
    a.click();
  }

  return (
    <>
      <AdminChrome breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Admin', href: '/admin' }, { label: 'Boats' }]} />
      <div className="arf-body">
        <div className="screen-h">
          <div>
            <div className="eyebrow">Boats · {activeCount} active in fleet</div>
            <h1>The fleet</h1>
          </div>
          <div className="tabs">
            <button type="button" className={tab === 'active' ? 'on' : ''} onClick={() => setTab('active')}>
              Active <span className="badge">{activeCount}</span>
            </button>
            <button type="button" className={tab === 'retired' ? 'on' : ''} onClick={() => setTab('retired')}>
              Retired <span className="badge">{retiredCount}</span>
            </button>
          </div>
        </div>

        <div className="ahead-row">
          <div className="search" style={{ flex: '1 1 auto', maxWidth: 380 }}>
            <svg className="ic" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input placeholder="Search boats…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 6, marginLeft: 14 }}>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                className={`chip${catFilter === c ? ' solid' : ''}`}
                style={{ padding: '5px 12px', cursor: 'pointer', border: 'none', background: catFilter === c ? 'var(--ink)' : undefined, color: catFilter === c ? '#fff' : undefined }}
                onClick={() => setCatFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button type="button" className="btn btn-ghost" style={{ padding: '10px 14px', fontSize: 13 }} onClick={exportCsv}>↓ Export</button>
            <Link href="/admin/boats/import" className="btn btn-ghost" style={{ padding: '10px 14px', fontSize: 13 }}>↑ Import CSV</Link>
            <button type="button" className="btn btn-primary" style={{ padding: '10px 16px', fontSize: 13 }} onClick={() => setShowAdd(true)}>+ Add boat</button>
          </div>
        </div>

        <div className="page-content">
          {loading ? (
            <div style={{ padding: '40px 32px', color: 'var(--ink-mute)' }}>Loading…</div>
          ) : (
            <div className="atable boats">
              <div className="ahead">
                <div>Name</div>
                <div>Type</div>
                <div>Built</div>
                <div>Hull</div>
                <div>Rack</div>
                <div>State</div>
                <div style={{ textAlign: 'right' }}>Actions</div>
              </div>
              {filtered.length === 0 ? (
                <div style={{ padding: '32px', color: 'var(--ink-mute)', fontSize: 14 }}>No boats found.</div>
              ) : filtered.map((b) => (
                <div key={b.id} className={`arow${tab === 'retired' ? ' inactive' : ''}`}>
                  <div className="boatname">
                    <div>{b.name}</div>
                    {tab === 'retired' && b.retiredReason && (
                      <div style={{ fontSize: 11.5, color: 'var(--ink-mute)', marginTop: 2 }}>{b.retiredReason}</div>
                    )}
                  </div>
                  <div><span className="chip" style={{ fontSize: 10, padding: '3px 8px' }}>{b.category}</span></div>
                  <div className="date">{b.yearBuilt ?? '—'}</div>
                  <div className="date">{b.weightKg != null ? `${b.weightKg}kg` : '—'}</div>
                  <div className="date">{b.rackLocation ?? '—'}</div>
                  <div>
                    {tab === 'active' ? stateChip(b.state) : (
                      <span className="chip" style={{ fontSize: 10, padding: '3px 8px', opacity: 0.6 }}>Retired</span>
                    )}
                  </div>
                  <div className="acts">
                    {tab === 'active' ? (
                      <button type="button" className="danger" onClick={() => setRetireTarget(b)}>Retire</button>
                    ) : (
                      <button
                        type="button"
                        className="brass"
                        disabled={restoring === b.id}
                        onClick={() => restore(b.id)}
                      >
                        ↺ Restore to fleet
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
              Showing {filtered.length} of {tab === 'active' ? activeCount : retiredCount}
            </div>
          )}
        </div>
      </div>

      {showAdd && (
        <AddBoatModal onClose={() => setShowAdd(false)} onAdded={load} />
      )}

      {retireTarget && (
        <RetireBoatModal
          boat={retireTarget}
          onClose={() => setRetireTarget(null)}
          onRetired={load}
        />
      )}
    </>
  );
}
