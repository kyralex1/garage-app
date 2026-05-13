// Garage app — root + router + tweaks integration.

const ROUTES = {
  CLOSED: 'closed',
  GARAGE: 'garage',
  CARS: 'cars',
  BIKES: 'bikes',
  NOTIF: 'notifications',
};

function App({ instanceId, frame, safeTop = 0 }) {
  // route state per-instance — opening the garage on the iPhone
  // shouldn't auto-open the Android one. (Data does sync.)
  // Dev hint: ?skipDoor=1 starts in the garage (handy for screenshots).
  const skip = typeof location !== 'undefined' && /[?&]skipDoor=1/.test(location.search);
  const [route, setRoute] = React.useState(skip ? 'garage' : 'closed');
  const [doorOpen, setDoorOpen] = React.useState(skip);
  const tweaks = window.__garageTweaks || { accent: '#00e5ff', doorSpeed: 2.2 };

  // Listen for tweak changes + replay-door event
  const [, force] = React.useReducer(x => x + 1, 0);
  React.useEffect(() => {
    const onTweak = () => force();
    const onReplay = () => { setRoute('closed'); setDoorOpen(false); };
    window.addEventListener('garage:tweaks', onTweak);
    window.addEventListener('garage:replay-door', onReplay);
    return () => {
      window.removeEventListener('garage:tweaks', onTweak);
      window.removeEventListener('garage:replay-door', onReplay);
    };
  }, []);

  const go = (next) => {
    if (next === 'closed') { setDoorOpen(false); }
    setRoute(next);
  };

  const accent = tweaks.accent;

  // Render screen
  let screen;
  if (route === 'closed') {
    screen = (
      <ScreenClosed
        accent={accent}
        doorSpeed={tweaks.doorSpeed}
        doorOpen={doorOpen}
        onOpen={() => setDoorOpen(true)}
        onDoorEnd={() => setRoute('garage')}
      />
    );
  } else if (route === 'garage') {
    screen = <ScreenGarage go={go} accent={accent}/>;
  } else if (route === 'cars') {
    screen = <ScreenList type="car" go={go} accent={accent}/>;
  } else if (route === 'bikes') {
    screen = <ScreenList type="bike" go={go} accent={accent}/>;
  } else if (route.startsWith('detail-')) {
    const vid = route.slice(7);
    screen = <ScreenDetail vehicleId={vid} go={go} accent={accent}/>;
  } else if (route.startsWith('add-vehicle-')) {
    const t = route.slice(12);
    screen = <ScreenAddVehicle type={t} go={go}/>;
  } else if (route.startsWith('add-')) {
    const vid = route.slice(4);
    screen = <ScreenAdd vehicleId={vid} go={go}/>;
  } else if (route === 'notifications') {
    screen = <ScreenNotifications go={go}/>;
  }

  // The closed-garage screen is full-bleed (door covers status bar area),
  // every other screen needs to clear the iOS status bar / dynamic island.
  const padTop = (route !== 'closed') ? safeTop : 0;
  return (
    <div data-screen-label={`${frame} · ${route}`}
         style={{ height: '100%', background: '#0a0b0d', paddingTop: padTop, boxSizing: 'border-box' }}>
      {screen}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Tweaks panel
// ─────────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#00e5ff",
  "doorSpeed": 2.2,
  "demoOverdue": true
}/*EDITMODE-END*/;

function GarageTweaks() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // expose to app, broadcast on change
  React.useEffect(() => {
    window.__garageTweaks = t;
    document.documentElement.style.setProperty('--accent', t.accent);
    window.dispatchEvent(new CustomEvent('garage:tweaks'));
  }, [t.accent, t.doorSpeed, t.demoOverdue]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Akzentfarbe">
        <TweakColor
          value={t.accent}
          options={['#00e5ff', '#ff7a1a', '#a8ff35', '#ff3b7a', '#b388ff']}
          onChange={(v) => setTweak('accent', v)}
        />
      </TweakSection>

      <TweakSection label="Tor-Animation">
        <TweakSlider
          label="Tempo"
          value={t.doorSpeed}
          min={0.6} max={4} step={0.2} unit=" s"
          onChange={(v) => setTweak('doorSpeed', v)}
        />
        <TweakButton label="Tor neu animieren" onClick={() => {
          window.dispatchEvent(new CustomEvent('garage:replay-door'));
        }}/>
      </TweakSection>

      <TweakSection label="Demo-Daten">
        <TweakButton label="Auf Werkseinstellungen" onClick={() => {
          try { localStorage.removeItem('garage_app_v3'); } catch (e) {}
          window.location.reload();
        }}/>
      </TweakSection>
    </TweaksPanel>
  );
}

// Initialize tweaks defaults before app mounts
window.__garageTweaks = TWEAK_DEFAULTS;
document.documentElement.style.setProperty('--accent', TWEAK_DEFAULTS.accent);

Object.assign(window, { App, GarageTweaks });
