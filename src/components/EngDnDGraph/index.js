/* eslint-disable no-shadow */
import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useMemo,
} from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';
import '@antv/x6-react-shape';
import { Graph, Markup } from '@antv/x6';
import { DagreLayout } from '@antv/layout';
import { useDrop } from 'react-dnd';
import { nanoid } from 'nanoid';
import cloneDeep from 'lodash/cloneDeep';
import debounce from 'lodash/debounce';
import EngDndGraphSidebar from '../EngDndGraphSideBar';
import { Row } from 'antd';
import { Label } from '../Label';
import GraphBlockNode from './GraphBlockNode';
import EngIcon from '../EngIcon';

import {
  CUSTOM_EDGE,
  CUSTOM_EDGE_DASHED,
  GRAPH_DIRECTION,
  GRAPH_LAYOUT_TYPE,
  GRAPH_ALIGNMENT,
  ENTRY_TRIGGER,
  EMPTY_GRAPH_TEXT,
  PLACEHOLDER_NODE,
  END_NODE,
  SETTINGS,
  DELETE,
} from './constants';
import { COLORS } from '../Constants/StyleVar';
import { ICON_TYPES } from '../Constants';
import './index.scss';

const EngBorderedBox = styled.div`
  width: ${(props) => props.width || '42'}px;
  height: ${(props) => props.height || '42'}px;
  border: ${(props) => props.border || '1px dashed #B3BAC5'};
  border-radius: ${(props) => (props.width ? '21px' : '16px')};
  background-color: ${(props) => props.backgroundColor || '#FAFBFC'};
`;

const endIconProps = {
  type: ICON_TYPES.END,
  style: {
    color: 'red',
    fontSize: '38px',
  },
};

