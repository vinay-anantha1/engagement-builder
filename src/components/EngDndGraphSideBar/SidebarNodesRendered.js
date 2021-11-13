import React from 'react';
import { Row } from 'antd';
import SideBarIcon from './SideBarIcon';
import { Label } from '../Label';
import { COLORS } from '../Constants/StyleVar';

const SidebarNodesRendered = ({ nodes = [], isNodeDraggable, endDrag }) =>
  nodes.map((node) => {
    const { title, children, color, key } = node;
    return (
      <Row className='category-container' key={key}>
        <Row className='align-items-center'>
          <Label fontSize='14px' color={COLORS.DARKBLACK} fontWeight="500">{title}</Label>
        </Row>
        <Row className='icons-container'>
          {children.map((childNode) => (
            <SideBarIcon
              childNode={childNode}
              color={color}
              key={childNode.type}
              isNodeDraggable={isNodeDraggable}
              endDrag={endDrag}
            />
          ))}
        </Row>
      </Row>
    );
  });

export default SidebarNodesRendered;
