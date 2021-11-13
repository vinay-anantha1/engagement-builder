import * as AntdIcons from "@ant-design/icons";

/**
 * Icon Component
 */
const EngIcon = ({type,...rest}) => {
  const AntdIcon = AntdIcons[type];
  return <AntdIcon {...rest}/>;
};
export default EngIcon;