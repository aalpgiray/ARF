// screens.jsx — ARF rowing club kiosk screens
// All screens rendered as a 1280×800 .arf container with a chrome / body / foot.

// ── data ──────────────────────────────────────────────
const NOW = '06:42';
const TODAY = 'Thu 14 May';

const MEMBERS = [
  { n: 'Mira Halligan',  squad: 'Senior · S1' },
  { n: 'Theo Brennan',   squad: 'Senior · S2' },
  { n: 'Sophie Carter',  squad: 'Masters · MA' },
  { n: 'James Whittle',  squad: 'Senior · S1' },
  { n: 'Niamh O\u2019Connell', squad: 'Senior · S3' },
  { n: 'Owen Frey',      squad: 'Novice' },
  { n: 'Ruth Garber',    squad: 'Masters · MC' },
  { n: 'Karim Said',     squad: 'Senior · S1' },
  { n: 'Anya Volkov',    squad: 'Senior · S2' },
  { n: 'Patrick Doolan', squad: 'Coach' },
  { n: 'Eve Astley',     squad: 'Novice' },
  { n: 'Hari Menon',     squad: 'Senior · S3' },
  { n: 'Lena Boateng',   squad: 'Masters · MB' },
  { n: 'Cal Reardon',    squad: 'Junior · J18' },
  { n: 'Saoirse Quill',  squad: 'Senior · S2' },
  { n: 'Marco Trent',    squad: 'Senior · S1' },
  { n: 'Imogen Vale',    squad: 'Masters · MA' },
  { n: 'Felix Rowe',     squad: 'Junior · J16' },
];

const BOATS = [
  { n: 'Heron',      cat: '1x',  yr: '2021', wt: '14kg', state: 'available' },
  { n: 'Kingfisher', cat: '2x',  yr: '2019', wt: '27kg', state: 'available' },
  { n: 'Stormcock',  cat: '4x',  yr: '2017', wt: '52kg', state: 'out' },
  { n: 'Otter',      cat: '1x',  yr: '2022', wt: '14kg', state: 'available' },
  { n: 'Mallard',    cat: '2-',  yr: '2018', wt: '26kg', state: 'available' },
  { n: 'Curlew',     cat: '4+',  yr: '2020', wt: '52kg', state: 'out' },
  { n: 'Bittern',    cat: '2x',  yr: '2023', wt: '27kg', state: 'available' },
  { n: 'Pintail',    cat: '8+',  yr: '2015', wt: '96kg', state: 'maintenance' },
  { n: 'Lapwing',    cat: '4x',  yr: '2019', wt: '52kg', state: 'available' },
  { n: 'Tern',       cat: '1x',  yr: '2020', wt: '14kg', state: 'available' },
  { n: 'Razorbill',  cat: '2x',  yr: '2018', wt: '27kg', state: 'available' },
  { n: 'Shearwater', cat: '4+',  yr: '2022', wt: '54kg', state: 'available' },
];

// active sessions for dashboard
const SESSIONS = [
  { who: 'Mira Halligan',    av: 'MH', boat: 'Heron',      cat: '1x',  out: '05:48', back: '07:00', dur: '54m', status: 'on-water' },
  { who: 'Karim Said + Anya Volkov', av: 'K+A', boat: 'Kingfisher', cat: '2x', out: '06:02', back: '07:15', dur: '40m', status: 'on-water' },
  { who: 'Stormcock crew (4)',av: 'SC', boat: 'Stormcock', cat: '4x',  out: '05:30', back: '06:30', dur: '1h 12m', status: 'overdue', overBy: '12m' },
  { who: 'Curlew crew (4)',   av: 'CC', boat: 'Curlew',    cat: '4+',  out: '06:10', back: '07:40', dur: '32m', status: 'on-water' },
  { who: 'Theo Brennan',      av: 'TB', boat: 'Otter',     cat: '1x',  out: '06:25', back: '07:25', dur: '17m', status: 'on-water' },
];

