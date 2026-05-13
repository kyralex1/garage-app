import { PRESETS } from './store';

export function Icon({ name, size = 18, stroke = 1.6, color = 'currentColor', style }) {
  const s = { width: size, height: size, color, flexShrink: 0, ...style };
  const p = (d) => <path d={d} stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" fill="none" />;
  const all = {
    bell: <svg viewBox="0 0 24 24" style={s}>{p('M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8')}{p('M10 19a2 2 0 0 0 4 0')}</svg>,
    plus: <svg viewBox="0 0 24 24" style={s}>{p('M12 5v14M5 12h14')}</svg>,
    chevR: <svg viewBox="0 0 24 24" style={s}>{p('M9 5l7 7-7 7')}</svg>,
    chevL: <svg viewBox="0 0 24 24" style={s}>{p('M15 5l-7 7 7 7')}</svg>,
    chevD: <svg viewBox="0 0 24 24" style={s}>{p('M5 9l7 7 7-7')}</svg>,
    cal: <svg viewBox="0 0 24 24" style={s}>{p('M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7zM3 10h18M8 3v4M16 3v4')}</svg>,
    gauge: <svg viewBox="0 0 24 24" style={s}>{p('M12 14l4-5M4 14a8 8 0 1 1 16 0')}{p('M12 14a1 1 0 1 0 0 .001')}</svg>,
    wrench: <svg viewBox="0 0 24 24" style={s}>{p('M14.7 6.3a4 4 0 0 0 5.3 5.3l-7.4 7.4a3 3 0 0 1-4.2-4.2l6.3-8.5z')}</svg>,
    drop: <svg viewBox="0 0 24 24" style={s}>{p('M12 3s6 7 6 12a6 6 0 0 1-12 0c0-5 6-12 6-12z')}</svg>,
    shield: <svg viewBox="0 0 24 24" style={s}>{p('M12 3l8 3v6c0 5-4 9-8 9s-8-4-8-9V6l8-3z')}</svg>,
    chain: <svg viewBox="0 0 24 24" style={s}>{p('M9 15a4 4 0 0 1 0-6l3-3a4 4 0 1 1 6 6l-1 1M15 9a4 4 0 0 1 0 6l-3 3a4 4 0 1 1-6-6l1-1')}</svg>,
    tire: <svg viewBox="0 0 24 24" style={s}>{p('M12 21a9 9 0 1 1 0-18 9 9 0 0 1 0 18z')}{p('M12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8z')}{p('M12 3v5M12 16v5M3 12h5M16 12h5')}</svg>,
    brake: <svg viewBox="0 0 24 24" style={s}>{p('M12 4v8M12 18v2M5 8l5 5M14 11l5 5')}{p('M3 12a9 9 0 0 1 18 0')}</svg>,
    engine: <svg viewBox="0 0 24 24" style={s}>{p('M5 9h2V7h6v2h2l3 2v6H5z')}{p('M9 7V4h4v3')}</svg>,
    euro: <svg viewBox="0 0 24 24" style={s}>{p('M17 5a7 7 0 0 0-10 5h7M17 19a7 7 0 0 1-10-5h7M5 11h7M5 13h7')}</svg>,
    check: <svg viewBox="0 0 24 24" style={s}>{p('M5 12l5 5L20 7')}</svg>,
    car: <svg viewBox="0 0 24 24" style={s}>{p('M5 15l1.5-5h11L19 15M3 19h18v-4H3zM7 19v2M17 19v2')}{p('M7 17a1 1 0 1 0 0 .001M17 17a1 1 0 1 0 0 .001')}</svg>,
    bike: <svg viewBox="0 0 24 24" style={s}>{p('M5 17a3 3 0 1 0 0 .001M19 17a3 3 0 1 0 0 .001')}{p('M5 17l4-7h5l3 7M9 10l3-5h3M14 10l-2 4')}</svg>,
    settings: <svg viewBox="0 0 24 24" style={s}>{p('M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z')}{p('M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z')}</svg>,
    spark: <svg viewBox="0 0 24 24" style={s}>{p('M12 3v3M12 18v3M3 12h3M18 12h3M5.5 5.5l2 2M16.5 16.5l2 2M5.5 18.5l2-2M16.5 7.5l2-2')}</svg>,
    trash: <svg viewBox="0 0 24 24" style={s}>{p('M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6')}</svg>,
    edit: <svg viewBox="0 0 24 24" style={s}>{p('M4 20h4l10-10-4-4L4 16zM14 6l4 4')}</svg>,
    open: <svg viewBox="0 0 24 24" style={s}>{p('M12 19V5M5 12l7-7 7 7')}</svg>,
    fuel: <svg viewBox="0 0 24 24" style={s}>{p('M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 21h14M15 9h2a2 2 0 0 1 2 2v6a1 1 0 0 0 2 0V8l-3-3')}</svg>,
    flag: <svg viewBox="0 0 24 24" style={s}>{p('M5 21V4M5 4h12l-2 4 2 4H5')}</svg>,
  };
  return all[name] || null;
}

export const KIND_ICON = {
  oil: 'drop', hu: 'shield', service: 'wrench', tires: 'tire',
  chain: 'chain', brake: 'brake', engine: 'engine', fluid: 'drop',
  custom: 'spark',
};

