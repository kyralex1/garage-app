import React from 'react';

const TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:pointer;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}
  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}
  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:pointer}
  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:pointer}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:pointer;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s,box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),0 2px 6px rgba(0,0,0,.15)}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  const setTweak = React.useCallback((key, val) => {
    setValues(prev => ({ ...prev, [key]: val }));
  }, []);
  return [values, setTweak];
}

function TweakSection({ label, children }) {
  return (
    <>
      <div className="twk-sect">{label}</div>
      {children}
    </>
  );
}

function TweakSlider({ label, value, min = 0, max = 100, step = 1, unit = '', onChange }) {
  return (
    <div className="twk-row">
      <div className="twk-lbl">
        <span>{label}</span>
        <span className="twk-val">{value}{unit}</span>
      </div>
      <input type="range" className="twk-slider" min={min} max={max} step={step}
        value={value} onChange={e => onChange(Number(e.target.value))}/>
    </div>
  );
}

function TweakButton({ label, onClick }) {
  return (
    <button type="button" className="twk-btn" onClick={onClick}>{label}</button>
  );
}

function TweakColor({ value, options, onChange }) {
  const key = o => JSON.stringify(o).toLowerCase();
  const cur = key(value);
  return (
    <div className="twk-chips" role="radiogroup">
      {options.map((o, i) => {
        const on = key(o) === cur;
        return (
          <button key={i} type="button" className="twk-chip" data-on={on ? '1' : '0'}
            style={{ background: o }}
            onClick={() => onChange(o)}>
            {on && (
              <svg viewBox="0 0 14 14">
                <path d="M3 7.2 5.8 10 11 4.2" fill="none" strokeWidth="2.2"
                  strokeLinecap="round" strokeLinejoin="round" stroke="#fff"/>
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}

const TWEAK_DEFAULTS = {
  accent: '#00e5ff',
  doorSpeed: 2.2,
};

export function GarageTweaks({ onAccentChange, onDoorSpeedChange, onReplayDoor, onReset }) {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({ x: 16, y: 16 });

  React.useEffect(() => {
    onAccentChange?.(t.accent);
    document.documentElement.style.setProperty('--accent', t.accent);
  }, [t.accent]);

  React.useEffect(() => {
    onDoorSpeedChange?.(t.doorSpeed);
  }, [t.doorSpeed]);

  const onDragStart = (e) => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = (ev) => {
      const newX = Math.max(16, startRight - (ev.clientX - sx));
      const newY = Math.max(16, startBottom - (ev.clientY - sy));
      offsetRef.current = { x: newX, y: newY };
      panel.style.right = newX + 'px';
      panel.style.bottom = newY + 'px';
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  if (!open) {
    return (
      <>
        <style>{TWEAKS_STYLE}</style>
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed', right: 16, bottom: 16, zIndex: 2147483646,
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(250,249,247,0.88)',
            border: '0.5px solid rgba(255,255,255,0.6)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}
        >⚙️</button>
      </>
    );
  }

  return (
    <>
      <style>{TWEAKS_STYLE}</style>
      <div ref={dragRef} className="twk-panel"
        style={{ right: offsetRef.current.x, bottom: offsetRef.current.y }}>
        <div className="twk-hd" onMouseDown={onDragStart}>
          <b>Tweaks</b>
          <button className="twk-x" onClick={() => setOpen(false)}>✕</button>
        </div>
        <div className="twk-body">
          <TweakSection label="Akzentfarbe">
            <TweakColor
              value={t.accent}
              options={['#00e5ff', '#ff7a1a', '#a8ff35', '#ff3b7a', '#b388ff']}
              onChange={v => setTweak('accent', v)}
            />
          </TweakSection>

          <TweakSection label="Tor-Animation">
            <TweakSlider
              label="Tempo"
              value={t.doorSpeed}
              min={0.6} max={4} step={0.2} unit=" s"
              onChange={v => setTweak('doorSpeed', v)}
            />
            <TweakButton label="Tor neu animieren" onClick={onReplayDoor}/>
          </TweakSection>

          <TweakSection label="Demo-Daten">
            <TweakButton label="Auf Werkseinstellungen" onClick={onReset}/>
          </TweakSection>
        </div>
      </div>
    </>
  );
}
