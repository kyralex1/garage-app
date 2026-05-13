// Garage app — shared store with localStorage persistence.
// Demo seed: BMW (Auto) + Yamaha R1 / MT-09 / Honda CB650R (Motorräder)
// All maintenance tasks computed on the fly via deriveDue().

const STORE_KEY = 'garage_app_v4';
const MAX_PER_TYPE = 10;

// Vehicle presets — image art + sensible defaults.
// Users pick one of these (or "generic") when adding a vehicle.
const PRESETS = {
  bmw_e30: {
    label: 'BMW · 3er (E-Series)', type: 'car', img: 'assets/vehicles/bmw.png',
    name: 'BMW', model: '3er Coupé', mileagePerYear: 12000,
  },
  bmw_g20: {
    label: 'BMW · 3er M340i', type: 'car', img: 'assets/vehicles/bmw.png',
    name: 'BMW', model: 'M340i xDrive', mileagePerYear: 18000,
  },
  r1: {
    label: 'Yamaha · R1', type: 'bike', img: 'assets/vehicles/r1.png',
    name: 'R1', model: 'Supersport · 998 cc', mileagePerYear: 3500,
  },
  mt09: {
    label: 'Yamaha · MT-09', type: 'bike', img: 'assets/vehicles/mt09.png',
    name: 'MT-09', model: 'Hyper Naked · 890 cc', mileagePerYear: 7500,
  },
  cb650r: {
    label: 'Honda · CB650R', type: 'bike', img: 'assets/vehicles/cb650r.png',
    name: 'CB650R', model: 'Naked · 649 cc', mileagePerYear: 9000,
  },
  generic_car: {
    label: 'Anderes Auto', type: 'car', img: null,
    name: 'Auto', model: '', mileagePerYear: 15000,
  },
  generic_bike: {
    label: 'Anderes Motorrad', type: 'bike', img: null,
    name: 'Motorrad', model: '', mileagePerYear: 5000,
  },
};
const PRESETS_BY_TYPE = (t) => Object.entries(PRESETS).filter(([k, p]) => p.type === t).map(([k, p]) => ({ key: k, ...p }));

const todayISO = () => new Date().toISOString().slice(0, 10);
const daysBetween = (a, b) => Math.round((new Date(b) - new Date(a)) / 86400000);
const addMonths = (iso, n) => {
  const d = new Date(iso); d.setMonth(d.getMonth() + n);
  return d.toISOString().slice(0, 10);
};
const fmtDate = (iso) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
};
const fmtKm = (n) => n == null ? '—' : n.toLocaleString('de-DE') + ' km';
const fmtEur = (n) => n == null ? '—' : n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €';

