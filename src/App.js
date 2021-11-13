import { ICON_TYPES }  from "./components/Constants";
import { COLORS } from './components/Constants/StyleVar';
import EngDndGraphSidebarDoc from './doc/EngDndGraphSidebarDoc';

function App() {
  const actionNodes = [
    {
      type: ICON_TYPES.SETTING,
      position: 'top-right',
      background: COLORS.GREY,
    },
    {
      type: ICON_TYPES.DELETE,
      position: 'top-left',
      background: COLORS.RED,
    },
  ];

  return (
    <>
      <EngDndGraphSidebarDoc />
    </>
  );
}

export default App;