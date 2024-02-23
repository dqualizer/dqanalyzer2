import { useState, useRef, useMemo } from "react";
import "reactflow/dist/style.css";
import {
  Background,
  Controls,
  ReactFlow,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  NodeTypes,
  Edge,
  Node,
} from "reactflow";
import Sidebar from "../components/Sidebar";
import IconNode from "../nodes/IconNode";
import { createInitialElements } from "../utils/createInitialElements";
import { getLayoutedElements } from "../utils/layoutElements";
import { LoaderFunctionArgs, useLoaderData, useParams } from "react-router-dom";
import { getAllRqas } from "../queries/rqa";
import {
  getDomainstoryById,
  getDomainstoryByIdMock,
} from "../queries/domainstory";

import { useQuery } from "@tanstack/react-query";
import { DomainStory } from "../types/dam/domainstory/DomainStory";

export function domainstoryLoader({ params }: LoaderFunctionArgs) {
  //Will be changed to actual getAllDomainstories
  if (!params.damId) throw new Error("No Domainstory found.");
  return getDomainstoryByIdMock(params.damId);
}

function Analyzer() {
  const domainstory: DomainStory = useLoaderData() as DomainStory;

  // create the initial nodes and edges from the mapping
  const [initialNodes, initialEgdes]: [Node[], Edge[]] =
    createInitialElements(domainstory);

  // Add the custom node-type IconNode
  const nodeTypes: NodeTypes = { iconNode: IconNode };
  const [reactFlowInstance, setReactFlowInstance] = useState(null);

  // Use dagre.js to layout the elements, to render a nice graph
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    initialNodes,
    initialEgdes
  );

  // Create the node- and edge-states
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const rqaQuery = useQuery({
    queryKey: ["rqas"],
    queryFn: getAllRqas,
  });

  return (
    <div className="root" style={{ height: "100%" }}>
      <ReactFlowProvider>
        <div className="reactflow-wrapper" ref={reactFlowWrapper}>
          <ReactFlow
            fitView
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            nodeTypes={nodeTypes}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
        <Sidebar
          nodes={nodes}
          edges={edges}
          domainstory={domainstory}
          rqas={rqaQuery.data}
        />
      </ReactFlowProvider>
    </div>
  );
}

export default Analyzer;
