import React from 'react';
import { useStore, deriveDue, fmtDate, fmtKm, fmtEur } from '../store';
import { Icon, VehicleArt, VehicleBadge, GarageDoor } from '../art';

export const C = {
  bg: '#0a0b0d',
  bg2: '#131418',
  bg3: '#1c1d22',
  card: '#16171b',
  border: '#2a2c33',
  borderSoft: '#23252b',
  text: '#ebecef',
  muted: '#8b8d96',
  dim: '#5a5c64',
  accent: 'var(--accent, #00e5ff)',
  warn: '#ff9c40',
  bad: '#ff5b5b',
  ok: '#3ddc84',
};

export const FONT = '"Geist", "Söhne", -apple-system, system-ui, sans-serif';
export const MONO = '"JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace';

export function StatusPill({ status, days }) {
  const map = {
    overdue: { bg: 'rgba(255,91,91,0.16)', fg: C.bad, border: 'rgba(255,91,91,0.4)', label: `${Math.abs(days)} Tage über` },
    soon:    { bg: 'rgba(255,156,64,0.16)', fg: C.warn, border: 'rgba(255,156,64,0.4)', label: `in ${days} T` },
    ok:      { bg: 'rgba(61,220,132,0.12)', fg: C.ok, border: 'rgba(61,220,132,0.3)', label: 'OK' },
  };
  const m = map[status] || map.ok;
  return (
    <span style={{
      fontFamily: MONO, fontSize: 10.5, letterSpacing: 0.5, fontWeight: 500,
      padding: '3px 8px', borderRadius: 4,
      color: m.fg, background: m.bg, border: `1px solid ${m.border}`,
      textTransform: 'uppercase', whiteSpace: 'nowrap',
    }}>{m.label}</span>
  );
}

export function HeaderBar({ title, sub, onBack, action, eyebrow }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '14px 16px 12px', borderBottom: `1px solid ${C.borderSoft}`,
      background: C.bg,
    }}>
      {onBack && (
        <button onClick={onBack} style={{
          width: 34, height: 34, marginTop: 2, borderRadius: 10,
          background: C.bg3, border: `1px solid ${C.border}`,
          color: C.text, display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', flexShrink: 0,
        }}>
          <Icon name="chevL" size={16}/>
        </button>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        {eyebrow && <div style={{
          fontFamily: MONO, fontSize: 10, letterSpacing: 1.5,
          color: C.dim, textTransform: 'uppercase', marginBottom: 2,
        }}>{eyebrow}</div>}
        <div style={{ fontFamily: FONT, fontSize: 22, fontWeight: 600, color: C.text, letterSpacing: -0.4 }}>{title}</div>
        {sub && <div style={{ fontFamily: MONO, fontSize: 11, color: C.muted, marginTop: 2 }}>{sub}</div>}
      </div>
      {action}
    </div>
  );
}

function GarageInterior({ accent }) {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'radial-gradient(ellipse at 50% 30%, #1a1c22 0%, #0a0b0d 60%), #0a0b0d',
    }}>
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: '38%',
        background: 'linear-gradient(180deg, transparent 0%, #0e0f12 60%, #16171b 100%)',
      }}/>
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0, height: '38%',
        backgroundImage: `
          linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.025) 100%),
          repeating-linear-gradient(0deg, transparent 0 39px, rgba(255,255,255,0.04) 39px 40px),
          repeating-linear-gradient(90deg, transparent 0 39px, rgba(255,255,255,0.04) 39px 40px)
        `,
        transform: 'perspective(220px) rotateX(54deg)',
        transformOrigin: 'top center',
        opacity: 0.55,
      }}/>
      <div style={{
        position: 'absolute', top: 22, left: '20%', right: '20%', height: 3,
        background: accent, opacity: 0.7, boxShadow: `0 0 30px ${accent}`,
      }}/>
      <div style={{
        position: 'absolute', top: '8%', left: 0, right: 0, textAlign: 'center',
        fontFamily: MONO, fontSize: 9, color: 'rgba(255,255,255,0.18)',
        letterSpacing: 4, textTransform: 'uppercase',
      }}>Bay · 01 / 02</div>
    </div>
  );
}