const EngDndGraph = (props) => {
  const {
    sidebarProps = {},
    dndGraphId,
    onClickConfigure,
    onDropNewNode = () => {},
    graphNodes,
    setGraphNodes,
    nodeTitleMapping,
  } = props;

  const graphRef = useRef(null);
  const dagreLayoutRef = useRef(null);
  const previouslyFoundEdge = useRef(-1);
  const edgesData = useRef([]);
  const graphContainerPositionStart = useRef(null);

  const [graphData, setGraphData] = useState({
    nodes: [],
    edges: [],
  });

  const blockNodes = useMemo(
    () =>
      graphNodes.filter(
        (node) =>
          ![
            ENTRY_TRIGGER,
            END_NODE,
            PLACEHOLDER_NODE,
            EMPTY_GRAPH_TEXT,
          ].includes(node.type)
      ),
    [graphNodes]
  );

  /* Register Custom Edges
  Currently two types of custom edges are supported,
  Normal line and dashed line
  When no block nodes are present, dashed line are displayed
  */
  const registerEdges = useCallback(() => {
    Graph.registerEdge(
      CUSTOM_EDGE_DASHED,
      {
        zIndex: -1,
        attrs: {
          line: {
            stroke: COLORS.LIGHT_GREY,
            strokeWidth: 1,
            sourceMarker: null,
            targetMarker: null,
            strokeDasharray: '3, 3',
          },
        },
      },
      true
    );
    Graph.registerEdge(
      CUSTOM_EDGE,
      {
        zIndex: -1,
        attrs: {
          line: {
            fill: 'none',
            strokeLinejoin: 'round',
            strokeWidth: '2',
            stroke: COLORS.LIGHT_GREY,
            sourceMarker: null,
            targetMarker: null,
          },
        },
      },
      true
    );
  }, []);

  const initializeGraphAndLayout = useCallback(() => {
    graphRef.current = new Graph({
      container: document.getElementById(dndGraphId),
      connecting: {
        allowBlank: true,
      },
      interacting: {
        nodeMovable: false,
      },
      scroller: {
        padding: 2,
        enabled: true,
        pannable: false,
      },
      onEdgeLabelRendered: (args) => {
        const { selectors, label } = args;
        const content = selectors.foContent;
        if (content && label.text) {
          ReactDOM.render(<Label>{label.text}</Label>, content);
        }
      },
    });

    dagreLayoutRef.current = new DagreLayout({
      type: GRAPH_LAYOUT_TYPE, // dagre
      rankdir: GRAPH_DIRECTION, // LR
      align: GRAPH_ALIGNMENT, // UL
      nodesepFunc: () => 15,
      ranksepFunc: (node) => {
        if (node.type === ENTRY_TRIGGER) {
          /**Gap between the Entry Trigger and First child */
          return 150;
        }
        /**Gap between other nodes */
        return 35;
      },
    });
  }, []);

  /* Function to prepare data to pass to the graph instance */
  const prepareGraphNodeEdges = useCallback(() => {
    const graphNodesData = [];
    const graphEdges = [];

    const edgeType = blockNodes.length ? CUSTOM_EDGE : CUSTOM_EDGE_DASHED;
    const size = blockNodes.length ? 42 : 56;

    graphNodes.forEach((node) => {
      const Component = node.component; // Passed from parent
      graphNodesData.push({
        id: node.id,
        component: (
          <Component
            {...node.props}
            width={node.width || size}
            height={node.height || size}
          />
        ),
        width: node.width || size,
        height: node.height || size,
        shape: 'react-shape',
        zIndex: 2,
        type: node.type,
      });
      if (node.showEdge !== false) {
        //  We do not show edges for two nodes and Graph Text
        (node.to || []).forEach((toNodeId, index) => {
          graphEdges.push({
            source: node.id,
            target: toNodeId,
            zIndex: 1,
            shape:
              node.toType === PLACEHOLDER_NODE &&
              node.placeholderToIndex === index
                ? CUSTOM_EDGE_DASHED
                : edgeType,
            defaultLabel: {
              markup: Markup.getForeignObjectMarkup(),
              attrs: {
                fo: {
                  width: 120,
                  height: 30,
                  x: index === 0 ? -50 : -80 + index * 20,
                },
              },
            },
            label: {
              position: {
                distance: 100 * (index + 1),
                offset: 2,
              },
              text: (node.props || {}).isMultiPath ? `Path ${index + 1}` : '',
            },
          });
        });
      }
    });
    setGraphData({
      nodes: graphNodesData,
      edges: graphEdges,
    });
  }, [graphNodes]);

  // Pass nodes and Edges data to graph
  const layout = () => {
    if (graphData.nodes.length) {
      const model = dagreLayoutRef.current.layout({
        nodes: graphData.nodes,
        edges: graphData.edges,
      });
      graphRef.current.fromJSON(model);
    }
  };

  // Set the vertices to edges so that, edges shows with 90 degree angel
  const setEdgeVertices = () => {
    if (!graphRef.current) return; // Do nothing if graph is not initialized yet
    let sourcePosition = null;
    const edges = graphRef.current.getEdges();
    edges.forEach((edge) => {
      const source = edge.getSourceNode() || {};
      const target = edge.getTargetNode() || {};
      if (source.getBBox && target.getBBox) {
        const sourceBBox = source.getBBox();
        const targetBBox = target.getBBox();

        const sourceNode = graphNodes.find((node) => node.id === source.id);
        if (sourceNode.type === ENTRY_TRIGGER) {
          if (!sourcePosition) {
            sourcePosition = {
              x: sourceBBox.topRight.x,
              y: targetBBox.center.y,
            };
            edge.setSource({
              x: sourceBBox.topRight.x,
              y: targetBBox.center.y,
            });
          } else {
            const gap =
              GRAPH_DIRECTION === 'LR'
                ? targetBBox.x - sourceBBox.x - sourceBBox.width
                : -sourceBBox.x + targetBBox.x + targetBBox.width;
            const fix = GRAPH_DIRECTION === 'LR' ? sourceBBox.width : 0;
            const x = sourceBBox.x + fix + gap / 4;
            edge.setSource({
              x,
              y: sourcePosition.y,
            });
          }
        }

        /* Logic to show the edges with 90 degree angle instead of straight edge lines,
        logic taken from ant v x6 examples: https://x6.antv.vision/en/examples/showcase/practices#orgchart
        */
        if (sourceNode.type !== ENTRY_TRIGGER) {
          if (
            (GRAPH_DIRECTION === 'LR' || GRAPH_DIRECTION === 'RL') &&
            sourceBBox.y !== targetBBox.y
          ) {
            const fix = GRAPH_DIRECTION === 'LR' ? sourceBBox.width : 0;
            const x = sourceBBox.x + fix / 2;
            edge.setVertices([
              // { x, y: sourceBBox.center.y },
              { x, y: targetBBox.center.y },
            ]);
          } else if (
            (GRAPH_DIRECTION === 'TB' || GRAPH_DIRECTION === 'BT') &&
            sourceBBox.x !== targetBBox.x
          ) {
            const gap =
              GRAPH_DIRECTION === 'TB'
                ? targetBBox.y - sourceBBox.y - sourceBBox.height
                : -sourceBBox.y + targetBBox.y + targetBBox.height;
            const fix = GRAPH_DIRECTION === 'TB' ? sourceBBox.height : 0;
            const y = sourceBBox.y + fix + gap / 2;
            edge.setVertices([
              // { x: sourceBBox.center.x, y },
              { x: targetBBox.center.x, y },
            ]);
          } else {
            edge.setVertices([]);
          }
        } else if (
          (GRAPH_DIRECTION === 'LR' || GRAPH_DIRECTION === 'RL') &&
          sourceBBox.y !== targetBBox.y
        ) {
          const gap =
            GRAPH_DIRECTION === 'LR'
              ? targetBBox.x - sourceBBox.x - sourceBBox.width
              : -sourceBBox.x + targetBBox.x + targetBBox.width;
          const fix = GRAPH_DIRECTION === 'LR' ? sourceBBox.width : 0;
          const x = sourceBBox.x + fix + gap / 4;
          edge.setVertices([
            { x, y: sourceBBox.center.y },
            { x, y: targetBBox.center.y },
          ]);
        } else if (
          (GRAPH_DIRECTION === 'TB' || GRAPH_DIRECTION === 'BT') &&
          sourceBBox.x !== targetBBox.x
        ) {
          const gap =
            GRAPH_DIRECTION === 'TB'
              ? targetBBox.y - sourceBBox.y - sourceBBox.height
              : -sourceBBox.y + targetBBox.y + targetBBox.height;
          const fix = GRAPH_DIRECTION === 'TB' ? sourceBBox.height : 0;
          const y = sourceBBox.y + fix + gap / 2;
          edge.setVertices([
            { x: sourceBBox.center.x, y },
            { x: targetBBox.center.x, y },
          ]);
        } else {
          edge.setVertices([]);
        }
      }
    });
  };

  // Position of Empty Graph Text to be placed manually based on the requirement
  const positionNodesManually = () => {
    const entryTrigger = graphNodes.find((node) => node.type === ENTRY_TRIGGER);
    const emptyGraphTextNode = graphNodes.find(
      (node) => node.type === EMPTY_GRAPH_TEXT
    );
    const placeholderNode = graphNodes.find(
      (node) => node.type === PLACEHOLDER_NODE
    ); // First placeholder node where we need to show text

    const entryTriggerNode = graphRef.current.getCell(entryTrigger.id);
    const emptyGraphText =
      emptyGraphTextNode && graphRef.current.getCell(emptyGraphTextNode.id);
    const nextNode =
      placeholderNode && graphRef.current.getCell(placeholderNode.id);

    if (entryTriggerNode) {
      const entryTriggerBBox = entryTriggerNode.getBBox().bottomLeft;
      const entryTriggerTopBBox = entryTriggerNode.getBBox().topLeft;
      entryTriggerNode.position(
        entryTriggerTopBBox.x,
        entryTriggerTopBBox.y - 16
      );
    }

    if (emptyGraphText && nextNode) {
      const node2BBox = nextNode.getBBox().bottomLeft;
      emptyGraphText.position(node2BBox.x, node2BBox.y + 16);
    }
  };

  const getEdges = useCallback(() => {
    const edges = graphRef.current.getEdges();
    edgesData.current = [];
    edges.forEach((edge) => {
      const { x, y, width, height } = edge.getBBox();
      let boundClient = null;
      if (graphRef.current.zoom() !== 1) {
        const domEdge = document
          .querySelector(`g[data-cell-id="${edge.id}"`)
          .getBoundingClientRect();
        boundClient = {
          start: {
            x: domEdge.x,
            y: domEdge.y,
          },
          end: {
            x: domEdge.x + domEdge.width,
            y: domEdge.y + domEdge.height,
          },
        };
      }
      edgesData.current.push({
        sourceId: (edge.getSourceNode() || {}).id,
        targetId: (edge.getTargetNode() || {}).id,
        start: { x, y },
        end: { x: x + width, y: y + height },
        vertices: edge.vertices,
        boundClient,
      });
    });
  }, [graphRef.current?.scale]);

  useEffect(() => {
    registerEdges();
    initializeGraphAndLayout();
    prepareGraphNodeEdges();
    graphContainerPositionStart.current = document
      .querySelector('.eng-graph-builder .x6-graph-scroller')
      .getBoundingClientRect().x;
  }, []);

  useEffect(() => {
    prepareGraphNodeEdges();
  }, [graphNodes]);

  useEffect(() => {
    layout();
    setEdgeVertices();
    getEdges();
    positionNodesManually();
  }, [graphData]);

  const onDrop = useCallback(
    (item) => {
      const newNodeId = nanoid(10);
      let endNode;
      previouslyFoundEdge.current = -1;
      if (item.isMultiPath) {
        endNode = {
          from: newNodeId,
          id: nanoid(10),
          component: EngIcon,
          props: {
            ...endIconProps,
            id: newNodeId,
          },
          type: END_NODE,
        };
      }
      if (!blockNodes.length) {
        const entryTrigger = graphNodes.find(
          (node) => node.type === ENTRY_TRIGGER
        );
        const endNodeId = nanoid(10);
        const newSetNodes = [
          {
            ...entryTrigger,
            to: [newNodeId],
          },
          {
            from: entryTrigger.id,
            id: newNodeId,
            component: GraphBlockNode,
            props: {
              iconType: item.iconType,
              color: item.color,
              id: newNodeId,
              blockType: item.id,
              onClickActionIcon,
              isMultiPath: item.isMultiPath,
              nodeTitle: nodeTitleMapping[item.id],
            },
            to: endNode ? [endNodeId, endNode.id] : [endNodeId],
          },
          {
            from: newNodeId,
            id: endNodeId,
            component: EngIcon,
            props: {
              ...endIconProps,
              id: endNodeId,
            },
            type: END_NODE,
          },
        ];
        if (item.isMultiPath) {
          newSetNodes.push(endNode);
        }
        previouslyFoundEdge.current = -1;
        setGraphNodes(newSetNodes);
      } else {
        setGraphNodes((prevNodes) => {
          let nodes = cloneDeep(prevNodes);
          const placeholderNodeIndex = nodes.findIndex(
            (node) => node.type === PLACEHOLDER_NODE
          );
          if (placeholderNodeIndex !== -1) {
            const sourceId = nodes[placeholderNodeIndex].from;
            const sourceIndex = nodes.findIndex((node) => node.id === sourceId);
            let from;
            nodes = nodes.map((node) => {
              from = '';
              if (node.from === sourceId) {
                from = newNodeId;
              }
              return {
                ...node,
                from: from || node.from,
              };
            });

            let toNodes = nodes[placeholderNodeIndex].to;
            if (item.isMultiPath) {
              toNodes = [...toNodes, endNode.id];
              nodes.push(endNode);
            }
            const toNodeIndex = nodes[sourceIndex].to.findIndex(
              (nodeId) => nodeId === nodes[placeholderNodeIndex].id
            );

            nodes.splice(placeholderNodeIndex, 1, {
              id: newNodeId,
              component: GraphBlockNode,
              props: {
                iconType: item.iconType,
                color: item.color,
                id: newNodeId,
                blockType: item.id,
                onClickActionIcon,
                isMultiPath: item.isMultiPath,
                nodeTitle: nodeTitleMapping[item.id],
              },
              to: toNodes,
              from: nodes[sourceIndex].id,
            });
            nodes[sourceIndex] = {
              ...nodes[sourceIndex],
              toType: undefined,
              placeholderToIndex: undefined,
            };
            if (toNodeIndex !== -1) {
              nodes[sourceIndex].to[toNodeIndex] = newNodeId;
            }
          }
          return nodes;
        });
        previouslyFoundEdge.current = -1;
      }
      onDropNewNode({ blockId: newNodeId, blockType: item.id });
    },
    [graphNodes]
  );

  const [, drop] = useDrop({
    accept: 'draggableNode',
    drop: (item) => {
      onDrop(item);
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
    hover: debounce((item, monitor) => {
      const draggingItemPosition = monitor.getClientOffset();

      if (draggingItemPosition && blockNodes.length) {
        let dragPosition = {
          x: draggingItemPosition.x,
          y: draggingItemPosition.y,
        };
        const isZoomed = graphRef.current.zoom() !== 1;
        // const isZoomed = false;
        if (!isZoomed) {
          dragPosition = {
            x:
              draggingItemPosition.x - graphContainerPositionStart.current - 10,
            y: draggingItemPosition.y - 34,
          };
        }
        const scrollPosition = isZoomed
          ? { left: 0, top: 0 }
          : graphRef.current.getScrollbarPosition();
        const foundEdgeIndex = edgesData.current.findIndex((edgeD) => {
          const pos = isZoomed ? edgeD.boundClient : edgeD;
          if (edgeD.vertices.length) {
            return (
              dragPosition.x > edgeD.vertices[0].x - scrollPosition.left &&
              dragPosition.y > edgeD.vertices[0].y - 40 - scrollPosition.top &&
              dragPosition.x < edgeD.end.x - scrollPosition.left &&
              dragPosition.y < edgeD.end.y + 40 - scrollPosition.top
            );
          }
          return (
            dragPosition.x > pos.start.x - scrollPosition.left &&
            dragPosition.y > pos.start.y - 40 - scrollPosition.top &&
            dragPosition.x < pos.end.x - scrollPosition.left &&
            dragPosition.y < pos.end.y + 40 - scrollPosition.top
          );
        });
        if (
          foundEdgeIndex !== -1 &&
          previouslyFoundEdge.current !== foundEdgeIndex
        ) {
          const nodes = cloneDeep(graphNodes);
          const { sourceId, targetId } = edgesData.current[foundEdgeIndex];
          const targetIndex = nodes.findIndex((node) => node.id === targetId);
          const sourceIndex =
            sourceId === undefined
              ? 0
              : nodes.findIndex((node) => node.id === sourceId);
          const sourceNode = nodes[sourceIndex];
          const targetNode = nodes[targetIndex];
          if (
            sourceNode?.type === PLACEHOLDER_NODE ||
            targetNode?.type === PLACEHOLDER_NODE ||
            !targetNode ||
            !sourceNode
          )
            return;
          const sourceChildrens = nodes[sourceIndex].to || [];
          const toIndex = sourceChildrens.findIndex(
            (nodeId) => nodeId === targetId
          );
          const id = nanoid(10);
          nodes.splice(targetIndex, 0, {
            from: sourceNode.id,
            id,
            component: EngBorderedBox,
            to: [targetNode.id],
            type: PLACEHOLDER_NODE,
          });
          nodes[sourceIndex] = {
            ...nodes[sourceIndex],
            toType: PLACEHOLDER_NODE,
            placeholderToIndex: toIndex,
          };
          if (toIndex !== -1) {
            nodes[sourceIndex].to[toIndex] = id;
          }
          previouslyFoundEdge.current = foundEdgeIndex;
          let secondaryPlaceholderId = null;
          nodes.forEach((node) => {
            if (node.type === PLACEHOLDER_NODE && node.id !== id)
              secondaryPlaceholderId = node.id;
          });
          const updatedNodes = secondaryPlaceholderId
            ? deleteNode(nodes, secondaryPlaceholderId)
            : nodes;
          setGraphNodes(updatedNodes);
        }
      }
    }),
  });

  const deleteNode = (nodesParam, blockId) => {
    let nodes = cloneDeep(nodesParam);
    const foundNode = nodes.find((node) => node.id === blockId);
    const sourceNode = nodes.findIndex((node) => node.id === foundNode.from);
    let from;
    nodes = nodes.map((node) => {
      from = '';
      if (node.from === foundNode.id) {
        from = nodes[sourceNode].id;
      }
      if (foundNode.to && foundNode.to.slice(1).includes(node.id)) {
        return null;
      }
      return {
        ...node,
        from: from || node.from,
      };
    });
    const toIndex =
      nodes[sourceNode].to &&
      nodes[sourceNode].to.findIndex((nodeId) => nodeId === foundNode.id);
    nodes[sourceNode].to[toIndex] = foundNode.to && foundNode.to[0];
    nodes[sourceNode].toType = undefined;
    const a = nodes.filter((node) => node && node.id !== blockId);
    return a;
  };

  const deleteNodeHandler = useCallback((blockId) => {
    setGraphNodes((prevNodes) => {
      const nodes = deleteNode(prevNodes, blockId);
      return nodes;
    });
  }, []);

  const onClickActionIcon = useCallback(({ blockId, actionType }) => {
    if (actionType === DELETE) {
      deleteNodeHandler(blockId);
    } else if (actionType === SETTINGS) {
      onClickConfigure(blockId);
    }
  }, []);

  return (
    <Row className='eng-graph-builder' style={{ height: '100vh' }}>
      <EngDndGraphSidebar {...sidebarProps} isNodeDraggable />
      <div
        id={dndGraphId}
        ref={drop}
        className='eng-graph-builder-element'
        style={{
          height: '100%',
          width: '100%',
          display: 'inline-block',
          overflow: 'auto',
        }}
      />
    </Row>
  );
};

EngDndGraph.defaultProps = {
  nodeTitleMapping: {},
};

export default EngDndGraph;