// helpers
const initials = (name) => name.split(/[\s+]+/).filter(Boolean).slice(0,2).map(w => w[0]).join('').toUpperCase();

// ── Chrome (top bar) ──────────────────────────────────
function Chrome({ subtitle }) {
  return (
    <div className="arf-chrome">
      <div className="arf-brand">
        <svg className="mark" viewBox="0 0 24 24" fill="none">
          <path d="M2 14c3-2 5-2 8 0s5 2 8 0c1.5-1 2-1 4-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M2 18c3-2 5-2 8 0s5 2 8 0c1.5-1 2-1 4-1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity=".4"/>
          <ellipse cx="12" cy="9" rx="9" ry="2.2" stroke="currentColor" strokeWidth="1.4" fill="none"/>
        </svg>
        <div className="name">ARF</div>
        <div className="club">{subtitle || 'Tideway Boat Club'}</div>
      </div>
      <div className="arf-meta">
        <span><span className="dot"></span>Live</span>
        <span>{TODAY}</span>
        <span className="now">{NOW}</span>
        <span>Tide rising · 0.4kn</span>
      </div>
    </div>
  );
}

// ── 1. Dashboard — live on-water ──────────────────────
function Dashboard({ overdueIntensity = 'medium', tone = 'friendly' }) {
  const pulse = overdueIntensity !== 'subtle';
  return (
    <div className="arf-body">
      <div className="screen-h">
        <div>
          <div className="eyebrow">On the water · 5 crews</div>
          <h1>Five out, one running late.</h1>
        </div>
        <div style={{display:'flex', gap:12}}>
          <span className="chip">Auto-refresh · 30s</span>
        </div>
      </div>

      <div className="tile-row">
        <div className="tile featured">
          <div className="k">Currently on water</div>
          <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between'}}>
            <div className="v">12 <small>rowers</small></div>
            <div className="v" style={{fontSize:34, opacity:.8}}>5 boats</div>
          </div>
        </div>
        <div className="tile">
          <div className="k">Overdue</div>
          <div className="v" style={{color:'var(--clay)'}}>1</div>
        </div>
        <div className="tile">
          <div className="k">Returned today</div>
          <div className="v">7</div>
        </div>
      </div>

      {overdueIntensity === 'loud' && (
        <div style={{padding:'16px 32px 0'}}>
          <div className="alert-bar">
            <span className="lbl">Overdue</span>
            <span><b>Stormcock crew</b> · expected 06:30 · <b>12 minutes late</b></span>
            <span style={{marginLeft:'auto'}}>
              <button className="btn btn-ghost" style={{padding:'8px 14px', fontSize:13}}>Notify Captain</button>
            </span>
          </div>
        </div>
      )}

      <div className="sess-grid">
        <div className="sess-head">
          <div>Crew</div>
          <div>Boat</div>
          <div>Out</div>
          <div>Expected</div>
          <div>Time</div>
          <div style={{textAlign:'right'}}>Status</div>
        </div>
        {SESSIONS.map((s, i) => (
          <div key={i} className={`sess-row ${s.status === 'overdue' ? 'overdue ' + (pulse ? 'pulse' : '') : ''}`}>
            <div className="who">
              <div className="av">{s.av}</div>
              <div>{s.who}</div>
            </div>
            <div className="boat">
              {s.boat}
              <span className="sub">{s.cat}</span>
            </div>
            <div className="tcell">
              {s.out}
              <span className="sub">{s.dur} ago</span>
            </div>
            <div className="tcell eta">
              {s.back}
              {s.status === 'overdue' && <span className="sub" style={{color:'var(--clay)'}}>{s.overBy} late</span>}
            </div>
            <div className="tcell">{s.dur}</div>
            <div className="status">
              {s.status === 'overdue'
                ? <span className="chip clay">{s.overBy} overdue</span>
                : <span className="chip ok">On water</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="arf-foot">
        <button className="btn btn-primary btn-lg">
          Sign out a boat
          <span className="arr">→</span>
        </button>
        <button className="btn btn-ghost btn-lg">I'm back — sign in</button>
        <div style={{marginLeft:'auto', display:'flex', gap:12, alignItems:'center'}}>
          <span className="chip">{tone === 'friendly' ? 'Stay safe on the water 🚣' : 'Operational'}</span>
          <button className="btn btn-text">Boat registry</button>
        </div>
      </div>
    </div>
  );
}

// ── 2. Empty state ────────────────────────────────────
function Empty({ tone = 'friendly' }) {
  return (
    <div className="arf-body">
      <div className="empty">
        <p style={{margin:0, fontFamily:'var(--mono)', fontSize:12, letterSpacing:'0.14em', textTransform:'uppercase', color:'var(--ink-mute)'}}>
          {TODAY} · {NOW} · All boats home
        </p>
        <h2 className="big" style={{marginTop:14}}>
          {tone === 'friendly' ? 'All quiet on the water.' : 'No active sessions.'}
        </h2>
        <p className="sub">
          {tone === 'friendly'
            ? 'Nobody out right now. Tide turns at 07:18 — be the first one off the pontoon.'
            : 'No crews are currently signed out. Next slack water: 07:18.'}
        </p>
        <div className="stats">
          <div>Today's rows<b>0 of 12 boats out</b></div>
          <div>Last back<b>Wed · 19:42 · Lapwing</b></div>
          <div>Wind<b>NE · 6 kn</b></div>
          <div>Conditions<b>Calm</b></div>
        </div>
        <div style={{marginTop:40, display:'flex', gap:14}}>
          <button className="btn btn-primary btn-lg">Sign out a boat <span className="arr">→</span></button>
          <button className="btn btn-ghost btn-lg">Boat registry</button>
        </div>
        <div className="bands"></div>
      </div>
    </div>
  );
}

// ── 3. Sign-out · Member picker ───────────────────────
function SignOutMember() {
  return (
    <div className="arf-body">
      <div className="screen-h">
        <div>
          <div className="eyebrow">Sign out · Step 1 of 3</div>
          <h1>Who's heading out?</h1>
        </div>
        <div className="steps">
          <span className="cur">Member</span> <i></i>
          <span>Boat</span> <i></i>
          <span>Return</span>
        </div>
      </div>

      <div className="search-row">
        <div className="search">
          <svg className="ic" width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6"/>
            <path d="m20 20-3.5-3.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          <input placeholder="Search members…" defaultValue="" />
          <span className="kbd">Type to search</span>
        </div>
        <div className="alpha">
          {['All','A','B','C','D','E','F','G','H'].map((l, i) => (
            <button key={l} className={i === 0 ? 'on' : ''}>{l}</button>
          ))}
        </div>
      </div>

      <div className="member-grid">
        {MEMBERS.slice(0, 18).map((m, i) => (
          <div key={i} className={`member ${i === 0 ? 'selected' : ''}`}>
            <div className="av">{initials(m.n)}</div>
            <div>
              <div className="nm">{m.n}</div>
              <div className="meta">{m.squad}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="arf-foot">
        <button className="btn btn-ghost btn-lg">← Cancel</button>
        <div style={{marginLeft:'auto', display:'flex', gap:14, alignItems:'center'}}>
          <span style={{color:'var(--ink-mute)', fontSize:14}}>
            Selected · <b style={{color:'var(--ink)'}}>Mira Halligan</b>
          </span>
          <button className="btn btn-primary btn-lg">Choose a boat <span className="arr">→</span></button>
        </div>
      </div>
    </div>
  );
}

// ── 4. Sign-out · Boat picker ─────────────────────────
function SignOutBoat({ layout = 'grid' }) {
  const sel = 2; // Otter
  return (
    <div className="arf-body">
      <div className="screen-h">
        <div>
          <div className="eyebrow">Sign out · Step 2 of 3 · Mira Halligan</div>
          <h1>Which boat are you taking?</h1>
        </div>
        <div className="steps">
          <span>Member</span> <i></i>
          <span className="cur">Boat</span> <i></i>
          <span>Return</span>
        </div>
      </div>

      <div className="search-row">
        <div style={{display:'flex', gap:8}}>
          {['Available 8','1x','2x','2-','4x','4+','8+','Out 2'].map((t, i) => (
            <span key={t} className={`chip ${i === 0 ? 'solid' : ''}`}>{t}</span>
          ))}
        </div>
        <div style={{marginLeft:'auto', display:'flex', gap:8, alignItems:'center', color:'var(--ink-mute)', fontSize:13, fontFamily:'var(--mono)', letterSpacing:'0.08em', textTransform:'uppercase'}}>
          <span>View</span>
          <span className="chip solid" style={{padding:'4px 10px', fontSize:10}}>{layout === 'grid' ? 'Grid' : 'List'}</span>
        </div>
      </div>

      {layout === 'grid' ? (
        <div className="boat-grid">
          {BOATS.slice(0, 8).map((b, i) => (
            <div key={i} className={`boat ${i === sel ? 'selected' : ''} ${b.state === 'out' || b.state === 'maintenance' ? 'out' : ''}`}>
              {b.state === 'out' && <span className="pill out">Out</span>}
              {b.state === 'maintenance' && <span className="pill out">Maint.</span>}
              {i === sel && <span className="pill">Selected</span>}
              <div className="cat">{b.cat} · scull</div>
              <div className="nm">{b.n}</div>
              <div className="meta">
                <span><b>{b.yr}</b> built</span>
                <span><b>{b.wt}</b></span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="boat-list">
          {BOATS.slice(0, 6).map((b, i) => (
            <div key={i} className={`boat-row ${i === sel ? 'selected' : ''} ${b.state === 'out' ? 'out' : ''}`}>
              <div>
                <div className="nm">{b.n}</div>
                <div className="cat" style={{marginTop:4}}>{b.cat} · scull</div>
              </div>
              <div className="cat">Built {b.yr}</div>
              <div className="cat">Hull {b.wt}</div>
              <div className="cat">{b.state === 'available' ? 'On rack 3' : (b.state === 'out' ? 'On water' : 'Workshop')}</div>
              <div style={{textAlign:'right'}}>
                {i === sel ? <span className="chip brass">Selected</span>
                  : b.state === 'out' ? <span className="chip clay">Unavailable</span>
                  : <span className="chip">Available</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="arf-foot">
        <button className="btn btn-ghost btn-lg">← Back</button>
        <div style={{marginLeft:'auto', display:'flex', gap:14, alignItems:'center'}}>
          <span style={{color:'var(--ink-mute)', fontSize:14}}>
            <b style={{color:'var(--ink)'}}>Otter</b> · 1x · 14kg
          </span>
          <button className="btn btn-primary btn-lg">Set return time <span className="arr">→</span></button>
        </div>
      </div>
    </div>
  );
}

// ── 5. Sign-out · Return time + confirm ───────────────
function SignOutReturn() {
  return (
    <div className="arf-body">
      <div className="screen-h">
        <div>
          <div className="eyebrow">Sign out · Step 3 of 3</div>
          <h1>When will you be back?</h1>
        </div>
        <div className="steps">
          <span>Member</span> <i></i>
          <span>Boat</span> <i></i>
          <span className="cur">Return</span>
        </div>
      </div>

      <div className="time-pick">
        <div className="dial">
          <div className="lbl">Duration</div>
          <div className="big">1<small>h</small> 15<small>m</small></div>
          <div className="lbl">Common durations</div>
          <div className="duration-chips">
            <button>30 min</button>
            <button>45 min</button>
            <button>1 h</button>
            <button className="on">1 h 15 m</button>
            <button>1 h 30 m</button>
            <button>2 h</button>
            <button>Custom…</button>
          </div>
        </div>

        <div className="return-card">
          <div className="lbl">Expected back</div>
          <div className="when">07:57</div>
          <div className="for">A nice steady row, by the look of it.</div>
          <div style={{display:'flex', gap:8, marginTop:6}}>
            <span className="chip" style={{background:'rgba(242,237,227,0.12)', color:'rgba(242,237,227,0.85)', borderColor:'transparent'}}>Slack water 07:18</span>
            <span className="chip" style={{background:'rgba(242,237,227,0.12)', color:'rgba(242,237,227,0.85)', borderColor:'transparent'}}>Sunrise 05:14</span>
          </div>
          <div className="who">
            <div className="av">MH</div>
            <div>
              <div className="nm">Mira Halligan</div>
              <div className="boat">Otter · 1x</div>
            </div>
          </div>
        </div>
      </div>

      <div className="arf-foot">
        <button className="btn btn-ghost btn-lg">← Back</button>
        <div style={{marginLeft:'auto', display:'flex', gap:14, alignItems:'center'}}>
          <span style={{color:'var(--ink-mute)', fontSize:14, maxWidth:280, textAlign:'right'}}>
            We'll flag overdue if you're not back by <b style={{color:'var(--ink)'}}>08:12</b>.
          </span>
          <button className="btn btn-primary btn-lg">Off you go <span className="arr">→</span></button>
        </div>
      </div>
    </div>
  );
}

// ── 6. Sign-in (return) — select active session ───────
function SignIn() {
  return (
    <div className="arf-body">
      <div className="screen-h">
        <div>
          <div className="eyebrow">Welcome back</div>
          <h1>Who just landed?</h1>
        </div>
        <span className="chip">3 crews still out</span>
      </div>

      <div className="signin-grid">
        {SESSIONS.slice(0,4).map((s, i) => (
          <div key={i} className={`signin-row ${i === 0 ? 'featured' : ''}`}>
            <div className="who">
              <div className="av">{s.av}</div>
              <div>
                <div className="nm">{s.who}</div>
                <div className="sub">Signed out {s.out} · {s.dur} ago</div>
              </div>
            </div>
            <div>
              <div className="boat">{s.boat}</div>
              <div className="meta">{s.cat} · sculling</div>
            </div>
            <div className="tcol">
              {s.back}
              <span className="meta">Expected</span>
            </div>
            <div className="tcol" style={{color: s.status==='overdue' ? 'var(--clay)' : (i===0 ? 'rgba(242,237,227,0.85)' : 'var(--ink-2)')}}>
              {s.status==='overdue' ? `+${s.overBy}` : 'On time'}
              <span className="meta">vs plan</span>
            </div>
            <button className={`btn ${i === 0 ? 'btn-ghost' : 'btn-primary'}`} style={i === 0 ? {borderColor:'rgba(242,237,227,0.4)', color:'var(--sand)'} : {}}>
              I'm back <span className="arr">→</span>
            </button>
          </div>
        ))}
      </div>

      <div className="arf-foot">
        <button className="btn btn-ghost btn-lg">← Cancel</button>
        <div style={{marginLeft:'auto', display:'flex', gap:14, alignItems:'center'}}>
          <span style={{color:'var(--ink-mute)', fontSize:14}}>Can't find your session? <b style={{color:'var(--ink)'}}>Add manually</b></span>
        </div>
      </div>
    </div>
  );
}

// ── 7. Training capture (optional, on return) ─────────
function Training() {
  return (
    <div className="arf-body">
      <div className="screen-h">
        <div>
          <div className="eyebrow">You're back · Mira Halligan · Otter · 1x</div>
          <h1>Log a few details — or skip.</h1>
        </div>
        <span className="chip">Optional</span>
      </div>

      <div className="training">
        <div className="panel">
          <div>
            <div className="lbl">Distance</div>
            <div className="field">
              <div className="v">8.4 <small>km</small></div>
            </div>
            <div className="duration-chips" style={{marginTop:8}}>
              <button>4 km</button>
              <button>6 km</button>
              <button className="on">8 km</button>
              <button>10 km</button>
              <button>12 km</button>
              <button>Custom</button>
            </div>
          </div>

          <div>
            <div className="lbl">Session type</div>
            <div className="seg" style={{marginTop:8, flexWrap:'wrap'}}>
              <button>Steady</button>
              <button className="on">UT2</button>
              <button>UT1</button>
              <button>AT</button>
              <button>Intervals</button>
              <button>Race</button>
              <button>Outing</button>
            </div>
          </div>

          <div>
            <div className="lbl">Notes</div>
            <textarea defaultValue="Lovely flat water past the lock. Bow rigger feels a touch loose — worth a look. Caught a small crab at km 6 but nothing dramatic."></textarea>
          </div>
        </div>

        <div className="summary">
          <div className="lbl">Today's row</div>
          <div className="row"><span>Duration</span><span className="v">1h 09m</span></div>
          <div className="row"><span>Distance</span><span className="v">8.4 km</span></div>
          <div className="row"><span>Avg pace</span><span className="v">4:42 / 500m</span></div>
          <div className="row"><span>Strokes</span><span className="v">≈ 1,420</span></div>
          <div style={{marginTop:'auto', fontSize:13, color:'rgba(242,237,227,0.7)', lineHeight:1.5}}>
            Your 7th row this month. Goes in the squad book under <b style={{color:'var(--sand)'}}>Senior · S1</b>.
          </div>
        </div>
      </div>

      <div className="arf-foot">
        <button className="btn btn-text">Skip — just sign me in</button>
        <div style={{marginLeft:'auto', display:'flex', gap:14, alignItems:'center'}}>
          <span style={{color:'var(--ink-mute)', fontSize:14}}>Saves to your training log</span>
          <button className="btn btn-primary btn-lg">Save row <span className="arr">→</span></button>
        </div>
      </div>
    </div>
  );
}

// ── 8. Overdue (focused alert state) ──────────────────
function OverdueAlert({ overdueIntensity = 'loud' }) {
  return (
    <div className="arf-body">
      <div className="screen-h">
        <div>
          <div className="eyebrow" style={{color:'#8A2E22'}}>Attention · Overdue session</div>
          <h1 style={{color:'#6E1F14'}}>Stormcock crew is late.</h1>
        </div>
        <span className="chip clay">12 min overdue</span>
      </div>

      <div className="confirm-card" style={{borderColor:'rgba(185,74,59,0.4)', background:'linear-gradient(120deg, rgba(185,74,59,0.08), rgba(251,247,238,1) 60%)'}}>
        <div className="c">
          <div className="lbl">Crew</div>
          <div className="v sm">Marco Trent · Eve Astley · Hari Menon · Cal Reardon</div>
        </div>
        <div className="c">
          <div className="lbl">Boat</div>
          <div className="v">Stormcock <span style={{fontSize:18, color:'var(--ink-mute)'}}>· 4x</span></div>
        </div>
        <div className="c">
          <div className="lbl">Expected back</div>
          <div className="v" style={{color:'var(--clay)'}}>06:30</div>
        </div>
        <div className="c">
          <div className="lbl">Out for</div>
          <div className="v">1h 12m</div>
        </div>
      </div>

      <div style={{padding:'20px 32px 0', display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
        <div className="card" style={{padding:'20px 24px'}}>
          <div style={{fontFamily:'var(--mono)', fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'var(--ink-mute)'}}>Last seen</div>
          <div style={{fontFamily:'var(--serif)', fontStyle:'italic', fontSize:32, lineHeight:1, marginTop:8}}>Pontoon · 05:30</div>
          <div style={{marginTop:14, color:'var(--ink-mute)', fontSize:14, lineHeight:1.5}}>
            Signed out 1h 12m ago. Expected return 06:30. <b style={{color:'var(--ink)'}}>No contact since.</b>
          </div>
        </div>
        <div className="card" style={{padding:'20px 24px', background:'var(--ink)', color:'var(--sand)', borderColor:'transparent'}}>
          <div style={{fontFamily:'var(--mono)', fontSize:11, letterSpacing:'0.12em', textTransform:'uppercase', color:'rgba(242,237,227,0.6)'}}>Next action</div>
          <div style={{fontFamily:'var(--serif)', fontStyle:'italic', fontSize:28, lineHeight:1.05, marginTop:8}}>Call the bank or the captain.</div>
          <div style={{display:'flex', gap:10, marginTop:14, flexWrap:'wrap'}}>
            <button className="btn btn-ghost" style={{borderColor:'rgba(242,237,227,0.3)', color:'var(--sand)'}}>📞 Captain · P. Doolan</button>
            <button className="btn btn-ghost" style={{borderColor:'rgba(242,237,227,0.3)', color:'var(--sand)'}}>📞 Marco (cox)</button>
          </div>
        </div>
      </div>

      <div className="arf-foot">
        <button className="btn btn-ghost btn-lg">Dismiss for now</button>
        <div style={{marginLeft:'auto', display:'flex', gap:14, alignItems:'center'}}>
          <button className="btn btn-ghost btn-lg">Crew is back, sign in</button>
          <button className="btn btn-primary btn-lg" style={{background:'var(--clay)'}}>Raise alert <span className="arr">→</span></button>
        </div>
      </div>
    </div>
  );
}

// ── 9. Boat registry ──────────────────────────────────
function Registry() {
  return (
    <div className="arf-body">
      <div className="screen-h">
        <div>
          <div className="eyebrow">Fleet · 12 boats</div>
          <h1>Boat registry</h1>
        </div>
        <div style={{display:'flex', gap:10}}>
          <span className="chip solid">All</span>
          <span className="chip">Available 8</span>
          <span className="chip clay">On water 3</span>
          <span className="chip brass">Maintenance 1</span>
        </div>
      </div>

      <div className="registry">
        {BOATS.map((b, i) => (
          <div key={i} className="b">
            <div className="top">
              <div>
                <div className="nm">{b.n}</div>
                <div className="cat" style={{marginTop:6}}>{b.cat} · scull</div>
              </div>
              {b.state === 'available' && <span className="chip ok" style={{fontSize:9, padding:'3px 8px'}}>Rack 3</span>}
              {b.state === 'out' && <span className="chip clay" style={{fontSize:9, padding:'3px 8px'}}>On water</span>}
              {b.state === 'maintenance' && <span className="chip brass" style={{fontSize:9, padding:'3px 8px'}}>Workshop</span>}
            </div>
            <div className="meta">
              <span><b>{b.yr}</b> built</span>
              <span><b>{b.wt}</b></span>
              <span>{b.cat === '1x' ? '1 seat' : b.cat === '2x' || b.cat === '2-' ? '2' : b.cat === '4x' || b.cat === '4+' ? '4' : '8'}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="arf-foot">
        <button className="btn btn-ghost btn-lg">← Back to dashboard</button>
        <div style={{marginLeft:'auto', display:'flex', gap:14, alignItems:'center'}}>
          <button className="btn btn-text">Mark a boat for maintenance</button>
          <button className="btn btn-primary btn-lg">Add a boat <span className="arr">→</span></button>
        </div>
      </div>
    </div>
  );
}

// ── Frame wrapper (applies palette + density) ─────────
function Frame({ tweaks, children, subtitle }) {
  const cls = ['arf'];
  if (tweaks.palette === 'dusk') cls.push('arf-dusk');
  if (tweaks.palette === 'mist') cls.push('arf-mist');
  if (tweaks.density === 'comfy') cls.push('comfy');
  return (
    <div className={cls.join(' ')}>
      <Chrome subtitle={subtitle} />
      {children}
    </div>
  );
}

// expose
Object.assign(window, {
  ARFDashboard: Dashboard,
  ARFEmpty: Empty,
  ARFSignOutMember: SignOutMember,
  ARFSignOutBoat: SignOutBoat,
  ARFSignOutReturn: SignOutReturn,
  ARFSignIn: SignIn,
  ARFTraining: Training,
  ARFOverdueAlert: OverdueAlert,
  ARFRegistry: Registry,
  ARFFrame: Frame,
});
