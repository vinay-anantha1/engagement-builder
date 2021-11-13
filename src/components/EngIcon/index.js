import * as AntdIcons from "@ant-design/icons";

/**
 * Icon Component
 */
const EngIcon = ({ type, background, ...rest }) => {
  const AntdIcon = AntdIcons[type];
  return <AntdIcon style={{ background }} {...rest} />;
};
export default EngIcon;