export function VehicleArt({ vehicle, width = 200, accent = '#00e5ff' }) {
  const preset = vehicle?.preset ? PRESETS[vehicle.preset] : null;
  const custom = vehicle?.customImg;
  const customKind = vehicle?.customImgKind;
  const img = custom || preset?.img;
  const isBike = vehicle?.type === 'bike';
  const treatAsLineArt = custom ? (customKind === 'lineart') : !!preset?.img;

  if (!img) {
    return (
      <svg width={width} viewBox="0 0 280 140" style={{ display: 'block' }}>
        <ellipse cx="140" cy="128" rx="115" ry="5" fill="#000" opacity="0.45"/>
        {isBike ? (
          <g>
            <circle cx="60" cy="100" r="22" fill="none" stroke="#cfd2d8" strokeWidth="2" opacity="0.6"/>
            <circle cx="220" cy="100" r="22" fill="none" stroke="#cfd2d8" strokeWidth="2" opacity="0.6"/>
            <path d="M60 100 L120 80 L180 70 L220 100" fill="none" stroke="#cfd2d8" strokeWidth="2" opacity="0.7"/>
            <path d="M120 80 L150 50 L180 70" fill="none" stroke="#cfd2d8" strokeWidth="2" opacity="0.7"/>
            <circle cx="200" cy="55" r="6" fill={accent} opacity="0.8"/>
          </g>
        ) : (
          <g>
            <path d="M30 100 L60 70 L120 50 L200 50 L240 70 L260 100 L260 115 L30 115 Z"
              fill="none" stroke="#cfd2d8" strokeWidth="2" opacity="0.7"/>
            <circle cx="80" cy="115" r="18" fill="none" stroke="#cfd2d8" strokeWidth="2" opacity="0.7"/>
            <circle cx="220" cy="115" r="18" fill="none" stroke="#cfd2d8" strokeWidth="2" opacity="0.7"/>
            <rect x="248" y="80" width="14" height="6" fill={accent} opacity="0.8"/>
          </g>
        )}
      </svg>
    );
  }

  return (
    <div style={{ width, lineHeight: 0, display: 'inline-block' }}>
      <img
        src={img}
        alt={vehicle?.name || ''}
        draggable={false}
        style={{
          width: '100%', height: 'auto', display: 'block',
          filter: treatAsLineArt
            ? `invert(1) drop-shadow(0 2px 8px ${accent}26)`
            : `drop-shadow(0 2px 10px rgba(0,0,0,0.5))`,
          borderRadius: treatAsLineArt ? 0 : 8,
          userSelect: 'none', pointerEvents: 'none',
        }}
      />
    </div>
  );
}

export function VehicleBadge({ vehicle, size = 56, accent = '#00e5ff' }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 12,
      background: 'linear-gradient(180deg, #1a1c22 0%, #0e0f12 100%)',
      border: '1px solid #2a2c33',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(45deg, transparent 0 6px, rgba(255,255,255,0.02) 6px 7px)',
      }}/>
      <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <VehicleArt vehicle={vehicle} width={size - 10} accent={accent}/>
      </div>
    </div>
  );
}

export function GarageDoor({ open, onAnimEnd, accent = '#00e5ff', speed = 2.2 }) {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <div
        onTransitionEnd={(e) => {
          if (e.propertyName === 'transform' && open) onAnimEnd?.();
        }}
        style={{
          position: 'absolute', left: 0, right: 0, top: 0, height: '100%',
          transform: open ? 'translateY(-100%)' : 'translateY(0)',
          transition: `transform ${speed}s cubic-bezier(0.55, 0.05, 0.2, 1)`,
          willChange: 'transform',
        }}
      >
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            linear-gradient(180deg, rgba(255,255,255,0.06) 0%, transparent 30%),
            repeating-linear-gradient(180deg,
              #2a2c33 0,
              #2a2c33 22px,
              #1a1c22 22px,
              #1a1c22 23px,
              #34363e 23px,
              #34363e 44px,
              #1a1c22 44px,
              #1a1c22 45px
            )
          `,
          boxShadow: 'inset 0 0 80px rgba(0,0,0,0.7), inset 0 -20px 40px rgba(0,0,0,0.5)',
        }}/>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, rgba(0,0,0,0.45) 0%, transparent 8%, transparent 92%, rgba(0,0,0,0.45) 100%)',
          pointerEvents: 'none',
        }}/>
        <div style={{
          position: 'absolute', left: '50%', bottom: 28,
          transform: 'translateX(-50%)',
          width: 64, height: 6, borderRadius: 3,
          background: '#0a0b0d', border: '1px solid #404249',
        }}/>
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 0, height: 8,
          background: 'repeating-linear-gradient(135deg, #f5c518 0 8px, #1a1c22 8px 16px)',
          opacity: 0.5,
        }}/>
        <div style={{
          position: 'absolute', left: 0, right: 0, bottom: 8, height: 1,
          background: accent, boxShadow: `0 0 12px ${accent}`, opacity: 0.6,
        }}/>
      </div>
    </div>
  );
}
