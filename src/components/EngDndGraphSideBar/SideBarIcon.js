import React from 'react';
import { useDrag } from 'react-dnd';
import EngAdvancedIcon from '../EngAdvancedIcons';

const SideBarIcon = ({ childNode, color, isNodeDraggable }) => {
  const { type, label, id, isMultiPath } = childNode;
  let drag;

  [, drag] = useDrag({
    type: 'draggableNode',
    item: {
      id,
      iconType: type,
      color,
      isMultiPath,
    },
  });

  return (
    <div className='node-container' key={type}>
      <EngAdvancedIcon
        type={type}
        background={color}
        label={label}
        dragRef={isNodeDraggable && drag}
      />
    </div>
  );
};

export default SideBarIcon;
