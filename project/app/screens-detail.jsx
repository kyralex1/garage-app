// Garage app — detail / form / notifications screens.

function ScreenDetail({ vehicleId, go, accent }) {
  const store = useStore();
  const vehicle = store.getVehicle(vehicleId);
  if (!vehicle) return null;
  const tasks = store.tasksFor(vehicleId).map(t => ({ task: t, due: deriveDue(t, vehicle) }));
  tasks.sort((a, b) => (a.due.effDays ?? 99999) - (b.due.effDays ?? 99999));
  const totalCost = tasks.reduce((s, t) => s + (t.task.cost || 0), 0);
  const overdue = tasks.filter(t => t.due.status === 'overdue').length;
  const soon = tasks.filter(t => t.due.status === 'soon').length;
  const [editingKm, setEditingKm] = React.useState(false);
  const [kmDraft, setKmDraft] = React.useState(String(vehicle.mileage));
  const [menuOpen, setMenuOpen] = React.useState(false);

  const backTo = vehicle.type === 'car' ? 'cars' : 'bikes';

  return (
    <div style={{ height: '100%', background: C.bg, display: 'flex', flexDirection: 'column' }}>
      <HeaderBar
        eyebrow={vehicle.year + (vehicle.plate ? ' · ' + vehicle.plate : '')}
        title={vehicle.name}
        sub={vehicle.model}
        onBack={() => go(backTo)}
        action={
          <div style={{ position: 'relative', marginTop: 2 }}>
            <button onClick={() => setMenuOpen(o => !o)} style={{
              width: 34, height: 34, borderRadius: 10,
              background: C.bg3, border: `1px solid ${C.border}`,
              color: C.text, cursor: 'pointer', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
            }}><Icon name="settings" size={15}/></button>
            {menuOpen && (
              <div style={{
                position: 'absolute', top: 38, right: 0, zIndex: 50,
                background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10,
                boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
                minWidth: 170, overflow: 'hidden',
              }}>
                <button onClick={() => {
                  if (confirm(`"${vehicle.name}" und alle zugehörigen Wartungen löschen?`)) {
                    store.deleteVehicle(vehicle.id);
                    go(backTo);
                  }
                }} style={{
                  all: 'unset', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 12px', width: '100%', boxSizing: 'border-box',
                  fontFamily: FONT, fontSize: 13, color: C.bad,
                }}><Icon name="trash" size={14}/> Fahrzeug löschen</button>
              </div>
            )}
          </div>
        }
      />
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 12px 24px' }}>
        {/* Hero */}
        <div style={{
          background: `linear-gradient(180deg, ${C.bg2} 0%, #0e0f12 100%)`,
          border: `1px solid ${C.border}`, borderRadius: 16,
          padding: 14, position: 'relative', overflow: 'hidden', marginBottom: 12,
        }}>
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'repeating-linear-gradient(45deg, transparent 0 8px, rgba(255,255,255,0.015) 8px 9px)',
          }}/>
          <div style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}>
            <VehicleArt vehicle={vehicle} width={260} accent={accent}/>
          </div>
          <div style={{
            position: 'relative',
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10,
          }}>
            <div style={{
              background: '#0a0b0d', border: `1px solid ${C.borderSoft}`, borderRadius: 10,
              padding: '8px 10px',
            }}>
              <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim, letterSpacing: 1.5 }}>KILOMETERSTAND</div>
              {editingKm ? (
                <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginTop: 2 }}>
                  <input value={kmDraft} onChange={e => setKmDraft(e.target.value)}
                    type="number" autoFocus
                    style={{
                      flex: 1, minWidth: 0,
                      background: 'transparent', border: 'none', outline: 'none',
                      color: C.text, fontFamily: MONO, fontSize: 16, fontWeight: 600,
                    }}/>
                  <button onClick={() => {
                    const n = parseInt(kmDraft, 10);
                    if (!isNaN(n)) store.updateVehicle(vehicle.id, { mileage: n });
                    setEditingKm(false);
                  }} style={{
                    width: 24, height: 24, borderRadius: 6,
                    background: 'var(--accent)', border: 'none', cursor: 'pointer',
                    color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}><Icon name="check" size={14}/></button>
                </div>
              ) : (
                <div onClick={() => setEditingKm(true)} style={{
                  fontFamily: MONO, fontSize: 16, color: C.text, fontWeight: 600, marginTop: 2,
                  cursor: 'pointer',
                }}>{vehicle.mileage.toLocaleString('de-DE')} <span style={{ fontSize: 10, color: C.dim }}>km</span></div>
              )}
            </div>
            <div style={{
              background: '#0a0b0d', border: `1px solid ${C.borderSoft}`, borderRadius: 10,
              padding: '8px 10px',
            }}>
              <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim, letterSpacing: 1.5 }}>KOSTEN GESAMT</div>
              <div style={{ fontFamily: MONO, fontSize: 16, color: C.text, fontWeight: 600, marginTop: 2 }}>
                {fmtEur(totalCost)}
              </div>
            </div>
          </div>
          <div style={{
            position: 'relative',
            marginTop: 8, display: 'flex', gap: 8, alignItems: 'center',
            fontFamily: MONO, fontSize: 10, color: C.muted,
          }}>
            <span style={{ color: overdue ? C.bad : (soon ? C.warn : C.ok) }}>● </span>
            {overdue ? `${overdue} überfällig · ` : ''}{soon} bald · {tasks.length - overdue - soon} ok
          </div>
        </div>

        {/* Tasks list */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '6px 4px 8px',
        }}>
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.dim, letterSpacing: 2, textTransform: 'uppercase' }}>
            Wartungen & Termine · {tasks.length}
          </div>
          <button onClick={() => go(`add-${vehicleId}`)} style={{
            all: 'unset', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '4px 8px', borderRadius: 6,
            background: 'var(--accent)', color: '#000',
            fontFamily: MONO, fontSize: 10.5, fontWeight: 600, letterSpacing: 0.5,
          }}><Icon name="plus" size={12}/> NEU</button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {tasks.map(({ task, due }) => (
            <TaskRow key={task.id} task={task} due={due} vehicle={vehicle}/>
          ))}
          {tasks.length === 0 && (
            <div style={{
              padding: 32, textAlign: 'center',
              background: C.bg2, border: `1px dashed ${C.border}`, borderRadius: 12,
              color: C.muted, fontFamily: MONO, fontSize: 11,
            }}>
              Keine Wartungen angelegt.<br/>Tippe NEU um zu starten.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TaskRow({ task, due, vehicle }) {
  const store = useStore();
  const [open, setOpen] = React.useState(false);
  const iconName = KIND_ICON[task.kind] || 'wrench';

  return (
    <div style={{
      background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12,
      overflow: 'hidden',
    }}>
      <button onClick={() => setOpen(o => !o)} style={{
        all: 'unset', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 10,
        width: '100%', boxSizing: 'border-box', padding: '12px 14px',
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9,
          background: '#0e0f12', border: `1px solid ${C.borderSoft}`,
          color: due.status === 'overdue' ? C.bad : (due.status === 'soon' ? C.warn : 'var(--accent)'),
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <Icon name={iconName} size={18}/>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: FONT, fontSize: 14, color: C.text, fontWeight: 500 }}>{task.title}</div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, marginTop: 2 }}>
            {task.intervalKm ? `alle ${task.intervalKm.toLocaleString('de-DE')} km` : ''}
            {task.intervalKm && task.intervalMonths ? ' · ' : ''}
            {task.intervalMonths ? `alle ${task.intervalMonths} Mon.` : ''}
          </div>
        </div>
        <StatusPill status={due.status} days={due.effDays}/>
        <Icon name={open ? 'chevD' : 'chevR'} size={14} color={C.dim}/>
      </button>

      {open && (
        <div style={{
          padding: '4px 14px 14px', borderTop: `1px solid ${C.borderSoft}`,
          background: '#0e0f12',
        }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12, marginBottom: 12,
          }}>
            <DetailField label="ZULETZT" value={fmtDate(task.lastDate)} sub={task.lastKm != null ? fmtKm(task.lastKm) : ''}/>
            <DetailField label="NÄCHSTE" value={due.dueDate ? fmtDate(due.dueDate) : '—'} sub={due.dueKm != null ? fmtKm(due.dueKm) : ''}/>
            <DetailField label="KOSTEN" value={fmtEur(task.cost)}/>
            <DetailField label="STATUS" value={due.basis === 'km' ? 'km-basiert' : 'zeit-basiert'}/>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button onClick={() => {
              const km = vehicle.mileage;
              store.completeTask(task.id, km);
            }} style={{
              flex: 1, padding: '8px', borderRadius: 8,
              background: 'var(--accent)', color: '#000', border: 'none',
              fontFamily: MONO, fontSize: 11, fontWeight: 600, letterSpacing: 0.4,
              cursor: 'pointer',
            }}>✓ ALS ERLEDIGT MARKIEREN</button>
            <button onClick={() => store.deleteTask(task.id)} style={{
              padding: '8px 10px', borderRadius: 8,
              background: 'transparent', color: C.muted,
              border: `1px solid ${C.border}`, cursor: 'pointer',
            }}><Icon name="trash" size={14}/></button>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailField({ label, value, sub }) {
  return (
    <div>
      <div style={{ fontFamily: MONO, fontSize: 9, color: C.dim, letterSpacing: 1.5 }}>{label}</div>
      <div style={{ fontFamily: MONO, fontSize: 13, color: C.text, fontWeight: 500, marginTop: 2 }}>{value}</div>
      {sub && <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, marginTop: 1 }}>{sub}</div>}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// SCREEN: Add / edit task
// ─────────────────────────────────────────────────────────────
const TASK_PRESETS = [
  { kind: 'oil', title: 'Ölwechsel', icon: 'drop' },
  { kind: 'hu', title: 'HU / TÜV', icon: 'shield' },
  { kind: 'service', title: 'Inspektion', icon: 'wrench' },
  { kind: 'tires', title: 'Reifen', icon: 'tire' },
  { kind: 'chain', title: 'Kette', icon: 'chain' },
  { kind: 'brake', title: 'Bremsen', icon: 'brake' },
  { kind: 'engine', title: 'Ventilspiel', icon: 'engine' },
  { kind: 'custom', title: 'Eigene', icon: 'spark' },
];

function ScreenAdd({ vehicleId, go }) {
  const store = useStore();
  const vehicle = store.getVehicle(vehicleId);
  const [kind, setKind] = React.useState('oil');
  const [title, setTitle] = React.useState('Ölwechsel');
  const [intervalKm, setIntervalKm] = React.useState('6000');
  const [intervalMonths, setIntervalMonths] = React.useState('12');
  const [lastDate, setLastDate] = React.useState(todayISO());
  const [lastKm, setLastKm] = React.useState(String(vehicle?.mileage || ''));
  const [cost, setCost] = React.useState('');

  const onPreset = (p) => {
    setKind(p.kind);
    setTitle(p.title);
    if (p.kind === 'hu') { setIntervalKm(''); setIntervalMonths('24'); }
    else if (p.kind === 'oil') { setIntervalKm('6000'); setIntervalMonths('12'); }
    else if (p.kind === 'service') { setIntervalKm('15000'); setIntervalMonths('12'); }
    else if (p.kind === 'tires') { setIntervalKm('5000'); setIntervalMonths(''); }
    else if (p.kind === 'chain') { setIntervalKm('15000'); setIntervalMonths(''); }
    else if (p.kind === 'brake') { setIntervalKm('15000'); setIntervalMonths(''); }
    else if (p.kind === 'engine') { setIntervalKm('24000'); setIntervalMonths('48'); }
    else if (p.kind === 'custom') { setIntervalKm(''); setIntervalMonths(''); setTitle(''); }
  };

  const save = () => {
    if (!title.trim()) return;
    store.addTask({
      vehicleId, title: title.trim(), kind,
      intervalKm: intervalKm ? parseInt(intervalKm, 10) : null,
      intervalMonths: intervalMonths ? parseInt(intervalMonths, 10) : null,
      lastDate, lastKm: lastKm ? parseInt(lastKm, 10) : null,
      cost: cost ? parseFloat(cost) : null,
    });
    go(`detail-${vehicleId}`);
  };

  return (
    <div style={{ height: '100%', background: C.bg, display: 'flex', flexDirection: 'column' }}>
      <HeaderBar
        eyebrow={`Für ${vehicle?.name || ''}`}
        title="Neue Wartung"
        sub="Intervall festlegen — wir erinnern dich"
        onBack={() => go(`detail-${vehicleId}`)}
      />
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 14px 24px' }}>
        {/* Preset row */}
        <Section label="Typ">
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6,
          }}>
            {TASK_PRESETS.map(p => (
              <button key={p.kind} onClick={() => onPreset(p)} style={{
                all: 'unset', cursor: 'pointer',
                padding: '10px 4px', borderRadius: 10, textAlign: 'center',
                background: kind === p.kind ? 'rgba(0,229,255,0.1)' : C.bg2,
                border: `1px solid ${kind === p.kind ? 'var(--accent)' : C.border}`,
                color: kind === p.kind ? 'var(--accent)' : C.text,
              }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
                  <Icon name={p.icon} size={16}/>
                </div>
                <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: 0.5 }}>{p.title}</div>
              </button>
            ))}
          </div>
        </Section>

        <Section label="Bezeichnung">
          <Field>
            <input value={title} onChange={e => setTitle(e.target.value)}
              placeholder="z. B. Ölwechsel"
              style={fieldStyle}/>
          </Field>
        </Section>

        <Section label="Intervall" hint="Mindestens eines ausfüllen — der erste fällige zählt">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Field label="ALLE … KM">
              <input value={intervalKm} onChange={e => setIntervalKm(e.target.value.replace(/\D/g, ''))}
                placeholder="—" inputMode="numeric"
                style={fieldStyle}/>
            </Field>
            <Field label="ALLE … MONATE">
              <input value={intervalMonths} onChange={e => setIntervalMonths(e.target.value.replace(/\D/g, ''))}
                placeholder="—" inputMode="numeric"
                style={fieldStyle}/>
            </Field>
          </div>
        </Section>

        <Section label="Zuletzt durchgeführt">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Field label="DATUM">
              <input type="date" value={lastDate} onChange={e => setLastDate(e.target.value)}
                style={fieldStyle}/>
            </Field>
            <Field label="BEI KM-STAND">
              <input value={lastKm} onChange={e => setLastKm(e.target.value.replace(/\D/g, ''))}
                placeholder="—" inputMode="numeric"
                style={fieldStyle}/>
            </Field>
          </div>
        </Section>

        <Section label="Kosten · optional">
          <Field label="EUR">
            <input value={cost} onChange={e => setCost(e.target.value.replace(/[^\d.,]/g, '').replace(',', '.'))}
              placeholder="0.00" inputMode="decimal"
              style={fieldStyle}/>
          </Field>
        </Section>

        <button onClick={save} style={{
          width: '100%', padding: '14px', borderRadius: 12,
          background: 'var(--accent)', color: '#000', border: 'none',
          fontFamily: FONT, fontSize: 14, fontWeight: 600,
          cursor: 'pointer', marginTop: 6,
        }}>Wartung speichern</button>
      </div>
    </div>
  );
}

