import React from 'react';
import SidebarNodesRendered from './SidebarNodesRendered';
import { Row } from 'antd';
import './index.scss';
import { Label, LabelInline } from '../Label';
import { COLORS } from '../Constants/StyleVar';

export const EngDndGraphSidebar = (props) => {
  const {
    nodes = [],
    sidebarTitle,
    sidebarDescription,
    isNodeDraggable,
    endDrag,
  } = props;

  return (
    <Row className='dnd-graph-sidebar-container'>
      {sidebarTitle && (
        <Row className='align-items-center'>
          <Label fontWeight='bold' fontSize='22px' fontColor={COLORS.DARKBLACK}>
            {sidebarTitle}
          </Label>
        </Row>
      )}
      {sidebarDescription && (
        <Label fontColor={COLORS.GREY}>{sidebarDescription}</Label>
      )}
      <SidebarNodesRendered
        nodes={nodes}
        isNodeDraggable={isNodeDraggable}
        endDrag={endDrag}
      />
    </Row>
  );
};

export default EngDndGraphSidebar;
