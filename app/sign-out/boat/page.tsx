'use client';

import { useState, useEffect, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Chrome from '@/components/Chrome';
import Footer from '@/components/Footer';
import StepIndicator from '@/components/StepIndicator';

interface BoatRecord {
  id: string;
  name: string;
  category: string;
  yearBuilt: number | null;
  weightKg: number | null;
  effectiveState: 'available' | 'out' | 'maintenance';
}

const CATEGORIES = ['1x', '2x', '2-', '4x', '4+', '8+'];

function BoatPickerPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const memberId = params.get('member_id');

  const [boats, setBoats] = useState<BoatRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [catFilter, setCatFilter] = useState<string | null>(null);
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    fetch('/api/boats')
      .then((r) => r.json())
      .then(setBoats)
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (!catFilter) return boats;
    return boats.filter((b) => b.category === catFilter);
  }, [boats, catFilter]);

  const selected = boats.find((b) => b.id === selectedId);
  const availableCount = boats.filter((b) => b.effectiveState === 'available').length;

  return (
    <>
      <Chrome />
      <div className="arf-body">
        <div className="screen-h">
          <div>
            <div className="eyebrow">Sign out · Step 2 of 3</div>
            <h1>Which boat are you taking?</h1>
          </div>
          <StepIndicator current="boat" />
        </div>

        <div className="search-row">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              className={`chip ${catFilter === null ? 'solid' : ''}`}
              onClick={() => setCatFilter(null)}
              style={{ cursor: 'pointer' }}
            >
              Available {availableCount}
            </button>
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`chip ${catFilter === c ? 'solid' : ''}`}
                onClick={() => setCatFilter(catFilter === c ? null : c)}
                style={{ cursor: 'pointer' }}
              >
                {c}
              </button>
            ))}
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button
              className="chip"
              onClick={() => setLayout(layout === 'grid' ? 'list' : 'grid')}
              style={{ cursor: 'pointer' }}
            >
              {layout === 'grid' ? 'Grid' : 'List'}
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ padding: '40px 32px', color: 'var(--ink-mute)' }}>Loading boats…</div>
        ) : layout === 'grid' ? (
          <div className="boat-grid">
            {filtered.map((b) => {
              const unavailable = b.effectiveState !== 'available';
              return (
                <div
                  key={b.id}
                  className={[
                    'boat-card',
                    selectedId === b.id ? 'selected' : '',
                    unavailable ? 'unavailable' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => !unavailable && setSelectedId(b.id)}
                >
                  {b.effectiveState === 'out' && <span className="pill out">Out</span>}
                  {b.effectiveState === 'maintenance' && <span className="pill out">Maint.</span>}
                  {selectedId === b.id && <span className="pill">Selected</span>}
                  <div className="cat">{b.category} · scull</div>
                  <div className="nm">{b.name}</div>
                  <div className="meta">
                    {b.yearBuilt && <span><b>{b.yearBuilt}</b> built</span>}
                    {b.weightKg && <span><b>{b.weightKg}kg</b></span>}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="boat-list">
            {filtered.map((b) => {
              const unavailable = b.effectiveState !== 'available';
              return (
                <div
                  key={b.id}
                  className={['boat-row', selectedId === b.id ? 'selected' : ''].filter(Boolean).join(' ')}
                  onClick={() => !unavailable && setSelectedId(b.id)}
                  style={{ cursor: unavailable ? 'not-allowed' : 'pointer', opacity: unavailable ? 0.45 : 1 }}
                >
                  <div>
                    <div className="nm">{b.name}</div>
                    <div className="cat" style={{ marginTop: 4 }}>{b.category}</div>
                  </div>
                  {b.yearBuilt && <div className="cat">Built {b.yearBuilt}</div>}
                  {b.weightKg && <div className="cat">Hull {b.weightKg}kg</div>}
                  <div className="cat">
                    {b.effectiveState === 'available' ? 'On rack' : b.effectiveState === 'out' ? 'On water' : 'Workshop'}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {selectedId === b.id ? (
                      <span className="chip brass">Selected</span>
                    ) : b.effectiveState !== 'available' ? (
                      <span className="chip clay">Unavailable</span>
                    ) : (
                      <span className="chip ok">Available</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Footer>
          <button className="btn btn-ghost btn-lg" onClick={() => router.push('/sign-out')}>
            ← Back
          </button>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 14, alignItems: 'center' }}>
            {selected && (
              <span style={{ color: 'var(--ink-mute)', fontSize: 14 }}>
                <b style={{ color: 'var(--ink)' }}>{selected.name}</b> · {selected.category}
                {selected.weightKg ? ` · ${selected.weightKg}kg` : ''}
              </span>
            )}
            <button
              className="btn btn-primary btn-lg"
              disabled={!selectedId}
              style={{ opacity: selectedId ? 1 : 0.4 }}
              onClick={() =>
                router.push(`/sign-out/return?member_id=${memberId}&boat_id=${selectedId}`)
              }
            >
              Set return time <span className="arr">→</span>
            </button>
          </div>
        </Footer>
      </div>
    </>
  );
}

export default function BoatPickerPage() {
  return (
    <Suspense fallback={null}>
      <BoatPickerPageInner />
    </Suspense>
  );
}