export function ScreenClosed({ onOpen, accent, doorSpeed, doorOpen, onDoorEnd }) {
  return (
    <div style={{ position: 'relative', height: '100%', background: C.bg, overflow: 'hidden' }}>
      <GarageInterior accent={accent}/>
      <GarageDoor open={doorOpen} onAnimEnd={onDoorEnd} accent={accent} speed={doorSpeed}/>
      <div style={{
        position: 'absolute', top: 18, left: 0, right: 0, textAlign: 'center',
        fontFamily: MONO, fontSize: 10, color: 'rgba(255,255,255,0.5)',
        letterSpacing: 3, textTransform: 'uppercase', zIndex: 5,
      }}>· Garage 01 ·</div>

      {!doorOpen && (
        <div style={{
          position: 'absolute', bottom: 56, left: 0, right: 0,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14,
          zIndex: 10,
        }}>
          <div style={{
            fontFamily: MONO, fontSize: 10, color: 'rgba(255,255,255,0.55)',
            letterSpacing: 3, textTransform: 'uppercase',
          }}>tippe zum öffnen</div>
          <button onClick={onOpen} style={{
            width: 84, height: 84, borderRadius: '50%',
            background: `radial-gradient(circle, ${accent}1f 0%, transparent 70%)`,
            border: 'none', cursor: 'pointer', padding: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: '#0a0b0d', border: `1.5px solid ${accent}`,
              boxShadow: `0 0 20px ${accent}66, inset 0 0 12px ${accent}33`,
              color: accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon name="open" size={26}/>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}

function ZoneArtStack({ list, type, accent }) {
  const shown = list.length <= 2 ? list : list.slice(1, 3);
  const overflow = list.length - shown.length;
  const itemW = type === 'car' ? 130 : 120;
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14 }}>
      {shown.map((v) => (
        <div key={v.id}>
          <VehicleArt vehicle={v} width={itemW} accent={accent}/>
        </div>
      ))}
      {overflow > 0 && (
        <div style={{
          padding: '2px 8px', borderRadius: 8,
          background: 'rgba(0,0,0,0.6)', border: `1px solid ${C.border}`,
          fontFamily: MONO, fontSize: 11, color: C.text,
          alignSelf: 'center',
        }}>+{overflow}</div>
      )}
    </div>
  );
}

function ZoneCard({ type, label, title, list, go, accent }) {
  const empty = list.length === 0;
  return (
    <button onClick={() => go(type === 'car' ? 'cars' : 'bikes')} style={{
      all: 'unset', cursor: 'pointer',
      display: 'block', position: 'relative',
      background: `linear-gradient(180deg, ${C.bg2} 0%, #0e0f12 100%)`,
      border: `1px solid ${C.border}`, borderRadius: 16,
      padding: '14px 14px 12px', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'repeating-linear-gradient(45deg, transparent 0 8px, rgba(255,255,255,0.015) 8px 9px)',
        pointerEvents: 'none',
      }}/>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        <div>
          <div style={{ fontFamily: MONO, fontSize: 9.5, color: C.dim, letterSpacing: 2, textTransform: 'uppercase' }}>{label}</div>
          <div style={{ fontFamily: FONT, fontSize: 16, fontWeight: 600, color: C.text, marginTop: 2 }}>{title} · {list.length}</div>
        </div>
        <div style={{ color: C.muted, display: 'flex', alignItems: 'center', gap: 6, fontFamily: MONO, fontSize: 11 }}>
          {empty ? 'HINZUFÜGEN' : 'ÖFFNEN'} <Icon name="chevR" size={14}/>
        </div>
      </div>
      <div style={{
        marginTop: 8, height: type === 'car' ? 92 : 90, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
      }}>
        {empty ? (
          <div style={{
            color: C.dim, fontFamily: MONO, fontSize: 10.5, letterSpacing: 1,
            border: `1px dashed ${C.border}`, borderRadius: 10,
            padding: '14px 18px', textAlign: 'center',
          }}>
            Stellplatz frei · tippe um Fahrzeug hinzuzufügen
          </div>
        ) : <ZoneArtStack list={list} type={type} accent={accent}/>}
      </div>
    </button>
  );
}

function UpcomingRow({ item, onClick, last }) {
  const { task, vehicle, due } = item;
  return (
    <button onClick={onClick} style={{
      all: 'unset', display: 'flex', cursor: 'pointer',
      width: '100%', boxSizing: 'border-box',
      padding: '10px 14px', alignItems: 'center', gap: 10,
      borderBottom: last ? 'none' : `1px solid ${C.borderSoft}`,
    }}>
      <VehicleBadge vehicle={vehicle} size={36}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: FONT, fontSize: 13, color: C.text, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{task.title}</div>
        <div style={{ fontFamily: MONO, fontSize: 10.5, color: C.muted, marginTop: 1 }}>
          {vehicle.name} · {due.dueDate ? fmtDate(due.dueDate) : (due.dueKm ? fmtKm(due.dueKm) : '—')}
        </div>
      </div>
      <StatusPill status={due.status} days={due.effDays}/>
    </button>
  );
}

export function ScreenGarage({ go, accent }) {
  const store = useStore();
  const cars = store.vehicles.filter(v => v.type === 'car');
  const bikes = store.vehicles.filter(v => v.type === 'bike');
  const upcoming = store.upcoming(6);
  const overdueCount = upcoming.filter(u => u.due.status === 'overdue').length;
  const soonCount = upcoming.filter(u => u.due.status === 'soon').length;

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', background: C.bg, overflow: 'hidden' }}>
      <div style={{ padding: '18px 16px 6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.dim, letterSpacing: 2, textTransform: 'uppercase' }}>Bay 01</div>
          <div style={{ fontFamily: FONT, fontSize: 24, fontWeight: 600, color: C.text, letterSpacing: -0.4 }}>Meine Garage</div>
        </div>
        <button onClick={() => go('notifications')} style={{
          position: 'relative',
          width: 40, height: 40, borderRadius: 12,
          background: C.bg3, border: `1px solid ${C.border}`,
          color: C.text, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name="bell" size={18}/>
          {overdueCount > 0 && (
            <span style={{
              position: 'absolute', top: -4, right: -4,
              minWidth: 18, height: 18, padding: '0 5px', borderRadius: 9,
              background: C.bad, color: '#fff',
              fontFamily: MONO, fontSize: 10, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>{overdueCount}</span>
          )}
        </button>
      </div>

      <div style={{ padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
        <ZoneCard type="car" label="Stellplatz · A" title="Autos" list={cars} go={go} accent={accent}/>
        <ZoneCard type="bike" label="Stellplatz · B" title="Motorräder" list={bikes} go={go} accent={accent}/>
      </div>

      <div style={{
        margin: '4px 12px 12px', flex: 1, minHeight: 0,
        background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 16,
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{
          padding: '12px 14px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: `1px solid ${C.borderSoft}`,
        }}>
          <div>
            <div style={{ fontFamily: MONO, fontSize: 9.5, color: C.dim, letterSpacing: 2, textTransform: 'uppercase' }}>Nächste Termine</div>
            <div style={{ fontFamily: FONT, fontSize: 14, fontWeight: 600, color: C.text, marginTop: 2 }}>
              {overdueCount > 0
                ? <span><span style={{ color: C.bad }}>{overdueCount} überfällig</span> · {soonCount} bald fällig</span>
                : `${soonCount} demnächst fällig`}
            </div>
          </div>
          <button onClick={() => go('notifications')} style={{
            all: 'unset', cursor: 'pointer',
            fontFamily: MONO, fontSize: 11, color: 'var(--accent)',
            display: 'flex', alignItems: 'center', gap: 4,
          }}>ALLE <Icon name="chevR" size={12}/></button>
        </div>
        <div style={{ overflowY: 'auto', flex: 1 }}>
          {upcoming.slice(0, 5).map((u, i) => (
            <UpcomingRow key={u.task.id} item={u} onClick={() => go(`detail-${u.vehicle.id}`)} last={i === 4}/>
          ))}
          {upcoming.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: C.muted, fontFamily: MONO, fontSize: 11 }}>
              Keine Termine — füge ein Fahrzeug und Wartungen hinzu.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent: accentColor }) {
  return (
    <div style={{
      background: '#0e0f12', border: `1px solid ${C.borderSoft}`, borderRadius: 8,
      padding: '6px 8px',
    }}>
      <div style={{ fontFamily: MONO, fontSize: 8.5, letterSpacing: 1.5, color: C.dim }}>{label}</div>
      <div style={{ fontFamily: MONO, fontSize: 12.5, color: accentColor || C.text, marginTop: 1, fontWeight: 500 }}>{value}</div>
    </div>
  );
}

function VehicleCard({ vehicle, onClick, accent }) {
  const store = useStore();
  const tasks = store.tasksFor(vehicle.id).map(t => ({ task: t, due: deriveDue(t, vehicle) }));
  const overdue = tasks.filter(t => t.due.status === 'overdue').length;
  const soon = tasks.filter(t => t.due.status === 'soon').length;
  const totalCost = tasks.reduce((s, t) => s + (t.task.cost || 0), 0);
  const dot = overdue > 0 ? C.bad : (soon > 0 ? C.warn : C.ok);

  return (
    <button onClick={onClick} style={{
      all: 'unset', cursor: 'pointer', display: 'block',
      background: `linear-gradient(180deg, ${C.bg2} 0%, ${C.card} 100%)`,
      border: `1px solid ${C.border}`, borderRadius: 16,
      padding: 14, position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute', top: 12, right: 14,
        width: 8, height: 8, borderRadius: '50%',
        background: dot, boxShadow: `0 0 10px ${dot}`,
      }}/>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
        <div style={{
          width: 110, height: 64, borderRadius: 10,
          background: '#0e0f12', border: `1px solid ${C.borderSoft}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, overflow: 'hidden',
        }}>
          <VehicleArt vehicle={vehicle} width={100} accent={accent}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: MONO, fontSize: 9.5, color: C.dim, letterSpacing: 2, textTransform: 'uppercase' }}>{vehicle.year}{vehicle.nick ? ' · ' + vehicle.nick : ''}</div>
          <div style={{ fontFamily: FONT, fontSize: 18, fontWeight: 600, color: C.text, marginTop: 1, letterSpacing: -0.3 }}>{vehicle.name}</div>
          <div style={{ fontFamily: FONT, fontSize: 12, color: C.muted, marginTop: 1 }}>{vehicle.model}</div>
        </div>
      </div>
      <div style={{
        marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
        gap: 8, fontFamily: MONO,
      }}>
        <Stat label="KM-STAND" value={fmtKm(vehicle.mileage)}/>
        <Stat label="OFFEN" value={overdue + soon} accent={overdue > 0 ? C.bad : (soon > 0 ? C.warn : C.text)}/>
        <Stat label="KOSTEN" value={fmtEur(totalCost)}/>
      </div>
    </button>
  );
}

export function ScreenList({ type, go, accent }) {
  const store = useStore();
  const list = store.vehicles.filter(v => v.type === type);
  const title = type === 'car' ? 'Autos' : 'Motorräder';
  const eyebrow = type === 'car' ? 'STELLPLATZ A' : 'STELLPLATZ B';
  const canAdd = list.length < 10;

  return (
    <div style={{ height: '100%', background: C.bg, display: 'flex', flexDirection: 'column' }}>
      <HeaderBar
        eyebrow={eyebrow}
        title={title}
        sub={`${list.length} / 10 Fahrzeuge`}
        onBack={() => go('garage')}
        action={
          <button onClick={() => canAdd && go(`add-vehicle-${type}`)} disabled={!canAdd} style={{
            display: 'flex', alignItems: 'center', gap: 4, marginTop: 2,
            padding: '8px 10px', borderRadius: 10,
            background: canAdd ? 'var(--accent)' : C.bg3,
            color: canAdd ? '#000' : C.dim,
            border: 'none',
            fontFamily: MONO, fontSize: 11, fontWeight: 600, letterSpacing: 0.4,
            cursor: canAdd ? 'pointer' : 'not-allowed',
            flexShrink: 0,
          }}><Icon name="plus" size={13}/> NEU</button>
        }
      />
      <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {list.map(v => <VehicleCard key={v.id} vehicle={v} onClick={() => go(`detail-${v.id}`)} accent={accent}/>)}
          {list.length === 0 && (
            <button onClick={() => go(`add-vehicle-${type}`)} style={{
              all: 'unset', cursor: 'pointer', display: 'block',
              padding: 24, textAlign: 'center',
              background: C.bg2, border: `1px dashed ${C.border}`, borderRadius: 12,
              color: C.muted, fontFamily: MONO, fontSize: 11,
            }}>
              Stellplatz frei.<br/>Tippe hier oder NEU um ein Fahrzeug hinzuzufügen.
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
