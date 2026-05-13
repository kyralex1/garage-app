import React from 'react';
import { ScreenClosed, ScreenGarage, ScreenList } from './screens/ScreensMain';
import { ScreenDetail, ScreenAdd, ScreenAddVehicle, ScreenNotifications } from './screens/ScreensDetail';

export function App({ safeTop = 0, accent = '#00e5ff', doorSpeed = 2.2, onReplayDoor, instanceId = 'default' }) {
  const skip = typeof location !== 'undefined' && /[?&]skipDoor=1/.test(location.search);
  const [route, setRoute] = React.useState(skip ? 'garage' : 'closed');
  const [doorOpen, setDoorOpen] = React.useState(skip);

  React.useEffect(() => {
    if (onReplayDoor) {
      const handler = () => { setRoute('closed'); setDoorOpen(false); };
      window.addEventListener('garage:replay-door', handler);
      return () => window.removeEventListener('garage:replay-door', handler);
    }
  }, []);

  const go = (next) => {
    if (next === 'closed') setDoorOpen(false);
    setRoute(next);
  };

  let screen;
  if (route === 'closed') {
    screen = (
      <ScreenClosed
        accent={accent}
        doorSpeed={doorSpeed}
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

  const padTop = route !== 'closed' ? safeTop : 0;
  return (
    <div style={{ height: '100%', background: '#0a0b0d', paddingTop: padTop, boxSizing: 'border-box' }}>
      {screen}
    </div>
  );
}