function Section({ label, hint, children }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        fontFamily: MONO, fontSize: 9.5, color: C.dim, letterSpacing: 2,
        textTransform: 'uppercase', marginBottom: 6,
      }}>{label}</div>
      {children}
      {hint && <div style={{
        fontFamily: MONO, fontSize: 9.5, color: C.muted, marginTop: 4, lineHeight: 1.4,
      }}>{hint}</div>}
    </div>
  );
}
function Field({ label, children }) {
  return (
    <label style={{
      display: 'block',
      background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10,
      padding: '8px 12px',
    }}>
      {label && <div style={{
        fontFamily: MONO, fontSize: 9, color: C.dim, letterSpacing: 1.5, marginBottom: 2,
      }}>{label}</div>}
      {children}
    </label>
  );
}
const fieldStyle = {
  width: '100%', boxSizing: 'border-box',
  background: 'transparent', border: 'none', outline: 'none',
  color: C.text, fontFamily: MONO, fontSize: 14, fontWeight: 500,
  padding: 0,
  colorScheme: 'dark',
};

// ─────────────────────────────────────────────────────────────
// SCREEN: Notifications / all upcoming
// ─────────────────────────────────────────────────────────────
function ScreenNotifications({ go }) {
  const store = useStore();
  const all = store.upcoming();
  const overdue = all.filter(u => u.due.status === 'overdue');
  const soon = all.filter(u => u.due.status === 'soon');
  const ok = all.filter(u => u.due.status === 'ok');

  return (
    <div style={{ height: '100%', background: C.bg, display: 'flex', flexDirection: 'column' }}>
      <HeaderBar
        eyebrow="Benachrichtigungen"
        title="Termine"
        sub={`${overdue.length} überfällig · ${soon.length} bald · ${ok.length} ok`}
        onBack={() => go('garage')}
      />
      <div style={{ flex: 1, overflow: 'auto', padding: '8px 12px 24px' }}>
        <Group title="Überfällig" tone={C.bad} items={overdue} go={go}/>
        <Group title="Demnächst (≤ 30 Tage)" tone={C.warn} items={soon} go={go}/>
        <Group title="In Ordnung" tone={C.ok} items={ok} go={go}/>
      </div>
    </div>
  );
}

