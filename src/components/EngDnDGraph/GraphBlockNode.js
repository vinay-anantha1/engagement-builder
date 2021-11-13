import React from 'react';
import EngAdvancedIcon from '../EngAdvancedIcons';
import { ICON_TYPES } from '../Constants';
import { SETTINGS, DELETE } from './constants';
import { COLORS } from '../Constants/StyleVar';

const GraphBlockNode = (props) => {
  const { id, iconType, color, onClickActionIcon, isConfigured } = props;

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
    <EngAdvancedIcon
      type={iconType}
      actionNodes={actionNodes}
      id={id}
      onClick={() => onClickActionIcon({ blockId: id, actionType: SETTINGS })}
    />
  );
};

GraphBlockNode.defaultProps = {
  onClickActionIcon: () => {},
};

export default GraphBlockNode;
