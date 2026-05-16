'use client';

import Link from 'next/link';
import { useRef, useState } from 'react';
import AdminChrome from '@/components/AdminChrome';
import WizardSteps from '@/components/admin/WizardSteps';

interface RowError {
  row: number;
  field: string;
  message: string;
}

interface BoatDiff {
  id?: string;
  name: string;
  category: string;
  yearBuilt: number | null;
  weightKg: number | null;
  rackLocation: string | null;
  state: string;
  isActive: boolean;
  retiredReason: string | null;
}

interface DiffResult {
  added: BoatDiff[];
  updated: BoatDiff[];
  deactivated: BoatDiff[];
  unchanged: BoatDiff[];
}

type Step = 'upload' | 'review' | 'done';

export default function BoatImportPage() {
  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [checking, setChecking] = useState(false);
  const [applying, setApplying] = useState(false);
  const [errors, setErrors] = useState<RowError[]>([]);
  const [diff, setDiff] = useState<DiffResult | null>(null);
  const [appliedDiff, setAppliedDiff] = useState<DiffResult | null>(null);
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(['added', 'updated']));
  const fileInputRef = useRef<HTMLInputElement>(null);

  function toggleSection(key: string) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f?.name.endsWith('.csv')) setFile(f);
  }

  async function checkChanges() {
    if (!file) return;
    setChecking(true);
    setErrors([]);
    setDiff(null);
    try {
      const text = await file.text();
      const res = await fetch('/api/admin/boats/import?mode=dry-run', {
        method: 'POST',
        body: text,
        headers: { 'Content-Type': 'text/csv' },
      });
      const data = await res.json();
      setErrors(data.errors ?? []);
      setDiff(data.diff ?? null);
      setStep('review');
    } finally {
      setChecking(false);
    }
  }

  async function applyChanges() {
    if (!file) return;
    setApplying(true);
    try {
      const text = await file.text();
      const res = await fetch('/api/admin/boats/import?mode=apply', {
        method: 'POST',
        body: text,
        headers: { 'Content-Type': 'text/csv' },
      });
      const data = await res.json();
      if (data.errors?.length > 0) {
        setErrors(data.errors);
      } else {
        setAppliedDiff(data.diff);
        setStep('done');
      }
    } finally {
      setApplying(false);
    }
  }

  const totalChanges = diff ? diff.added.length + diff.updated.length + diff.deactivated.length : 0;

  if (step === 'done' && appliedDiff) {
    return (
      <>
        <AdminChrome breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Admin', href: '/admin' }, { label: 'Boats', href: '/admin/boats' }, { label: 'Import' }]} />
        <div className="arf-body">
          <div className="screen-h">
            <div />
            <WizardSteps step="done" />
          </div>
          <div className="page-content">
            <div className="success-state">
              <div className="check">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h2 className="big">
                Done. {appliedDiff.added.length + appliedDiff.updated.length + appliedDiff.deactivated.length} changes applied.
              </h2>
              <p className="sub">
                The fleet on the kiosk is now in sync with your CSV. Past session data is preserved.
              </p>
              <div className="summary-row">
                <div>Added<b>{appliedDiff.added.length}</b></div>
                <div>Updated<b>{appliedDiff.updated.length}</b></div>
                <div>Retired<b>{appliedDiff.deactivated.length}</b></div>
                <div>Untouched<b>{appliedDiff.unchanged.length}</b></div>
              </div>
              <div style={{ marginTop: 36, display: 'flex', gap: 12 }}>
                <Link href="/admin/boats" className="btn btn-primary btn-lg">Back to boat list</Link>
              </div>
            </div>
          </div>
          <div className="arf-foot">
            <button type="button" className="btn btn-text" onClick={() => { setStep('upload'); setFile(null); setDiff(null); setErrors([]); }}>Import another file</button>
          </div>
        </div>
      </>
    );
  }

  if (step === 'review') {
    return (
      <>
        <AdminChrome breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Admin', href: '/admin' }, { label: 'Boats', href: '/admin/boats' }, { label: 'Import' }]} />
        <div className="arf-body">
          <div className="screen-h">
            <div>
              {errors.length > 0 ? (
                <>
                  <div className="eyebrow" style={{ color: '#8A2E22' }}>Boats · CSV import · {errors.length} problem{errors.length !== 1 ? 's' : ''} found</div>
                  <h1 style={{ color: '#6E1F14' }}>Fix the file first.</h1>
                </>
              ) : (
                <>
                  <div className="eyebrow">Boats · CSV import · {file?.name}</div>
                  <h1>Review before applying.</h1>
                </>
              )}
            </div>
            <WizardSteps step="review" />
          </div>

          {errors.length > 0 ? (
            <>
              <div className="page-content">
                <div className="error-banner">
                  <div className="ehd">
                    <div className="glyph">!</div>
                    <div>
                      <div className="ttl">{errors.length} problem{errors.length !== 1 ? 's' : ''} in {file?.name}</div>
                      <div style={{ fontSize: 12.5, color: '#8A2E22' }}>Nothing was written. Edit the CSV, save, and re-upload.</div>
                    </div>
                    <span className="sub">No changes applied</span>
                  </div>
                  <div className="elist">
                    {errors.map((e) => (
                      <div key={`${e.row}-${e.field}`} className="erow">
                        <div className="rnum">Row {e.row}</div>
                        <div className="fld">{e.field}</div>
                        <div className="desc">{e.message}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="arf-foot">
                <button type="button" className="btn btn-ghost" onClick={() => { setStep('upload'); setErrors([]); }}>← Replace file</button>
                <div style={{ marginLeft: 'auto' }}>
                  <button type="button" className="btn btn-primary btn-lg" disabled style={{ opacity: 0.4 }}>Apply changes <span className="arr">→</span></button>
                </div>
              </div>
            </>
          ) : diff ? (
            <>
              <div className="page-content">
                <div className="dryrun-summary">
                  <div className="sumcard add">
                    <div className="glyph">＋</div>
                    <div className="v">{diff.added.length}</div>
                    <div className="k">Will be added</div>
                  </div>
                  <div className="sumcard upd">
                    <div className="glyph">✎</div>
                    <div className="v">{diff.updated.length}</div>
                    <div className="k">Will be updated</div>
                  </div>
                  <div className="sumcard deact">
                    <div className="glyph">⊘</div>
                    <div className="v">{diff.deactivated.length}</div>
                    <div className="k">Will be retired</div>
                  </div>
                  <div className="sumcard none">
                    <div className="glyph">—</div>
                    <div className="v">{diff.unchanged.length}</div>
                    <div className="k">Unchanged</div>
                  </div>
                </div>

                <div style={{ flex: 1, overflow: 'auto' }}>
                  {diff.added.length > 0 && (
                    <div className={`acc add${openSections.has('added') ? ' open' : ''}`}>
                      <button type="button" className="ahd" onClick={() => toggleSection('added')}>
                        <div className="glyph">＋</div>
                        <div className="ttl">Will be added</div>
                        <span className="meta">{diff.added.length} boat{diff.added.length !== 1 ? 's' : ''}</span>
                        <span className="chev" style={{ transform: openSections.has('added') ? undefined : 'rotate(-90deg)', display: 'inline-block' }}>▾</span>
                      </button>
                      {openSections.has('added') && (
                        <div className="abody">
                          {diff.added.map((b) => (
                            <div key={b.name} className="row">
                              <div className="who"><div style={{ fontWeight: 500 }}>{b.name}</div></div>
                              <div className="em"><span className="chip" style={{ fontSize: 10, padding: '3px 8px' }}>{b.category}</span></div>
                              <div className="sq">{b.yearBuilt ?? ''}</div>
                              <div><span className="chip ok" style={{ fontSize: 10, padding: '3px 8px' }}>New</span></div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {diff.updated.length > 0 && (
                    <div className={`acc upd${openSections.has('updated') ? ' open' : ''}`}>
                      <button type="button" className="ahd" onClick={() => toggleSection('updated')}>
                        <div className="glyph">✎</div>
                        <div className="ttl">Will be updated</div>
                        <span className="meta">{diff.updated.length} boat{diff.updated.length !== 1 ? 's' : ''}</span>
                        <span className="chev" style={{ transform: openSections.has('updated') ? undefined : 'rotate(-90deg)', display: 'inline-block' }}>▾</span>
                      </button>
                      {openSections.has('updated') && (
                        <div className="abody">
                          {diff.updated.map((b) => (
                            <div key={b.name} className="row">
                              <div className="who"><div style={{ fontWeight: 500 }}>{b.name}</div></div>
                              <div className="em"><span className="chip" style={{ fontSize: 10, padding: '3px 8px' }}>{b.category}</span></div>
                              <div className="sq">{b.yearBuilt ?? ''}</div>
                              <div><span className="chip brass" style={{ fontSize: 10, padding: '3px 8px' }}>Updated</span></div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {diff.deactivated.length > 0 && (
                    <div className={`acc deact${openSections.has('deactivated') ? ' open' : ''}`}>
                      <button type="button" className="ahd" onClick={() => toggleSection('deactivated')}>
                        <div className="glyph">⊘</div>
                        <div className="ttl">Will be retired</div>
                        <span className="meta">{diff.deactivated.length} boat{diff.deactivated.length !== 1 ? 's' : ''} · in DB but not in CSV</span>
                        <span className="chev" style={{ transform: openSections.has('deactivated') ? undefined : 'rotate(-90deg)', display: 'inline-block' }}>▾</span>
                      </button>
                      {openSections.has('deactivated') && (
                        <div className="abody">
                          {diff.deactivated.map((b) => (
                            <div key={b.name} className="row">
                              <div className="who"><div style={{ fontWeight: 500 }}>{b.name}</div></div>
                              <div className="em"><span className="chip" style={{ fontSize: 10, padding: '3px 8px' }}>{b.category}</span></div>
                              <div className="sq">{b.yearBuilt ?? ''}</div>
                              <div><span className="chip clay" style={{ fontSize: 10, padding: '3px 8px' }}>Retire</span></div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="arf-foot">
                <button type="button" className="btn btn-ghost" onClick={() => { setStep('upload'); setDiff(null); }}>← Replace file</button>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 14, alignItems: 'center' }}>
                  <button type="button" className="btn btn-text" onClick={() => { setStep('upload'); setDiff(null); }}>Cancel</button>
                  <button
                    type="button"
                    className="btn btn-primary btn-lg"
                    disabled={totalChanges === 0 || applying}
                    style={{ opacity: totalChanges === 0 ? 0.4 : 1 }}
                    onClick={applyChanges}
                  >
                    {applying ? 'Applying…' : `Apply ${totalChanges} change${totalChanges !== 1 ? 's' : ''}`} <span className="arr">→</span>
                  </button>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </>
    );
  }

  return (
    <>
      <AdminChrome breadcrumb={[{ label: 'Home', href: '/' }, { label: 'Admin', href: '/admin' }, { label: 'Boats', href: '/admin/boats' }, { label: 'Import' }]} />
      <div className="arf-body">
        <div className="screen-h">
          <div>
            <div className="eyebrow">Boats · CSV import</div>
            <h1>Upload your fleet.</h1>
          </div>
          <WizardSteps step="upload" />
        </div>

        <div className="page-content">
          {!file ? (
            <section
              aria-label="CSV drop zone"
              className={`dropzone armed${dragOver ? ' dragover' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              <div className="ico-disk">
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 16V4m0 0-4 4m4-4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </div>
              <h3>Drop your CSV here</h3>
              <p>Or use Browse to find it. Expects columns <b>name, category</b> (required) plus yearBuilt, weightKg, rackLocation, state, isActive.</p>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="button" className="btn btn-primary" onClick={() => fileInputRef.current?.click()}>Browse files</button>
                <a href="/api/admin/boats/export?template=1" className="btn btn-text" download>Download template</a>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                style={{ display: 'none' }}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f); }}
              />
            </section>
          ) : (
            <div className="dropzone filled">
              <div className="ico-disk">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                  <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="file-meta">
                <div className="nm">{file.name}</div>
                <div className="sub">{(file.size / 1024).toFixed(1)} KB</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <span className="chip ok">CSV detected</span>
                <button type="button" className="btn btn-text" style={{ padding: '6px 8px', fontSize: 13 }} onClick={() => setFile(null)}>Replace</button>
              </div>
            </div>
          )}
        </div>

        <div className="arf-foot">
          <Link href="/admin/boats" className="btn btn-ghost">Cancel</Link>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 14, alignItems: 'center' }}>
            <span style={{ color: 'var(--ink-mute)', fontSize: 13 }}>{file ? 'Nothing will be written until you approve.' : 'Nothing will change yet.'}</span>
            <button
              type="button"
              className="btn btn-primary btn-lg"
              disabled={!file || checking}
              style={{ opacity: file ? 1 : 0.4 }}
              onClick={checkChanges}
            >
              {checking ? 'Checking…' : 'Check for changes'} <span className="arr">→</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
