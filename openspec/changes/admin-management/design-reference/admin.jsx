// admin.jsx — ARF admin / management screens (1024×768)
// Members + Boats CRUD, CSV import wizard.

// ── shared bits ───────────────────────────────────────

const ADMIN_MEMBERS = [
  { n: 'Mira Halligan',     e: 'mira.halligan@akademiska.se',  sq: 'Senior · S1',   mod: '12 May 2026', state: 'active' },
  { n: 'Theo Brennan',      e: 'theo.brennan@akademiska.se',   sq: 'Senior · S2',   mod: '11 May 2026', state: 'active' },
  { n: 'Sophie Carter',     e: 'sophie.carter@akademiska.se',  sq: 'Masters · MA',  mod: '08 May 2026', state: 'active' },
  { n: 'James Whittle',     e: 'james.whittle@akademiska.se',  sq: 'Senior · S1',   mod: '07 May 2026', state: 'active' },
  { n: 'Niamh O\u2019Connell', e: 'niamh.oconnell@akademiska.se', sq: 'Senior · S3', mod: '06 May 2026', state: 'active' },
  { n: 'Owen Frey',         e: 'owen.frey@akademiska.se',      sq: 'Novice',        mod: '04 May 2026', state: 'active' },
  { n: 'Ruth Garber',       e: 'ruth.garber@akademiska.se',    sq: 'Masters · MC',  mod: '02 May 2026', state: 'active' },
  { n: 'Karim Said',        e: 'karim.said@akademiska.se',     sq: 'Senior · S1',   mod: '01 May 2026', state: 'active' },
  { n: 'Anya Volkov',       e: 'anya.volkov@akademiska.se',    sq: 'Senior · S2',   mod: '28 Apr 2026', state: 'active' },
];

const ADMIN_MEMBERS_INACTIVE = [
  { n: 'Henrik Solberg',  e: 'henrik.solberg@akademiska.se', sq: 'Senior · S3', mod: '03 Mar 2026', state: 'inactive', reason: 'Moved away' },
  { n: 'Bea Lindqvist',   e: 'bea.lindqvist@akademiska.se',  sq: 'Masters · MB',mod: '14 Feb 2026', state: 'inactive', reason: 'Membership lapsed' },
  { n: 'Tomasz Wnuk',     e: 'tomasz.wnuk@akademiska.se',    sq: 'Novice',      mod: '20 Jan 2026', state: 'inactive', reason: 'Took up sailing' },
  { n: 'Esme Rideout',    e: 'esme.rideout@akademiska.se',   sq: 'Junior · J18',mod: '11 Dec 2025', state: 'inactive', reason: 'Off to university' },
];

const ADMIN_BOATS = [
  { n: 'Heron',      cat: '1x',  yr: '2021', wt: '14kg', rack: 'A · 3',  op: 'Available', fleet: 'Active' },
  { n: 'Kingfisher', cat: '2x',  yr: '2019', wt: '27kg', rack: 'A · 5',  op: 'Available', fleet: 'Active' },
  { n: 'Stormcock',  cat: '4x',  yr: '2017', wt: '52kg', rack: 'B · 1',  op: 'On water', fleet: 'Active' },
  { n: 'Otter',      cat: '1x',  yr: '2022', wt: '14kg', rack: 'A · 2',  op: 'Available', fleet: 'Active' },
  { n: 'Mallard',    cat: '2-',  yr: '2018', wt: '26kg', rack: 'A · 7',  op: 'Available', fleet: 'Active' },
  { n: 'Curlew',     cat: '4+',  yr: '2020', wt: '52kg', rack: 'B · 2',  op: 'On water', fleet: 'Active' },
  { n: 'Bittern',    cat: '2x',  yr: '2023', wt: '27kg', rack: 'A · 6',  op: 'Available', fleet: 'Active' },
  { n: 'Pintail',    cat: '8+',  yr: '2015', wt: '96kg', rack: 'C · 1',  op: 'Workshop',  fleet: 'Active' },
  { n: 'Lapwing',    cat: '4x',  yr: '2019', wt: '52kg', rack: 'B · 3',  op: 'Available', fleet: 'Active' },
];

const adminInit = (name) => name.split(/[\s+]+/).filter(Boolean).slice(0,2).map(w => w[0]).join('').toUpperCase();