function Group({ title, tone, items, go }) {
  if (items.length === 0) return null;
  return (
    <div style={{ marginTop: 10 }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '4px 4px 8px',
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: tone, boxShadow: `0 0 8px ${tone}` }}/>
        <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, letterSpacing: 2, textTransform: 'uppercase' }}>{title} · {items.length}</div>
      </div>
      <div style={{
        background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12,
        overflow: 'hidden',
      }}>
        {items.map((u, i) => (
          <NotifRow key={u.task.id} item={u} onClick={() => go(`detail-${u.vehicle.id}`)} last={i === items.length - 1}/>
        ))}
      </div>
    </div>
  );
}

function NotifRow({ item, onClick, last }) {
  const { task, vehicle, due } = item;
  const iconName = KIND_ICON[task.kind] || 'wrench';
  return (
    <button onClick={onClick} style={{
      all: 'unset', cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 10,
      width: '100%', boxSizing: 'border-box', padding: '11px 14px',
      borderBottom: last ? 'none' : `1px solid ${C.borderSoft}`,
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: '#0e0f12', border: `1px solid ${C.borderSoft}`,
        color: due.status === 'overdue' ? C.bad : (due.status === 'soon' ? C.warn : 'var(--accent)'),
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon name={iconName} size={16}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: FONT, fontSize: 13, color: C.text, fontWeight: 500 }}>{task.title}</div>
        <div style={{ fontFamily: MONO, fontSize: 10, color: C.muted, marginTop: 1 }}>
          {vehicle.name} · {due.dueDate ? fmtDate(due.dueDate) : ''}{due.dueDate && due.dueKm != null ? ' · ' : ''}{due.dueKm != null ? fmtKm(due.dueKm) : ''}
        </div>
      </div>
      <StatusPill status={due.status} days={due.effDays}/>
    </button>
  );
}

