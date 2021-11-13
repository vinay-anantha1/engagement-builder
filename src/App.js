import { ICON_TYPES }  from "./components/Constants";
import { COLORS } from './components/Constants/ColorPallete';
import EngAdvancedIcon from './components/EngAdvancedIcons';

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
    <EngAdvancedIcon
      type={ICON_TYPES.SMS}
      background={COLORS.YELLOW}
      actionNodes={actionNodes}
    />
    </>
  );
}

export default App;