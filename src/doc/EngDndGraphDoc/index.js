import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components';
import { Label } from '../../components/Label';
import EngIcon from '../../components/EngIcon';
import EngDnDGraph from '../../components/EngDnDGraph';
import Trigger from './Trigger';
import { COLORS } from '../../components/Constants/StyleVar';
import { ICON_TYPES } from '../../components/Constants';

const EngBorderedBox = styled.div`
  width: ${(props) => props.width || '42'}px;
  height: ${(props) => props.height || '42'}px;
  border: ${(props) => props.border || '1px dashed #B3BAC5'};
  border-radius: ${(props) => (props.width ? '21px' : '16px')};
  background-color: ${(props) => props.backgroundColor || '#FAFBFC'};
`;
const sidebarNodes = [
  {
    key: 'engagements',
    title: 'Engagements',
    children: [
      {
        id: 'sms',
        type: ICON_TYPES.SMS,
        label: 'SMS',
      },
      {
        id: 'email',
        type: ICON_TYPES.EMAIL,
        label: 'Email',
      },
      {
        id: 'mpush',
        type: ICON_TYPES.PUSH,
        label: 'M-Push',
      },
      {
        id: 'whatsapp',
        type: ICON_TYPES.WHATSAPP,
        label: 'Whatsapp',
      },
      {
        id: 'fb',
        type: ICON_TYPES.FB,
        label: 'Facebook',
      },
      {
        id: 'instagram',
        type: ICON_TYPES.INSTAGRAM,
        label: 'Instagram',
      },
    ],
    color: COLORS.YELLOW,
  },
  {
    key: 'flowControl',
    title: 'Flow Control',
    children: [
      {
        id: 'wait',
        type: ICON_TYPES.WAIT,
        label: 'Wait date',
      },
      {
        id: 'waitDuration',
        type: ICON_TYPES.WAIT_DURATION,
        label: 'Wait duration',
      },
      {
        id: 'downTrend',
        type: ICON_TYPES.DOWN_TREND,
        label: 'Down Trend',
      },
    ],
    color: COLORS.BLUE,
  },
];

const entryTrigger = {
  id: '1',
  component: Trigger,
  props: {
    triggerContent: (
      <h6 style={{ marginTop: '24px', textAlign: 'left', marginLeft: '16px' }}>
        Start journey by defining Entry trigger
      </h6>
    ),
  },
  to: ['2'],
  width: 148,
  height: 180,
  type: 'ENTRY_TRIGGER',
};

const endIconProps = {
  type: 'end',
  style: {
    padding: '15px 0',
    color: '#b3bac5',
  },
};

export const initialGraphData = [
  entryTrigger,
  {
    id: 'emptyGraphText',
    component: Label,
    props: {
      type: 'label1',
      children: 'Drag and drop building blocks to complete the journey',
    },
    showEdge: false,
    width: 180,
    height: 40,
    type: 'EMPTY_GRAPH_TEXT',
  },
  {
    from: '1',
    id: '2',
    component: EngBorderedBox,
    to: ['3'],
    type: 'PLACEHOLDER_NODE',
    width: 48,
    height: 48,
  },
  {
    from: '2',
    id: '3',
    component: EngBorderedBox,
    to: ['4', '5'],
    type: 'PLACEHOLDER_NODE',
    width: 48,
    height: 48,
  },
  {
    from: '3',
    id: '4',
    component: EngBorderedBox,
    to: ['6'],
    type: 'PLACEHOLDER_NODE',
    width: 48,
    height: 48,
  },
  {
    from: '3',
    id: '5',
    component: EngBorderedBox,
    to: ['7'],
    type: 'PLACEHOLDER_NODE',
    width: 48,
    height: 48,
  },
  {
    from: '4',
    id: '6',
    component: EngIcon,
    props: endIconProps,
    type: 'END_NODE',
    width: 48,
    height: 48,
  },
  {
    from: '6',
    id: '7',
    component: EngIcon,
    props: endIconProps,
    type: 'END_NODE',
    width: 48,
    height: 48,
  },
];

const props = {
  sidebarProps: {
    sidebarTitle: 'Building blocks',
    sidebarDescription:
      'Drag & drop blocks to create the journey, start with the Entry triggers',
    nodes: sidebarNodes,
  },
  initialGraphData,
  dndGraphId: 'journey-graph-container',
};
function EngDndGraphSidebar() {
  const [graphNodes, setGraphNodes] = useState(initialGraphData);
  return (
    <DndProvider backend={HTML5Backend}>
      <EngDnDGraph
        {...props}
        graphNodes={graphNodes}
        setGraphNodes={setGraphNodes}
      />
    </DndProvider>
  );
}
export default EngDndGraphSidebar;