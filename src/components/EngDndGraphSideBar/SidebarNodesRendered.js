import React from 'react';
import { Row } from 'antd';
import SideBarIcon from './SideBarIcon';

const SidebarNodesRendered = ({ nodes = [], isNodeDraggable, endDrag }) =>
  nodes.map((node) => {
    const { title, children, color, key } = node;
    return (
      <Row className='category-container' key={key}>
        <Row className='align-items-center'>
          <span type='h4'>{title}</span>
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
