"use client";

import { useDqContext } from "@/app/providers/DqContext";
import { useSelectedEdgeContext } from "@/app/providers/SelectedEdge";
import Sidebar from "@/components/Sidebar";
import IconNode from "@/components/nodes/IconNode";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";
import { createInitialElements, getLayoutedElements } from "./createGraph";

const nodeTypes = { iconNode: IconNode };

export default function Graph() {
  const { domainstory } = useDqContext();

  const [initialNodes, initialEgdes] = createInitialElements(domainstory);
  const [layoutedNodes, layoutedEdges] = getLayoutedElements(
    initialNodes,
    initialEgdes,
  );

  const [nodes, , onNodesChange] = useNodesState(layoutedNodes);
  const [edges, , onEdgesChange] = useEdgesState(layoutedEdges);

  const [, setSelectedEdge] = useSelectedEdgeContext();

  return (
    <>
      <ReactFlow
        className="flex-1"
        fitView
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgeClick={(_, edge) => setSelectedEdge(edge)}
        nodeTypes={nodeTypes}
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
      <Sidebar />
    </>
  );
}