// ─────────────────────────────────────────────────────────────
// Seed
// ─────────────────────────────────────────────────────────────
const SEED = {
  vehicles: [
    { id: 'bmw1', type: 'car', preset: 'bmw_g20', name: 'BMW', model: 'M340i xDrive',
      nick: 'Daily', plate: 'M · GR 340', year: 2022, vin: 'WBA···7H921',
      mileage: 38420, mileagePerYear: 18000 },
    { id: 'r1', type: 'bike', preset: 'r1', name: 'R1', model: 'Supersport · 998 cc',
      nick: 'Trackbike', plate: 'M · TR 1', year: 2019, vin: 'JYA···44119',
      mileage: 14210, mileagePerYear: 3500 },
    { id: 'mt09', type: 'bike', preset: 'mt09', name: 'MT-09', model: 'Hyper Naked · 890 cc',
      nick: 'Daily Funbike', plate: 'M · MT 9', year: 2023, vin: 'JYA···52223',
      mileage: 9840, mileagePerYear: 7500 },
    { id: 'cb650r', type: 'bike', preset: 'cb650r', name: 'CB650R', model: 'Naked · 649 cc',
      nick: 'Touring', plate: 'M · CB 65', year: 2021, vin: 'ZDC···18291',
      mileage: 22780, mileagePerYear: 9000 },
  ],
  tasks: [
    // BMW
    { id: 't1', vehicleId: 'bmw1', title: 'Ölservice', kind: 'oil', intervalMonths: 12, intervalKm: 25000, lastDate: '2025-09-14', lastKm: 30100, cost: 245 },
    { id: 't2', vehicleId: 'bmw1', title: 'HU / AU', kind: 'hu', intervalMonths: 24, lastDate: '2024-08-02', cost: 138.50 },
    { id: 't3', vehicleId: 'bmw1', title: 'Bremsflüssigkeit', kind: 'fluid', intervalMonths: 24, lastDate: '2024-08-02', cost: 75 },
    { id: 't4', vehicleId: 'bmw1', title: 'Reifenwechsel Sommer', kind: 'tires', intervalMonths: 6, lastDate: '2026-04-03', cost: 49 },
    { id: 't5', vehicleId: 'bmw1', title: 'Inspektion gross', kind: 'service', intervalMonths: 24, intervalKm: 30000, lastDate: '2025-09-14', lastKm: 30100, cost: 612 },

    // R1 — überfälliger Ölwechsel als Demo
    { id: 't10', vehicleId: 'r1', title: 'Ölwechsel', kind: 'oil', intervalKm: 6000, intervalMonths: 12, lastDate: '2025-03-08', lastKm: 11500, cost: 92 },
    { id: 't11', vehicleId: 'r1', title: 'Ventilspiel prüfen', kind: 'engine', intervalKm: 24000, intervalMonths: 48, lastDate: '2023-06-12', lastKm: 6300, cost: 460 },
    { id: 't12', vehicleId: 'r1', title: 'HU', kind: 'hu', intervalMonths: 24, lastDate: '2024-05-22', cost: 64 },
    { id: 't13', vehicleId: 'r1', title: 'Kette + Ritzel', kind: 'chain', intervalKm: 18000, lastDate: '2024-04-19', lastKm: 8900, cost: 240 },
    { id: 't14', vehicleId: 'r1', title: 'Reifen', kind: 'tires', intervalKm: 5000, lastDate: '2025-08-02', lastKm: 12100, cost: 380 },

    // MT-09
    { id: 't20', vehicleId: 'mt09', title: 'Ölwechsel', kind: 'oil', intervalKm: 10000, intervalMonths: 12, lastDate: '2025-08-30', lastKm: 7200, cost: 85 },
    { id: 't21', vehicleId: 'mt09', title: 'Inspektion 12.000', kind: 'service', intervalKm: 12000, intervalMonths: 24, lastDate: '2024-11-08', lastKm: 4500, cost: 320 },
    { id: 't22', vehicleId: 'mt09', title: 'HU', kind: 'hu', intervalMonths: 24, lastDate: '2025-11-02', cost: 64 },
    { id: 't23', vehicleId: 'mt09', title: 'Kettenpflege', kind: 'chain', intervalKm: 1000, lastDate: '2026-04-12', lastKm: 9100, cost: 12 },

    // CB650R — bald HU fällig
    { id: 't30', vehicleId: 'cb650r', title: 'Ölwechsel', kind: 'oil', intervalKm: 12000, intervalMonths: 12, lastDate: '2025-10-04', lastKm: 19800, cost: 88 },
    { id: 't31', vehicleId: 'cb650r', title: 'HU', kind: 'hu', intervalMonths: 24, lastDate: '2024-06-17', cost: 64 },
    { id: 't32', vehicleId: 'cb650r', title: 'Bremsbeläge vorne', kind: 'brake', intervalKm: 15000, lastDate: '2024-09-21', lastKm: 14200, cost: 78 },
    { id: 't33', vehicleId: 'cb650r', title: 'Reifen hinten', kind: 'tires', intervalKm: 9000, lastDate: '2025-07-12', lastKm: 17100, cost: 195 },
  ],
};

// ─────────────────────────────────────────────────────────────
// Derive: due-status of a single task
// ─────────────────────────────────────────────────────────────
function deriveDue(task, vehicle, now = new Date()) {
  const today = now.toISOString().slice(0, 10);
  let dueDate = null, dueKm = null;
  if (task.intervalMonths && task.lastDate) dueDate = addMonths(task.lastDate, task.intervalMonths);
  if (task.intervalKm && task.lastKm != null) dueKm = task.lastKm + task.intervalKm;

  // Time-based progress
  const daysLeft = dueDate ? daysBetween(today, dueDate) : null;
  const kmLeft = (dueKm != null && vehicle?.mileage != null) ? dueKm - vehicle.mileage : null;

  // Estimate "days until km is reached" via mileagePerYear
  let daysFromKm = null;
  if (kmLeft != null && vehicle?.mileagePerYear) {
    const perDay = vehicle.mileagePerYear / 365;
    if (perDay > 0) daysFromKm = Math.round(kmLeft / perDay);
  }

  // Whichever fires first wins
  let effDays = null, basis = null;
  if (daysLeft != null && (effDays == null || daysLeft < effDays)) { effDays = daysLeft; basis = 'date'; }
  if (daysFromKm != null && (effDays == null || daysFromKm < effDays)) { effDays = daysFromKm; basis = 'km'; }

  let status = 'ok';
  if (effDays != null) {
    if (effDays < 0) status = 'overdue';
    else if (effDays <= 30) status = 'soon';
  }

  return { dueDate, dueKm, daysLeft, kmLeft, effDays, basis, status };
}

