import React, { useState, useMemo } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import styled from 'styled-components';
import { Label } from '../../components/Label';
import EngIcon from '../../components/EngIcon';
import EngDnDGraph from '../../components/EngDnDGraph';
import Trigger from './Trigger';
import cloneDeep from 'lodash/cloneDeep';
import { COLORS } from '../../components/Constants/StyleVar';
import { ICON_TYPES } from '../../components/Constants';
import './index.scss';
import SlideDrawer from '../../components/SlideDrawer';
import Backdrop from '../../components/Backdrop';

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
        id: 'Decision split',
        type: ICON_TYPES.DECISION_SPLIT,
        label: 'Decision split',
        isMultiPath: true,
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
      <h6 className='eng-trigger-content'>
        Start journey by defining any criteria
      </h6>
    ),
  },
  to: ['2'],
  width: 148,
  height: 180,
  type: 'ENTRY_TRIGGER',
};

const endIconProps = {
  type: ICON_TYPES.END,
  style: {
    color: COLORS.DARK_RED,
    fontSize: '38px',
  },
};

export const initialGraphData = [
  entryTrigger,
  {
    id: 'emptyGraphText',
    component: Label,
    props: {
      children: 'Drag and drop building blocks to complete the journey',
      color: COLORS.LIGHT_GREY,
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
    sidebarDescription: 'Drag & drop blocks to create the journey',
    nodes: sidebarNodes,
  },
  initialGraphData,
  dndGraphId: 'journey-graph-container',
};

function EngDndGraphDoc() {
  /**The graphNodes state will hold info about the Graph*/
  const [graphNodes, setGraphNodes] = useState(initialGraphData);

  /**The journeyBlockDetails will hold configuration info about blocks in graphNodes */
  const [journeyBlockDetails, setJourneyBlockDetails] = useState({});

  /**If settings icon clicked, set showConfigScreen to true */
  const [showConfigScreen, setShowConfigScreen] = useState(false);

  /**Set selectedBlockId for node on which settings icon is clicked. */
  const [selectedBlockId, setSelectedBlockId] = useState(null);

  /**On click of configure :
   * 1) set SelectedBlockId with the block being clicked
   * 2) show configScreen (show Custom Component inside Drawer or Modal)*/
  const onClickConfigure = (blockId) => {
    setSelectedBlockId(blockId);
    setShowConfigScreen(true);
  };

  /**When new node is added :
   * add the block info in JourneyBlockDetails also.
   */
  const onDropNewNode = ({ blockId, blockType }) => {
    setJourneyBlockDetails((prevState) => {
      const clonedState = cloneDeep(prevState);
      clonedState[blockId] = {
        blockType,
      };
      return clonedState;
    });
  };

  /**After configuring block info, update state in journeyBlockDetails */
  const updateJourneyBlockDetails = (blockId, blockData) => {
    setJourneyBlockDetails((prevState) => {
      const clonedState = cloneDeep(prevState);
      clonedState[blockId] = {
        ...prevState[blockId],
        ...blockData,
      };
      return clonedState;
    });
    setShowConfigScreen(false);
  };
  return (
    <>
      <DndProvider backend={HTML5Backend}>
        <EngDnDGraph
          {...props}
          graphNodes={graphNodes}
          setGraphNodes={setGraphNodes}
          onClickConfigure={onClickConfigure}
          onDropNewNode={onDropNewNode}
        />
      </DndProvider>
      <SlideDrawer
        show={showConfigScreen}
        content='Pass any component to configure this block.'
      />
      {showConfigScreen && (
        <Backdrop closeSlider={() => updateJourneyBlockDetails(selectedBlockId,null)} />
      )}
    </>
  );
}
export default EngDndGraphDoc;
