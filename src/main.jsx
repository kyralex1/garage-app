import React from 'react';
import ReactDOM from 'react-dom/client';
import { StoreProvider } from './store';
import { App } from './App';
import { IOSDevice } from './frames/IOSDevice';
import { AndroidDevice } from './frames/AndroidDevice';
import { GarageTweaks } from './TweaksPanel';
import './index.css';

const FONT = '"Geist", "Söhne", -apple-system, system-ui, sans-serif';
const MONO = '"JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace';

// Capacitor injects `window.Capacitor`. Use that to render fullscreen on device,
// vs. the dual-frame preview in the browser.
const isNative = typeof window !== 'undefined' && (
  !!window.Capacitor?.isNativePlatform?.() ||
  /capacitor|android|ios/i.test(window.location?.protocol || '') ||
  window.location?.protocol === 'file:'
);

function NativeRoot() {
  const [accent, setAccent] = React.useState('#00e5ff');
  const [doorSpeed, setDoorSpeed] = React.useState(2.2);

  React.useEffect(() => {
    document.documentElement.style.setProperty('--accent', accent);
  }, [accent]);

  return (
    <StoreProvider>
      <div style={{
        position: 'fixed', inset: 0, background: '#0a0b0d',
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}>
        <App accent={accent} doorSpeed={doorSpeed}/>
      </div>
      <GarageTweaks
        onAccentChange={setAccent}
        onDoorSpeedChange={setDoorSpeed}
        onReplayDoor={() => window.dispatchEvent(new CustomEvent('garage:replay-door'))}
        onReset={() => { try { localStorage.removeItem('garage_app_v4'); } catch (e) {} window.location.reload(); }}
      />
    </StoreProvider>
  );
}

function PreviewRoot() {
  const [accent, setAccent] = React.useState('#00e5ff');
  const [doorSpeed, setDoorSpeed] = React.useState(2.2);

  const handleReplayDoor = () => {
    window.dispatchEvent(new CustomEvent('garage:replay-door'));
  };

  const handleReset = () => {
    try { localStorage.removeItem('garage_app_v4'); } catch (e) {}
    window.location.reload();
  };

  return (
    <StoreProvider>
      <div style={{
        minHeight: '100vh',
        background: `
          radial-gradient(1200px 600px at 50% -200px, rgba(0,229,255,0.04) 0%, transparent 70%),
          repeating-linear-gradient(0deg, transparent 0 39px, rgba(255,255,255,0.012) 39px 40px),
          repeating-linear-gradient(90deg, transparent 0 39px, rgba(255,255,255,0.012) 39px 40px),
          #050608
        `,
        overflowX: 'auto',
      }}>
        <div style={{
          minHeight: '100vh',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          padding: '32px 20px 64px', gap: 24,
        }}>
          <header style={{
            display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
            width: '100%', maxWidth: 1100, gap: 16,
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{
                fontFamily: MONO, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase',
                color: '#6b6d75',
              }}>Hi-Fi Prototype · v1</span>
              <h1 style={{
                fontSize: 28, fontWeight: 600, letterSpacing: -0.5, color: '#ebecef',
                margin: 0, fontFamily: FONT,
              }}>Garagen-App</h1>
              <span style={{
                fontFamily: MONO, fontSize: 12, color: '#8b8d96', maxWidth: 600, lineHeight: 1.5,
              }}>
                Tippe auf den Tor-Knopf zum Öffnen. Innen: deine Fahrzeuge und alle anstehenden Wartungen / HU.
                State läuft synchron zwischen iOS und Android.
              </span>
            </div>
            <div style={{
              fontFamily: MONO, fontSize: 10, letterSpacing: 1.5, color: '#5a5c64',
              textAlign: 'right', lineHeight: 1.6,
            }}>
              <span style={{ color: 'var(--accent)', fontWeight: 500, letterSpacing: 1 }}>Tweaks ein</span><br/>
              Akzent · Tor · Demo
            </div>
          </header>

          <div style={{
            display: 'flex', gap: 28, alignItems: 'flex-start',
            padding: 8, flexWrap: 'wrap', justifyContent: 'center',
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <IOSDevice width={384} height={812} dark={true}>
                <App instanceId="ios" safeTop={54} accent={accent} doorSpeed={doorSpeed}/>
              </IOSDevice>
              <div style={{
                fontFamily: MONO, fontSize: 10, letterSpacing: 3, textTransform: 'uppercase',
                color: '#5a5c64',
              }}>iOS · iPhone 15 Pro</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              <AndroidDevice width={384} height={812} dark={true}>
                <App instanceId="android" accent={accent} doorSpeed={doorSpeed}/>
              </AndroidDevice>
              <div style={{
                fontFamily: MONO, fontSize: 10, letterSpacing: 3, textTransform: 'uppercase',
                color: '#5a5c64',
              }}>Android · Pixel 8</div>
            </div>
          </div>
        </div>
      </div>

      <GarageTweaks
        onAccentChange={setAccent}
        onDoorSpeedChange={setDoorSpeed}
        onReplayDoor={handleReplayDoor}
        onReset={handleReset}
      />
    </StoreProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  isNative ? <NativeRoot/> : <PreviewRoot/>
);