// ─────────────────────────────────────────────────────────────
// Store + React context
// ─────────────────────────────────────────────────────────────
function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return JSON.parse(JSON.stringify(SEED));
}
function saveStore(s) {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch (e) {}
}

const StoreContext = React.createContext(null);

function StoreProvider({ children }) {
  const [data, setData] = React.useState(() => loadStore());
  React.useEffect(() => { saveStore(data); }, [data]);

  // cross-instance sync (so iOS + Android frames stay in sync via storage event)
  React.useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORE_KEY && e.newValue) {
        try { setData(JSON.parse(e.newValue)); } catch (err) {}
      }
    };
    window.addEventListener('storage', onStorage);
    // also respond to in-page custom events
    const onLocal = (e) => setData(loadStore());
    window.addEventListener('garage:sync', onLocal);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('garage:sync', onLocal);
    };
  }, []);

  const update = (fn) => {
    setData((d) => {
      const next = fn(JSON.parse(JSON.stringify(d)));
      // notify other instances on same page
      setTimeout(() => window.dispatchEvent(new CustomEvent('garage:sync')), 0);
      return next;
    });
  };

  const api = React.useMemo(() => ({
    data,
    vehicles: data.vehicles,
    tasks: data.tasks,
    getVehicle: (id) => data.vehicles.find(v => v.id === id),
    tasksFor: (vid) => data.tasks.filter(t => t.vehicleId === vid),
    addTask: (t) => update(d => { d.tasks.push({ ...t, id: 't' + Date.now() }); return d; }),
    updateTask: (id, patch) => update(d => {
      const t = d.tasks.find(x => x.id === id);
      if (t) Object.assign(t, patch);
      return d;
    }),
    completeTask: (id, atKm) => update(d => {
      const t = d.tasks.find(x => x.id === id);
      if (t) {
        t.lastDate = todayISO();
        if (t.intervalKm && atKm != null) t.lastKm = atKm;
      }
      return d;
    }),
    deleteTask: (id) => update(d => { d.tasks = d.tasks.filter(x => x.id !== id); return d; }),
    updateVehicle: (id, patch) => update(d => {
      const v = d.vehicles.find(x => x.id === id);
      if (v) Object.assign(v, patch);
      return d;
    }),
    addVehicle: (v) => {
      const type = v.type;
      const count = data.vehicles.filter(x => x.type === type).length;
      if (count >= MAX_PER_TYPE) return false;
      update(d => { d.vehicles.push({ ...v, id: 'v' + Date.now() }); return d; });
      return true;
    },
    deleteVehicle: (id) => update(d => {
      d.vehicles = d.vehicles.filter(x => x.id !== id);
      d.tasks = d.tasks.filter(t => t.vehicleId !== id);
      return d;
    }),
    countByType: (t) => data.vehicles.filter(x => x.type === t).length,
    reset: () => { setData(JSON.parse(JSON.stringify(SEED))); setTimeout(() => window.dispatchEvent(new CustomEvent('garage:sync')), 0); },
    // computed: all upcoming items, sorted
    upcoming: (limit = 99) => {
      const items = data.tasks.map(t => {
        const v = data.vehicles.find(x => x.id === t.vehicleId);
        return { task: t, vehicle: v, due: deriveDue(t, v) };
      });
      items.sort((a, b) => {
        const ax = a.due.effDays ?? 99999;
        const bx = b.due.effDays ?? 99999;
        return ax - bx;
      });
      return items.slice(0, limit);
    },
  }), [data]);

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>;
}

const useStore = () => React.useContext(StoreContext);

Object.assign(window, {
  StoreProvider, useStore, deriveDue,
  fmtDate, fmtKm, fmtEur, todayISO, addMonths, daysBetween,
  PRESETS, PRESETS_BY_TYPE, MAX_PER_TYPE,
});
