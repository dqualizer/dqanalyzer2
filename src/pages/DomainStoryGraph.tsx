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
import IconNode from "../nodes/IconNode";
import { useRef } from "react";

interface DomainStoryGraphProps {
  nodes: Node[];
  edges: Edge[];
}

export function DomainStoryGraph({ nodes, edges }: DomainStoryGraphProps) {
  const nodeTypes: NodeTypes = { iconNode: IconNode };
  const reactFlowWrapper = useRef(null);

  return (
    <div className="reactflow-wrapper" ref={reactFlowWrapper}>
      <ReactFlow fitView nodes={nodes} edges={edges} nodeTypes={nodeTypes}>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
