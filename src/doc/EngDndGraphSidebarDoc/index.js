import React from 'react';
import { Layout } from 'antd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ICON_TYPES } from '../../components/Constants';
import { COLORS } from '../../components/Constants/StyleVar';
import EngDndGraphSidebar from '../../components/EngDndGraphSideBar';

const { Sider } = Layout;

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
        label: 'Wait',
      },
    ],
    color: COLORS.BLUE,
  },
];

const props = {
  sidebarTitle: 'Building blocks',
  sidebarDescription:
    'Drag & drop blocks to create the journey, start with the Entry triggers',
  nodes: sidebarNodes,
};

function EngDndGraphSidebarDoc() {
  return (
    <Layout>
      <Sider width={240}>
        <DndProvider backend={HTML5Backend}>
          <EngDndGraphSidebar {...props} isNodeDraggable onClickConfigure={()=>{alert('Configure on click as per need')}} />
        </DndProvider>
      </Sider>
    </Layout>
  );
}
export default EngDndGraphSidebarDoc;