// ── Chrome with gear ──────────────────────────────────
function ChromeAdmin({ subtitle = 'Tideway Boat Club', active = false, breadcrumb }) {
  return (
    <div className="arf-chrome">
      <div className="arf-brand">
        <svg className="mark" viewBox="0 0 24 24" fill="none">
          <path d="M2 14c3-2 5-2 8 0s5 2 8 0c1.5-1 2-1 4-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M2 18c3-2 5-2 8 0s5 2 8 0c1.5-1 2-1 4-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity=".4"/>
          <ellipse cx="12" cy="9" rx="9" ry="2.2" stroke="currentColor" strokeWidth="1.4" fill="none"/>
        </svg>
        <div className="name">ARF</div>
        <div className="club">{subtitle}</div>
        {breadcrumb}
      </div>
      <div className="arf-meta">
        <span><span className="dot"></span>Live</span>
        <span>Thu 14 May</span>
        <span className="now">06:42</span>
        <button className={`gear ${active ? 'active' : ''}`} aria-label="Admin">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" stroke="currentColor" strokeWidth="1.6"/>
            <path d="M19.4 13.7a1.7 1.7 0 0 0 .4 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.4 1.7 1.7 0 0 0-1 1.5v.2a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.4l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .4-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.4-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.4h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.4l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.4 1.9v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" stroke="currentColor" strokeWidth="1.4"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// breadcrumb component
function Crumb({ trail }) {
  return (
    <span className="crumb" style={{marginLeft:18}}>
      {trail.map((t, i) => (
        <React.Fragment key={i}>
          {i > 0 && <i></i>}
          {i === trail.length - 1 ? <b>{t}</b> : <span>{t}</span>}
        </React.Fragment>
      ))}
    </span>
  );
}

// ── 1. Chrome callout (existing dashboard, gear added) ─
function ChromeWithGear() {
  return (
    <div className="arf-1024 arf">
      <ChromeAdmin />
      <div className="arf-body" style={{justifyContent:'center', alignItems:'center', padding:'0 28px'}}>
        <div style={{textAlign:'center', maxWidth:560}}>
          <div style={{fontFamily:'var(--mono)', fontSize:11, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--ink-mute)'}}>Admin entry · Top-right gear</div>
          <h1 style={{fontFamily:'var(--serif)', fontStyle:'italic', fontWeight:400, fontSize:48, lineHeight:1.05, margin:'18px 0 14px', letterSpacing:'-0.01em'}}>
            One discreet gear, top right.
          </h1>
          <p style={{color:'var(--ink-mute)', fontSize:16, lineHeight:1.55}}>
            The kiosk stays focused on sign-out. Trusted volunteers tap the gear to open admin — no login, no friction. It activates a dark filled state so you know you've left the public flow.
          </p>
          <div style={{marginTop:28, display:'inline-flex', gap:10, alignItems:'center', fontFamily:'var(--mono)', fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--ink-mute)'}}>
            <span style={{display:'inline-block', width:18, height:18, borderRadius:9, background:'var(--ink)'}}></span>
            <span>Active gear · admin context</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 2. Admin home ─────────────────────────────────────
function AdminHome() {
  return (
    <div className="arf-1024 arf">
      <ChromeAdmin active breadcrumb={<Crumb trail={['Home', 'Admin']} />} />
      <div className="arf-body">
        <div className="screen-h">
          <div>
            <div className="eyebrow">Admin</div>
            <h1>What needs tending to?</h1>
          </div>
          <div className="chip">Last sync · Today 04:30 from Google Workspace</div>
        </div>

        <div className="admin-tiles">
          <div className="admin-tile">
            <div>
              <div className="lbl">Members</div>
            </div>
            <div className="v">47 <small>active</small></div>
            <p className="desc">The roster the kiosk shows. Add new rowers, deactivate when they leave the club, or import a fresh list from Google Workspace.</p>
            <div className="footrow">
              <div className="sublist">
                <span><b>4</b> inactive · hidden from sign-out</span>
                <span><b>3</b> added this month</span>
              </div>
              <span className="arrow">→</span>
            </div>
          </div>

          <div className="admin-tile">
            <div>
              <div className="lbl">Boats</div>
            </div>
            <div className="v">18 <small>boats</small></div>
            <p className="desc">The fleet. Add new shells, retire damaged ones, mark boats for workshop. Boats can be imported with the same CSV flow.</p>
            <div className="footrow">
              <div className="sublist">
                <span><b>1</b> retired · hidden from boat picker</span>
                <span><b>1</b> in workshop · <i>Pintail</i></span>
              </div>
              <span className="arrow">→</span>
            </div>
          </div>
        </div>

        <div className="arf-foot">
          <button className="btn btn-ghost btn-lg">← Back to kiosk</button>
          <div style={{marginLeft:'auto', display:'flex', gap:12, alignItems:'center'}}>
            <span style={{color:'var(--ink-mute)', fontSize:13}}>Schema v1 · No auth · Public kiosk</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 3. Member list — Active ───────────────────────────
function MemberListActive() {
  return (
    <div className="arf-1024 arf">
      <ChromeAdmin active breadcrumb={<Crumb trail={['Home', 'Admin', 'Members']} />} />
      <div className="arf-body">
        <div className="screen-h">
          <div>
            <div className="eyebrow">Members · 47 active</div>
            <h1>Roster</h1>
          </div>
          <div style={{display:'flex', gap:12, alignItems:'center'}}>
            <div className="tabs">
              <button className="on">Active <span className="badge">47</span></button>
              <button>Inactive <span className="badge">4</span></button>
            </div>
          </div>
        </div>

        <div className="ahead-row">
          <div className="search" style={{flex:'1 1 auto', maxWidth:420}}>
            <svg className="ic" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6"/>
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            <input placeholder="Search name or email…" defaultValue="" />
          </div>
          <div style={{marginLeft:'auto', display:'flex', gap:8}}>
            <button className="btn btn-ghost" style={{padding:'10px 16px', fontSize:13.5}}>↓ Export CSV</button>
            <button className="btn btn-ghost" style={{padding:'10px 16px', fontSize:13.5}}>↑ Import CSV</button>
            <button className="btn btn-primary" style={{padding:'10px 18px', fontSize:13.5}}>+ Add member</button>
          </div>
        </div>

        <div className="atable">
          <div className="ahead">
            <div>Member</div>
            <div>Email</div>
            <div>Squad</div>
            <div>Last modified</div>
            <div style={{textAlign:'right'}}>Actions</div>
          </div>
          {ADMIN_MEMBERS.map((m, i) => (
            <div key={i} className="arow">
              <div className="who">
                <div className="av">{adminInit(m.n)}</div>
                <div className="nm">{m.n}</div>
              </div>
              <div className="email">{m.e}</div>
              <div><span className="chip" style={{fontSize:10, padding:'3px 8px'}}>{m.sq}</span></div>
              <div className="date">{m.mod}</div>
              <div className="acts">
                <button>Edit</button>
                <button className="danger">Deactivate</button>
              </div>
            </div>
          ))}
        </div>

        <div className="arf-foot">
          <button className="btn btn-ghost">← Back</button>
          <div style={{marginLeft:'auto', color:'var(--ink-mute)', fontSize:13}}>
            Showing 9 of 47 · <b style={{color:'var(--ink)'}}>Type to filter</b>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 4. Member list — Inactive ─────────────────────────
function MemberListInactive() {
  return (
    <div className="arf-1024 arf">
      <ChromeAdmin active breadcrumb={<Crumb trail={['Home', 'Admin', 'Members']} />} />
      <div className="arf-body">
        <div className="screen-h">
          <div>
            <div className="eyebrow">Members · 4 inactive · hidden from sign-out</div>
            <h1>Former rowers</h1>
          </div>
          <div className="tabs">
            <button>Active <span className="badge">47</span></button>
            <button className="on">Inactive <span className="badge">4</span></button>
          </div>
        </div>

        <div className="ahead-row">
          <div style={{color:'var(--ink-mute)', fontSize:14, lineHeight:1.55, maxWidth:640}}>
            These members were deactivated. Their session history is preserved and counted in club records — they just don't appear on the sign-out kiosk.
          </div>
        </div>

        <div className="atable">
          <div className="ahead">
            <div>Member</div>
            <div>Email</div>
            <div>Last squad</div>
            <div>Deactivated</div>
            <div style={{textAlign:'right'}}>Actions</div>
          </div>
          {ADMIN_MEMBERS_INACTIVE.map((m, i) => (
            <div key={i} className="arow inactive">
              <div className="who">
                <div className="av" style={{background:'var(--mist)'}}>{adminInit(m.n)}</div>
                <div>
                  <div className="nm">{m.n}</div>
                  <div className="email" style={{marginTop:2, fontSize:11.5}}>{m.reason}</div>
                </div>
              </div>
              <div className="email">{m.e}</div>
              <div><span className="chip" style={{fontSize:10, padding:'3px 8px'}}>{m.sq}</span></div>
              <div className="date">{m.mod}</div>
              <div className="acts">
                <button className="brass">↺ Reactivate</button>
              </div>
            </div>
          ))}
        </div>

        <div className="arf-foot">
          <button className="btn btn-ghost">← Back</button>
        </div>
      </div>
    </div>
  );
}

// ── 5. Add member form (modal over list) ──────────────
function AddMemberModal({ withError = false }) {
  return (
    <div className="arf-1024 arf" style={{position:'relative'}}>
      <ChromeAdmin active breadcrumb={<Crumb trail={['Home', 'Admin', 'Members']} />} />
      <div className="arf-body" style={{filter:'blur(2px)', opacity:0.45}}>
        <div className="screen-h">
          <div>
            <div className="eyebrow">Members · 47 active</div>
            <h1>Roster</h1>
          </div>
        </div>
        <div className="atable">
          <div className="ahead">
            <div>Member</div><div>Email</div><div>Squad</div><div>Last modified</div><div></div>
          </div>
          {ADMIN_MEMBERS.slice(0, 5).map((m, i) => (
            <div key={i} className="arow">
              <div className="who"><div className="av">{adminInit(m.n)}</div><div className="nm">{m.n}</div></div>
              <div className="email">{m.e}</div>
              <div><span className="chip" style={{fontSize:10, padding:'3px 8px'}}>{m.sq}</span></div>
              <div className="date">{m.mod}</div>
              <div></div>
            </div>
          ))}
        </div>
      </div>

      <div className="modal-scrim">
        <div className="modal">
          <div className="mhead">
            <div className="lbl">Members · Add new</div>
            <h2>Welcome a new rower.</h2>
          </div>
          <div className="mbody">
            <div className="form-grid">
              <div className="field">
                <label>First name <span className="req">●</span></label>
                <div className="input">Linnea</div>
              </div>
              <div className="field">
                <label>Last name <span className="req">●</span></label>
                <div className="input">Bergström</div>
              </div>
              <div className="field full">
                <label>Email <span className="req">●</span></label>
                <div className={`input with-suffix ${withError ? 'error' : ''}`}>
                  <span>{withError ? 'linnea.bergstrom@gmail.com' : 'linnea.bergstrom@akademiska.se'}</span>
                  <span className="suf">@akademiska.se</span>
                </div>
                {withError ? (
                  <div className="err">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6"/><path d="M12 7v6m0 3v1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
                    Email must end in @akademiska.se — this address is from a different domain.
                  </div>
                ) : (
                  <div className="hint">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" opacity=".6"/><path d="M12 8v4m0 3v1.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity=".6"/></svg>
                    Must use an <b>@akademiska.se</b> address. This will become their Google SSO ID in v2.
                  </div>
                )}
              </div>
              <div className="field full">
                <label>Squad <span style={{color:'var(--ink-faint)', fontWeight:400, marginLeft:4}}>Optional</span></label>
                <div className="input with-suffix">
                  <span>Senior · S2</span>
                  <span className="suf">▾</span>
                </div>
                <div className="hint">Used for grouping in dashboards and training records.</div>
              </div>
            </div>
          </div>
          <div className="mfoot">
            <button className="btn btn-ghost">Cancel</button>
            <button className="btn btn-primary">Add member</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 6. Deactivate confirmation ────────────────────────
function DeactivateModal() {
  return (
    <div className="arf-1024 arf" style={{position:'relative'}}>
      <ChromeAdmin active breadcrumb={<Crumb trail={['Home', 'Admin', 'Members']} />} />
      <div className="arf-body" style={{filter:'blur(2px)', opacity:0.45}}>
        <div className="screen-h">
          <div><div className="eyebrow">Members · 47 active</div><h1>Roster</h1></div>
        </div>
        <div className="atable">
          <div className="ahead"><div>Member</div><div>Email</div><div>Squad</div><div>Last modified</div><div></div></div>
          {ADMIN_MEMBERS.slice(0, 5).map((m, i) => (
            <div key={i} className="arow">
              <div className="who"><div className="av">{adminInit(m.n)}</div><div className="nm">{m.n}</div></div>
              <div className="email">{m.e}</div>
              <div><span className="chip" style={{fontSize:10, padding:'3px 8px'}}>{m.sq}</span></div>
              <div className="date">{m.mod}</div><div></div>
            </div>
          ))}
        </div>
      </div>

      <div className="modal-scrim">
        <div className="modal">
          <div className="mhead">
            <div className="lbl" style={{color:'#8A2E22'}}>● Destructive · Confirm required</div>
            <h2>Deactivate Karim Said?</h2>
          </div>
          <div className="mbody" style={{color:'var(--ink-2)', fontSize:15, lineHeight:1.55}}>
            This member will be hidden from sign-out and all normal flows. Their session history is preserved and counted in club totals — they can be reactivated at any time.
            <div className="field" style={{marginTop:18}}>
              <label>Type <b style={{color:'var(--ink)'}}>KARIM SAID</b> to confirm</label>
              <div className="input" style={{fontFamily:'var(--mono)', letterSpacing:'0.06em'}}>KARIM SAID</div>
              <div className="hint">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L20 6" stroke="var(--ok)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Matches — Deactivate is ready.
              </div>
            </div>
          </div>
          <div className="mfoot">
            <button className="btn btn-ghost">Cancel</button>
            <button className="btn btn-primary" style={{background:'var(--clay)'}}>Deactivate</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 7. CSV import — Step A Upload ─────────────────────
function CsvUpload({ filled = false }) {
  return (
    <div className="arf-1024 arf">
      <ChromeAdmin active breadcrumb={<Crumb trail={['Home', 'Admin', 'Members', 'Import']} />} />
      <div className="arf-body">
        <div className="screen-h">
          <div>
            <div className="eyebrow">Members · CSV import</div>
            <h1>Upload your roster.</h1>
          </div>
          <div className="wizard-steps">
            <span className="s cur"><span className="n">1</span>Upload</span>
            <i></i>
            <span className="s"><span className="n">2</span>Review</span>
            <i></i>
            <span className="s"><span className="n">3</span>Apply</span>
          </div>
        </div>

        {!filled ? (
          <div className="dropzone armed">
            <div className="ico-disk">
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                <path d="M12 16V4m0 0-4 4m4-4 4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>Drop your CSV here</h3>
            <p>Or use Browse to find it. Accepts <b style={{color:'var(--ink)'}}>.csv</b> · up to 2 MB · expects columns first_name, last_name, email, squad.</p>
            <div style={{display:'flex', gap:12, marginTop:8}}>
              <button className="btn btn-primary">Browse files</button>
              <button className="btn btn-text">Download template</button>
            </div>
          </div>
        ) : (
          <div className="dropzone filled">
            <div className="ico-disk">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="file-meta">
              <div className="nm">tideway-members-2026-05-14.csv</div>
              <div className="sub">62 rows · 8.4 KB · selected just now</div>
              <div style={{marginTop:10, fontSize:13.5, color:'var(--ink-2)', lineHeight:1.55, fontFamily:'var(--sans), inherit', letterSpacing:0}}>
                Looks like a member roster. We'll compare it to the current list and show you what would change before anything is written.
              </div>
            </div>
            <div style={{display:'flex', flexDirection:'column', gap:8}}>
              <span className="chip ok">CSV detected</span>
              <button className="btn btn-text" style={{padding:'6px 8px', fontSize:13}}>Replace</button>
            </div>
          </div>
        )}

        <div className="arf-foot">
          <button className="btn btn-ghost">Cancel</button>
          <div style={{marginLeft:'auto', display:'flex', gap:14, alignItems:'center'}}>
            <span style={{color:'var(--ink-mute)', fontSize:13}}>{filled ? 'Nothing will be written until you approve.' : 'Nothing will change yet.'}</span>
            <button className="btn btn-primary btn-lg" style={{opacity: filled ? 1 : 0.4}}>
              Check for changes <span className="arr">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 8. CSV import — Step B Dry-run (clean) ────────────
function CsvDryRun() {
  return (
    <div className="arf-1024 arf">
      <ChromeAdmin active breadcrumb={<Crumb trail={['Home', 'Admin', 'Members', 'Import']} />} />
      <div className="arf-body">
        <div className="screen-h">
          <div>
            <div className="eyebrow">Members · CSV import · tideway-members-2026-05-14.csv</div>
            <h1>Review before applying.</h1>
          </div>
          <div className="wizard-steps">
            <span className="s done"><span className="n">✓</span>Upload</span>
            <i></i>
            <span className="s cur"><span className="n">2</span>Review</span>
            <i></i>
            <span className="s"><span className="n">3</span>Apply</span>
          </div>
        </div>

        <div className="dryrun-summary">
          <div className="sumcard add">
            <div className="glyph">＋</div>
            <div className="v">3</div>
            <div className="k">Will be added</div>
          </div>
          <div className="sumcard upd">
            <div className="glyph">✎</div>
            <div className="v">12</div>
            <div className="k">Will be updated</div>
          </div>
          <div className="sumcard deact">
            <div className="glyph">⊘</div>
            <div className="v">2</div>
            <div className="k">Will be deactivated</div>
          </div>
          <div className="sumcard none">
            <div className="glyph">—</div>
            <div className="v">45</div>
            <div className="k">Unchanged</div>
          </div>
        </div>

        <div style={{flex:1, overflow:'auto'}}>
          <div className="acc add open">
            <div className="ahd">
              <div className="glyph">＋</div>
              <div className="ttl">Will be added</div>
              <span className="meta">3 rows · CSV rows 12, 28, 47</span>
              <span className="chev">▾</span>
            </div>
            <div className="abody">
              <div className="row">
                <div className="who"><div className="av">LB</div><div><div style={{fontWeight:500}}>Linnea Bergström</div></div></div>
                <div className="em">linnea.bergstrom@akademiska.se</div>
                <div className="sq">Senior · S2</div>
                <div><span className="chip ok" style={{fontSize:10, padding:'3px 8px'}}>New</span></div>
              </div>
              <div className="row">
                <div className="who"><div className="av">DR</div><div><div style={{fontWeight:500}}>Dougal Reith</div></div></div>
                <div className="em">dougal.reith@akademiska.se</div>
                <div className="sq">Masters · MB</div>
                <div><span className="chip ok" style={{fontSize:10, padding:'3px 8px'}}>New</span></div>
              </div>
              <div className="row">
                <div className="who"><div className="av">YM</div><div><div style={{fontWeight:500}}>Yuki Mori</div></div></div>
                <div className="em">yuki.mori@akademiska.se</div>
                <div className="sq">Novice</div>
                <div><span className="chip ok" style={{fontSize:10, padding:'3px 8px'}}>New</span></div>
              </div>
            </div>
          </div>

          <div className="acc upd open">
            <div className="ahd">
              <div className="glyph">✎</div>
              <div className="ttl">Will be updated</div>
              <span className="meta">12 rows · mostly squad changes</span>
              <span className="chev">▾</span>
            </div>
            <div className="abody">
              <div className="row">
                <div className="who"><div className="av">SC</div><div><div style={{fontWeight:500}}>Sophie Carter</div></div></div>
                <div className="em">sophie.carter@akademiska.se</div>
                <div className="sq">Squad</div>
                <div className="diff"><span><del>Masters · MA</del> → <ins>Masters · MB</ins></span></div>
              </div>
              <div className="row">
                <div className="who"><div className="av">JW</div><div><div style={{fontWeight:500}}>James Whittle</div></div></div>
                <div className="em">james.whittle@akademiska.se</div>
                <div className="sq">Squad</div>
                <div className="diff"><span><del>Senior · S1</del> → <ins>Senior · S2</ins></span></div>
              </div>
              <div className="row">
                <div className="who"><div className="av">OF</div><div><div style={{fontWeight:500}}>Owen Frey</div></div></div>
                <div className="em">owen.frey@akademiska.se</div>
                <div className="sq">Squad</div>
                <div className="diff"><span><del>Novice</del> → <ins>Senior · S3</ins></span></div>
              </div>
              <div className="row" style={{color:'var(--ink-mute)'}}>
                <div style={{gridColumn:'1 / -1', textAlign:'center', fontSize:12.5, padding:'4px 0'}}>+ 9 more updates · expand row to see all</div>
              </div>
            </div>
          </div>

          <div className="acc deact">
            <div className="ahd">
              <div className="glyph">⊘</div>
              <div className="ttl">Will be deactivated</div>
              <span className="meta">2 rows · present in DB but not in CSV</span>
              <span className="chev" style={{transform:'rotate(-90deg)', display:'inline-block'}}>▾</span>
            </div>
          </div>
        </div>

        <div className="arf-foot">
          <button className="btn btn-ghost">← Replace file</button>
          <div style={{marginLeft:'auto', display:'flex', gap:14, alignItems:'center'}}>
            <button className="btn btn-text">Cancel</button>
            <button className="btn btn-primary btn-lg">Apply 17 changes <span className="arr">→</span></button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 9. CSV import — error state ───────────────────────
function CsvErrors() {
  return (
    <div className="arf-1024 arf">
      <ChromeAdmin active breadcrumb={<Crumb trail={['Home', 'Admin', 'Members', 'Import']} />} />
      <div className="arf-body">
        <div className="screen-h">
          <div>
            <div className="eyebrow" style={{color:'#8A2E22'}}>Members · CSV import · 4 problems found</div>
            <h1 style={{color:'#6E1F14'}}>Fix the file first.</h1>
          </div>
          <div className="wizard-steps">
            <span className="s done"><span className="n">✓</span>Upload</span>
            <i></i>
            <span className="s cur"><span className="n">2</span>Review</span>
            <i></i>
            <span className="s"><span className="n">3</span>Apply</span>
          </div>
        </div>

        <div className="error-banner">
          <div className="ehd">
            <div className="glyph">!</div>
            <div>
              <div className="ttl">4 problems in tideway-members-2026-05-14.csv</div>
              <div style={{fontSize:12.5, color:'#8A2E22'}}>Nothing was written. Edit the CSV, save, and re-upload.</div>
            </div>
            <span className="sub">No changes applied</span>
          </div>
          <div className="elist">
            <div className="erow">
              <div className="rnum">Row 7</div>
              <div className="fld">email</div>
              <div className="desc">Missing — every member needs an email address.</div>
            </div>
            <div className="erow">
              <div className="rnum">Row 14</div>
              <div className="fld">email</div>
              <div className="desc">'henrik.solberg@gmail.com' isn't on @akademiska.se. Update the address or remove the row.</div>
            </div>
            <div className="erow">
              <div className="rnum">Row 22</div>
              <div className="fld">email</div>
              <div className="desc">Duplicate of row 9 (mira.halligan@akademiska.se) — each email can only appear once.</div>
            </div>
            <div className="erow">
              <div className="rnum">Row 38</div>
              <div className="fld">squad</div>
              <div className="desc">'Mastres · MA' isn't a recognised squad. Did you mean 'Masters · MA'?</div>
            </div>
          </div>
        </div>

        <div style={{padding:'0 28px', color:'var(--ink-mute)', fontSize:14, lineHeight:1.55, maxWidth:720}}>
          The summary will appear here once the file is clean. We refuse to show a partial diff so you can't accidentally apply a half-broken roster.
        </div>

        <div className="arf-foot">
          <button className="btn btn-ghost">← Replace file</button>
          <div style={{marginLeft:'auto', display:'flex', gap:14, alignItems:'center'}}>
            <button className="btn btn-text">Download annotated CSV</button>
            <button className="btn btn-primary btn-lg" style={{opacity:0.4}}>Apply changes <span className="arr">→</span></button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 10. CSV import — Step C Success ───────────────────
function CsvSuccess() {
  return (
    <div className="arf-1024 arf">
      <ChromeAdmin active breadcrumb={<Crumb trail={['Home', 'Admin', 'Members', 'Import']} />} />
      <div className="arf-body">
        <div className="screen-h">
          <div></div>
          <div className="wizard-steps">
            <span className="s done"><span className="n">✓</span>Upload</span>
            <i></i>
            <span className="s done"><span className="n">✓</span>Review</span>
            <i></i>
            <span className="s cur"><span className="n">3</span>Apply</span>
          </div>
        </div>

        <div className="success-state">
          <div className="check">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="big">Done. 17 changes applied.</h2>
          <p className="sub">The roster on the kiosk is now in sync with your CSV. Sessions logged before the change are preserved — nothing was lost.</p>
          <div className="summary-row">
            <div>Added<b>3</b></div>
            <div>Updated<b>12</b></div>
            <div>Deactivated<b>2</b></div>
            <div>Untouched<b>45</b></div>
          </div>
          <div style={{marginTop:36, display:'flex', gap:12}}>
            <button className="btn btn-primary btn-lg">Back to member list</button>
            <button className="btn btn-ghost btn-lg">Download change log</button>
          </div>
        </div>

        <div className="arf-foot">
          <button className="btn btn-text">Import another file</button>
          <div style={{marginLeft:'auto', color:'var(--ink-mute)', fontSize:13}}>
            Saved 14 May 2026 · 06:46 · by <b style={{color:'var(--ink)'}}>Kiosk admin</b>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 11. Boat management list ──────────────────────────
function BoatList() {
  return (
    <div className="arf-1024 arf">
      <ChromeAdmin active breadcrumb={<Crumb trail={['Home', 'Admin', 'Boats']} />} />
      <div className="arf-body">
        <div className="screen-h">
          <div>
            <div className="eyebrow">Boats · 18 active in fleet</div>
            <h1>The fleet</h1>
          </div>
          <div className="tabs">
            <button className="on">Active <span className="badge">18</span></button>
            <button>Retired <span className="badge">3</span></button>
          </div>
        </div>

        <div className="ahead-row">
          <div className="search" style={{flex:'1 1 auto', maxWidth:380}}>
            <svg className="ic" width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6"/>
              <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            <input placeholder="Search boats…" defaultValue="" />
          </div>
          <div style={{display:'flex', gap:8, marginLeft:14}}>
            <span className="chip solid" style={{padding:'5px 12px'}}>All</span>
            <span className="chip" style={{padding:'5px 12px'}}>1x</span>
            <span className="chip" style={{padding:'5px 12px'}}>2x</span>
            <span className="chip" style={{padding:'5px 12px'}}>4x · 4+</span>
            <span className="chip" style={{padding:'5px 12px'}}>8+</span>
          </div>
          <div style={{marginLeft:'auto', display:'flex', gap:8}}>
            <button className="btn btn-ghost" style={{padding:'10px 14px', fontSize:13}}>↓ Export</button>
            <button className="btn btn-ghost" style={{padding:'10px 14px', fontSize:13}}>↑ Import CSV</button>
            <button className="btn btn-primary" style={{padding:'10px 16px', fontSize:13}}>+ Add boat</button>
          </div>
        </div>

        <div className="atable boats">
          <div className="ahead">
            <div>Name</div>
            <div>Type</div>
            <div>Built</div>
            <div>Hull</div>
            <div>Rack</div>
            <div>State</div>
            <div style={{textAlign:'right'}}>Actions</div>
          </div>
          {ADMIN_BOATS.map((b, i) => (
            <div key={i} className="arow">
              <div className="boatname">{b.n}</div>
              <div><span className="chip" style={{fontSize:10, padding:'3px 8px'}}>{b.cat}</span></div>
              <div className="date">{b.yr}</div>
              <div className="date">{b.wt}</div>
              <div className="date">{b.rack}</div>
              <div>
                {b.op === 'Available' && <span className="chip ok" style={{fontSize:10, padding:'3px 8px'}}>Available</span>}
                {b.op === 'On water' && <span className="chip clay" style={{fontSize:10, padding:'3px 8px'}}>On water</span>}
                {b.op === 'Workshop' && <span className="chip brass" style={{fontSize:10, padding:'3px 8px'}}>Workshop</span>}
              </div>
              <div className="acts">
                <button>Edit</button>
                <button className="danger">Retire</button>
              </div>
            </div>
          ))}
        </div>

        <div className="arf-foot">
          <button className="btn btn-ghost">← Back</button>
          <div style={{marginLeft:'auto', color:'var(--ink-mute)', fontSize:13}}>
            9 of 18 boats shown · <b style={{color:'var(--ink)'}}>Pintail</b> is in workshop until 18 May
          </div>
        </div>
      </div>
    </div>
  );
}

// ── 12. Retire boat confirmation ──────────────────────
function RetireBoatModal() {
  return (
    <div className="arf-1024 arf" style={{position:'relative'}}>
      <ChromeAdmin active breadcrumb={<Crumb trail={['Home', 'Admin', 'Boats']} />} />
      <div className="arf-body" style={{filter:'blur(2px)', opacity:0.45}}>
        <div className="screen-h">
          <div><div className="eyebrow">Boats · 18 active</div><h1>The fleet</h1></div>
        </div>
        <div className="atable boats">
          <div className="ahead"><div>Name</div><div>Type</div><div>Built</div><div>Hull</div><div>Rack</div><div>State</div><div></div></div>
          {ADMIN_BOATS.slice(0,4).map((b, i) => (
            <div key={i} className="arow">
              <div className="boatname">{b.n}</div>
              <div><span className="chip" style={{fontSize:10, padding:'3px 8px'}}>{b.cat}</span></div>
              <div className="date">{b.yr}</div><div className="date">{b.wt}</div><div className="date">{b.rack}</div>
              <div></div><div></div>
            </div>
          ))}
        </div>
      </div>

      <div className="modal-scrim">
        <div className="modal">
          <div className="mhead">
            <div className="lbl" style={{color:'#8A2E22'}}>● Destructive · Confirm required</div>
            <h2>Retire Stormcock?</h2>
          </div>
          <div className="mbody" style={{color:'var(--ink-2)', fontSize:15, lineHeight:1.55}}>
            This boat will be hidden from the sign-out boat picker and all live views. Past sessions on Stormcock are preserved for fleet records, and you can restore the boat to the fleet at any time.
            <div style={{display:'flex', gap:14, marginTop:18, padding:'14px 18px', background:'var(--sand-2)', borderRadius:10, alignItems:'center'}}>
              <div style={{fontFamily:'var(--serif)', fontStyle:'italic', fontSize:28, lineHeight:1}}>Stormcock</div>
              <div style={{fontFamily:'var(--mono)', fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--ink-mute)'}}>
                4x · 2017 · 52 kg · Rack B · 1
              </div>
              <div style={{marginLeft:'auto'}}>
                <span className="chip clay" style={{fontSize:10, padding:'3px 8px'}}>On water now</span>
              </div>
            </div>
            <div className="field" style={{marginTop:18}}>
              <label>Reason for retiring <span style={{color:'var(--ink-faint)', fontWeight:400, marginLeft:4}}>Optional, kept in fleet log</span></label>
              <div className="input">Hull damage during outing of 12 May. Beyond repair.</div>
            </div>
          </div>
          <div className="mfoot">
            <button className="btn btn-ghost">Cancel</button>
            <button className="btn btn-primary" style={{background:'var(--clay)'}}>Retire boat</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── expose ────────────────────────────────────────────
Object.assign(window, {
  ARFAdmChromeWithGear: ChromeWithGear,
  ARFAdmHome: AdminHome,
  ARFAdmMemberListActive: MemberListActive,
  ARFAdmMemberListInactive: MemberListInactive,
  ARFAdmAddMemberModal: AddMemberModal,
  ARFAdmDeactivateModal: DeactivateModal,
  ARFAdmCsvUpload: CsvUpload,
  ARFAdmCsvDryRun: CsvDryRun,
  ARFAdmCsvErrors: CsvErrors,
  ARFAdmCsvSuccess: CsvSuccess,
  ARFAdmBoatList: BoatList,
  ARFAdmRetireBoatModal: RetireBoatModal,
});
