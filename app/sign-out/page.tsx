'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useMemo, useState } from 'react';
import Chrome from '@/components/Chrome';
import Footer from '@/components/Footer';
import PageContent from '@/components/PageContent';
import StepIndicator from '@/components/StepIndicator';
import { useMembers } from '@/lib/hooks/useMembers';

const ALPHA = ['All', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

function MemberPickerPageInner() {
  const router = useRouter();
  const params = useSearchParams();
  const { members, loading } = useMembers();
  const [search, setSearch] = useState('');
  const [alpha, setAlpha] = useState('All');
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    (params.get('member_ids') ?? '').split(',').filter(Boolean)
  );

  const filtered = useMemo(() => {
    let list = members;
    if (alpha !== 'All') {
      list = list.filter((m) => m.displayName.toUpperCase().startsWith(alpha));
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((m) => m.displayName.toLowerCase().includes(q));
    }
    return list;
  }, [members, alpha, search]);

  function toggleMember(id: string) {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  return (
    <>
      <Chrome />
      <div className="arf-body">
        <div className="screen-h">
          <div>
            <div className="eyebrow">Sign out · Step 1 of 3</div>
            <h1>Who&rsquo;s heading out?</h1>
          </div>
          <StepIndicator current="member" />
        </div>

        <div className="search-row">
          <div className="search">
            <svg aria-hidden="true" className="ic" width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
            <input
              placeholder="Search members…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setAlpha('All'); }}
            />
            <span className="kbd">Type to search</span>
          </div>
          <div className="alpha">
            {ALPHA.map((l) => (
              <button
                type="button"
                key={l}
                className={alpha === l ? 'on' : ''}
                onClick={() => { setAlpha(l); setSearch(''); }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        <PageContent>
          {loading ? (
            <div style={{ padding: '40px 32px', color: 'var(--ink-mute)' }}>Loading members…</div>
          ) : (
            <div className="member-grid">
              {filtered.map((m) => (
                <button
                  type="button"
                  key={m.id}
                  className={`member ${selectedIds.includes(m.id) ? 'selected' : ''}`}
                  onClick={() => toggleMember(m.id)}
                >
                  <div className="av">{initials(m.displayName)}</div>
                  <div>
                    <div className="nm">{m.displayName}</div>
                    {m.squad && <div className="meta">{m.squad}</div>}
                  </div>
                </button>
              ))}
            </div>
          )}
        </PageContent>

        <Footer>
          <button type="button" className="btn btn-ghost btn-lg" onClick={() => router.push('/')}>
            ← Cancel
          </button>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 14, alignItems: 'center' }}>
            {selectedIds.length > 0 && (
              <span style={{ color: 'var(--ink-mute)', fontSize: 14 }}>
                <b style={{ color: 'var(--ink)' }}>{selectedIds.length}</b> crew selected
              </span>
            )}
            <button
              type="button"
              className="btn btn-primary btn-lg"
              disabled={selectedIds.length === 0}
              onClick={() => router.push(`/sign-out/boat?member_ids=${selectedIds.join(',')}`)}
              style={{ opacity: selectedIds.length > 0 ? 1 : 0.4 }}
            >
              Choose a boat <span className="arr">→</span>
            </button>
          </div>
        </Footer>
      </div>
    </>
  );
}

export default function MemberPickerPage() {
  return (
    <Suspense fallback={null}>
      <MemberPickerPageInner />
    </Suspense>
  );
}
