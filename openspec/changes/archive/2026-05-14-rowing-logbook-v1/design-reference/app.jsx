// app.jsx — ARF design canvas + tweaks

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "sand",
  "density": "regular",
  "tone": "friendly",
  "overdueIntensity": "medium",
  "boatLayout": "grid"
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const F = ({children, subtitle}) => <ARFFrame tweaks={t} subtitle={subtitle}>{children}</ARFFrame>;
  const W = 1280, H = 800;
  return (
    <React.Fragment>
      <DesignCanvas>
        <DCSection id="dashboard" title="Live dashboard" subtitle="The home view — who is on the water right now.">
          <DCArtboard id="dash" label="Dashboard · live" width={W} height={H}>
            <F><ARFDashboard overdueIntensity={t.overdueIntensity} tone={t.tone} /></F>
          </DCArtboard>
          <DCArtboard id="empty" label="Empty state · all home" width={W} height={H}>
            <F><ARFEmpty tone={t.tone} /></F>
          </DCArtboard>
          <DCArtboard id="overdue" label="Overdue · focused alert" width={W} height={H}>
            <F><ARFOverdueAlert overdueIntensity={t.overdueIntensity} /></F>
          </DCArtboard>
        </DCSection>

        <DCSection id="signout" title="Sign out flow" subtitle="Member → boat → expected return. Each step lives on its own kiosk screen.">
          <DCArtboard id="so-1" label="1 · Member picker" width={W} height={H}>
            <F><ARFSignOutMember /></F>
          </DCArtboard>
          <DCArtboard id="so-2" label="2 · Boat picker" width={W} height={H}>
            <F><ARFSignOutBoat layout={t.boatLayout} /></F>
          </DCArtboard>
          <DCArtboard id="so-3" label="3 · Return time + confirm" width={W} height={H}>
            <F><ARFSignOutReturn /></F>
          </DCArtboard>
        </DCSection>

        <DCSection id="signin" title="Sign in &amp; training" subtitle="Returning crews tap their session, then optionally log training.">
          <DCArtboard id="si-1" label="Sign in · pick session" width={W} height={H}>
            <F><ARFSignIn /></F>
          </DCArtboard>
          <DCArtboard id="si-2" label="Training capture (optional)" width={W} height={H}>
            <F><ARFTraining /></F>
          </DCArtboard>
        </DCSection>

        <DCSection id="registry" title="Boat registry" subtitle="The fleet, with state at a glance.">
          <DCArtboard id="reg" label="Boat registry" width={W} height={H}>
            <F><ARFRegistry /></F>
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel title="ARF tweaks">
        <TweakSection label="Palette" />
        <TweakRadio
          label="Theme"
          value={t.palette}
          options={[
            { value: 'sand', label: 'Sand' },
            { value: 'mist', label: 'Mist' },
            { value: 'dusk', label: 'Dusk' },
          ]}
          onChange={(v) => setTweak('palette', v)}
        />

        <TweakSection label="Layout" />
        <TweakRadio
          label="Density"
          value={t.density}
          options={['regular', 'comfy']}
          onChange={(v) => setTweak('density', v)}
        />
        <TweakRadio
          label="Boat picker"
          value={t.boatLayout}
          options={['grid', 'list']}
          onChange={(v) => setTweak('boatLayout', v)}
        />

        <TweakSection label="Behaviour" />
        <TweakRadio
          label="Overdue intensity"
          value={t.overdueIntensity}
          options={['subtle', 'medium', 'loud']}
          onChange={(v) => setTweak('overdueIntensity', v)}
        />
        <TweakRadio
          label="Copy tone"
          value={t.tone}
          options={['friendly', 'neutral']}
          onChange={(v) => setTweak('tone', v)}
        />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
