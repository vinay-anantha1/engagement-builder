import * as AntdIcons from "@ant-design/icons";

/**
 * Icon Component
 */
const EngIcon = ({ type, background, ...rest }) => {
  console.log({ type });
  const AntdIcon = AntdIcons[type];
  return <AntdIcon style={{ background }} {...rest} />;
};
export default EngIcon;