Object.assign(window, {
  ScreenDetail, ScreenAdd, ScreenAddVehicle, ScreenNotifications,
});

// ─────────────────────────────────────────────────────────────
// SCREEN: Add vehicle
// ─────────────────────────────────────────────────────────────
function ScreenAddVehicle({ type, go }) {
  const store = useStore();
  const presets = PRESETS_BY_TYPE(type);
  const [presetKey, setPresetKey] = React.useState(presets[0]?.key || '');
  const preset = PRESETS[presetKey];
  const [name, setName] = React.useState(preset?.name || '');
  const [model, setModel] = React.useState(preset?.model || '');
  const [nick, setNick] = React.useState('');
  const [plate, setPlate] = React.useState('');
  const [year, setYear] = React.useState(String(new Date().getFullYear() - 1));
  const [mileage, setMileage] = React.useState('');
  const [customImg, setCustomImg] = React.useState(null); // {dataUrl, kind}
  const [uploading, setUploading] = React.useState(false);
  const fileRef = React.useRef(null);

  // Update name/model when preset changes
  React.useEffect(() => {
    if (preset) { setName(preset.name); setModel(preset.model); }
  }, [presetKey]);

  const onPickFile = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setUploading(true);
    try {
      const res = await window.processUploadedImage(f);
      setCustomImg(res);
    } catch (err) {
      alert('Bild konnte nicht verarbeitet werden.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const canSave = name.trim().length > 0 && store.countByType(type) < MAX_PER_TYPE;

  const save = () => {
    if (!canSave) return;
    const ok = store.addVehicle({
      type, preset: presetKey,
      name: name.trim(), model: model.trim(),
      nick: nick.trim(), plate: plate.trim(),
      year: parseInt(year, 10) || new Date().getFullYear(),
      mileage: mileage ? parseInt(mileage, 10) : 0,
      mileagePerYear: preset?.mileagePerYear || (type === 'car' ? 15000 : 5000),
      customImg: customImg?.dataUrl || null,
      customImgKind: customImg?.kind || null,
    });
    if (ok) go(type === 'car' ? 'cars' : 'bikes');
  };

  // Vehicle shape used by the live preview tile
  const previewVehicle = {
    type, preset: presetKey, name: name || preset?.name || '',
    customImg: customImg?.dataUrl, customImgKind: customImg?.kind,
  };

  return (
    <div style={{ height: '100%', background: C.bg, display: 'flex', flexDirection: 'column' }}>
      <HeaderBar
        eyebrow={type === 'car' ? 'Stellplatz A' : 'Stellplatz B'}
        title={type === 'car' ? 'Neues Auto' : 'Neues Motorrad'}
        sub={`${store.countByType(type)} / ${MAX_PER_TYPE} belegt`}
        onBack={() => go(type === 'car' ? 'cars' : 'bikes')}
      />
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 14px 24px' }}>
        {/* Live preview */}
        <div style={{
          background: '#0a0b0d', border: `1px solid ${C.borderSoft}`, borderRadius: 12,
          padding: 12, marginBottom: 14, position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 110,
        }}>
          <VehicleArt vehicle={previewVehicle} width={customImg ? 180 : 220}/>
          {customImg && (
            <button onClick={() => setCustomImg(null)} style={{
              position: 'absolute', top: 8, right: 8,
              padding: '4px 8px', borderRadius: 6, cursor: 'pointer',
              background: 'rgba(0,0,0,0.7)', border: `1px solid ${C.border}`,
              color: C.muted, fontFamily: MONO, fontSize: 10, fontWeight: 600,
              display: 'flex', alignItems: 'center', gap: 4,
            }}><Icon name="trash" size={11}/> EIGENES BILD</button>
          )}
        </div>

        {/* Upload row */}
        <Section label="Bild">
          <input ref={fileRef} type="file" accept="image/*"
            onChange={onPickFile}
            style={{ display: 'none' }}/>
          <button onClick={() => fileRef.current?.click()} disabled={uploading} style={{
            width: '100%', padding: '12px 14px', borderRadius: 10,
            background: C.bg2, border: `1px dashed ${C.border}`,
            color: customImg ? 'var(--accent)' : C.text,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            cursor: uploading ? 'wait' : 'pointer',
            fontFamily: MONO, fontSize: 11.5, letterSpacing: 0.4, fontWeight: 500,
          }}>
            <Icon name={customImg ? 'check' : 'plus'} size={14}/>
            {uploading ? 'VERARBEITE…' : customImg ? 'BILD ERSETZEN' : 'EIGENES BILD HOCHLADEN'}
          </button>
          <div style={{
            fontFamily: MONO, fontSize: 9.5, color: C.muted, marginTop: 6, lineHeight: 1.4,
          }}>
            Optional. Linework-Skizzen werden automatisch freigestellt;
            Fotos werden direkt verwendet.
          </div>
        </Section>

        <Section label="Modell">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {presets.map(p => (
              <button key={p.key} onClick={() => setPresetKey(p.key)} style={{
                all: 'unset', cursor: 'pointer',
                background: presetKey === p.key ? 'rgba(0,229,255,0.08)' : C.bg2,
                border: `1px solid ${presetKey === p.key ? 'var(--accent)' : C.border}`,
                borderRadius: 12, padding: 10,
                display: 'flex', flexDirection: 'column', gap: 8,
              }}>
                <div style={{
                  height: 56, background: '#0a0b0d', borderRadius: 8,
                  border: `1px solid ${C.borderSoft}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden',
                }}>
                  <VehicleArt vehicle={{ type, preset: p.key, name: p.name }} width={110}/>
                </div>
                <div style={{ fontFamily: FONT, fontSize: 12, fontWeight: 600,
                  color: presetKey === p.key ? 'var(--accent)' : C.text }}>{p.label}</div>
              </button>
            ))}
          </div>
        </Section>

        <Section label="Bezeichnung">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Field label="NAME">
              <input value={name} onChange={e => setName(e.target.value)} style={fieldStyle}/>
            </Field>
            <Field label="SPITZNAME">
              <input value={nick} onChange={e => setNick(e.target.value)} placeholder="—" style={fieldStyle}/>
            </Field>
          </div>
          <div style={{ marginTop: 8 }}>
            <Field label="MODELL">
              <input value={model} onChange={e => setModel(e.target.value)} placeholder="z. B. Hyper Naked · 890 cc" style={fieldStyle}/>
            </Field>
          </div>
        </Section>

        <Section label="Daten">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <Field label="BAUJAHR">
              <input value={year} onChange={e => setYear(e.target.value.replace(/\D/g, ''))}
                inputMode="numeric" style={fieldStyle}/>
            </Field>
            <Field label="KENNZEICHEN">
              <input value={plate} onChange={e => setPlate(e.target.value)} placeholder="—" style={fieldStyle}/>
            </Field>
          </div>
          <div style={{ marginTop: 8 }}>
            <Field label="AKTUELLER KM-STAND">
              <input value={mileage} onChange={e => setMileage(e.target.value.replace(/\D/g, ''))}
                inputMode="numeric" placeholder="0" style={fieldStyle}/>
            </Field>
          </div>
        </Section>

        <button onClick={save} disabled={!canSave} style={{
          width: '100%', padding: '14px', borderRadius: 12,
          background: canSave ? 'var(--accent)' : C.bg3,
          color: canSave ? '#000' : C.dim, border: 'none',
          fontFamily: FONT, fontSize: 14, fontWeight: 600,
          cursor: canSave ? 'pointer' : 'not-allowed', marginTop: 6,
        }}>{store.countByType(type) >= MAX_PER_TYPE ? 'Stellplatz voll (max. ' + MAX_PER_TYPE + ')' : 'Fahrzeug hinzufügen'}</button>
      </div>
    </div>
  );
}
