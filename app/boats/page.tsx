'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Chrome from '@/components/Chrome';
import Footer from '@/components/Footer';
import PageContent from '@/components/PageContent';

type BoatState = 'available' | 'out' | 'maintenance';

interface Boat {
  id: string;
  name: string;
  category: string;
  yearBuilt: number | null;
  weightKg: number | null;
  rackLocation: string | null;
  effectiveState: BoatState;
}

const STATE_FILTERS: { label: string; value: BoatState | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Available', value: 'available' },
  { label: 'On water', value: 'out' },
  { label: 'Maintenance', value: 'maintenance' },
];

function stateChipClass(state: BoatState) {
  if (state === 'available') return 'chip ok';
  if (state === 'out') return 'chip clay';
  return 'chip brass';
}

function stateLabel(state: BoatState, rackLocation: string | null) {
  if (state === 'available') return rackLocation ? `Rack ${rackLocation}` : 'Available';
  if (state === 'out') return 'On water';
  return 'Workshop';
}

export default function BoatsPage() {
  const router = useRouter();
  const [boats, setBoats] = useState<Boat[]>([]);
  const [filter, setFilter] = useState<BoatState | 'all'>('all');

  useEffect(() => {
    fetch('/api/boats').then((r) => r.json()).then(setBoats);
  }, []);

  const counts = {
    available: boats.filter((b) => b.effectiveState === 'available').length,
    out: boats.filter((b) => b.effectiveState === 'out').length,
    maintenance: boats.filter((b) => b.effectiveState === 'maintenance').length,
  };

  const visible = filter === 'all' ? boats : boats.filter((b) => b.effectiveState === filter);

  return (
    <>
      <Chrome />
      <div className="arf-body">
        <div className="screen-h">
          <div>
            <div className="eyebrow">Fleet · {boats.length} boat{boats.length !== 1 ? 's' : ''}</div>
            <h1>Boat registry</h1>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {STATE_FILTERS.map((f) => {
              const count = f.value === 'all' ? boats.length : counts[f.value];
              const isActive = filter === f.value;
              let cls = isActive ? 'chip solid' : 'chip';
              if (!isActive && f.value === 'out') cls = 'chip clay';
              if (!isActive && f.value === 'maintenance') cls = 'chip brass';
              return (
                <button
                  type="button"
                  key={f.value}
                  className={cls}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setFilter(f.value)}
                >
                  {f.label} {count > 0 && count}
                </button>
              );
            })}
          </div>
        </div>

        <PageContent>
          <div className="registry">
            {visible.map((b) => (
              <div key={b.id} className="b">
                <div className="top">
                  <div>
                    <div className="nm">{b.name}</div>
                    <div className="cat" style={{ marginTop: 6 }}>{b.category}</div>
                  </div>
                  <span
                    className={stateChipClass(b.effectiveState)}
                    style={{ fontSize: 9, padding: '3px 8px' }}
                  >
                    {stateLabel(b.effectiveState, b.rackLocation)}
                  </span>
                </div>
                <div className="meta">
                  {b.yearBuilt && <span><b>{b.yearBuilt}</b> built</span>}
                  {b.weightKg && <span><b>{b.weightKg} kg</b></span>}
                </div>
              </div>
            ))}
          </div>
        </PageContent>

        <Footer>
          <button type="button" className="btn btn-ghost btn-lg" onClick={() => router.push('/')}>
            ← Back to dashboard
          </button>
        </Footer>
      </div>
    </>
  );
}
