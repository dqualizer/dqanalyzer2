import React, { useState, useRef, useCallback, useMemo } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import 'reactflow/dist/style.css'
import { Background, Controls, ReactFlow, ReactFlowProvider, useNodesState, useEdgesState, addEdge, MarkerType } from 'reactflow'
import Taskbar from './components/Taskbar'
import NamePanel from './components/NamePanel'
import Sidebar from './components/Sidebar'
import IconNode from './nodes/IconNode'
import { createActors, createSystems, createWorkobjects } from './utils/createNodes'
import dagre from 'dagre';
import { createSystemWorkobjectEdges, createWorkobjectActorEdges } from './utils/createEdges'

function App() {

  const nodeTypes = useMemo(() => ({ iconNode: IconNode }), []);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);


  let id = 0;
  const getId = () => `dndnode_${id++}`;
  let actorNodes = createActors();
  let systemNodes = createSystems();
  let workObjectNodes = createWorkobjects();
  let initialNodes = [];
  let initialEgdes = [];
  let systemWorkObjectEdges = createSystemWorkobjectEdges(systemNodes, workObjectNodes)
  let workObjectActorEdges = createWorkobjectActorEdges();
  console.log(systemWorkObjectEdges);
  initialNodes = initialNodes.concat(systemNodes, actorNodes, workObjectNodes);
  initialEgdes = initialEgdes.concat(systemWorkObjectEdges, workObjectActorEdges);

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 172;
  const nodeHeight = 36;

  const getLayoutedElements = (nodes, edges, direction = 'RL') => {
    const isHorizontal = direction === 'RL';
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
      dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    });

    edges.forEach((edge) => {
      dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    nodes.forEach((node) => {
      const nodeWithPosition = dagreGraph.node(node.id);
      node.targetPosition = isHorizontal ? 'left' : 'top';
      node.sourcePosition = isHorizontal ? 'right' : 'bottom';

      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      node.position = {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      };

      return node;
    });

    return { nodes, edges };
  };

  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    initialNodes,
    initialEgdes
  );




  // initialNodes.forEach((actor) => { console.log(actor) });



  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);


  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');
      const icon = event.dataTransfer.getData('application/json')


      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        console.log("undefined")
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node`, icon: icon },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance]
  );

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) =>
        addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)
      ),
    []
  );
  const onLayout = useCallback(
    (direction) => {
      const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
        nodes,
        edges,
        direction
      );

      setNodes([...layoutedNodes]);
      setEdges([...layoutedEdges]);
    },
    [nodes, edges]
  );
  return (
    <div className="root" style={{ height: '100%' }}>
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            fitView
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onInit={setReactFlowInstance}
            connectionLineType="straight"
            onConnect={onConnect}
            nodeTypes={nodeTypes}
          >
            {/* <Taskbar /> */}
            {/* <NamePanel /> */}
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        <Sidebar nodes={nodes} edges={edges} />
      </ReactFlowProvider >
    </div >
  )
}

export default App
