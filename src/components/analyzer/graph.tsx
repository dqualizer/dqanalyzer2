"use client";

import { DqContext } from "@/app/providers/DqContext";
import Sidebar from "@/components/Sidebar";
import IconNode from "@/components/nodes/IconNode";
import { useContext, useRef } from "react";
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
	const { domainstory } = useContext(DqContext);

	const [initialNodes, initialEgdes] = createInitialElements(domainstory);
	const [layoutedNodes, layoutedEdges] = getLayoutedElements(
		initialNodes,
		initialEgdes,
	);

	const reactFlowWrapper = useRef(null);
	const [nodes, , onNodesChange] = useNodesState(layoutedNodes);
	const [edges, , onEdgesChange] = useEdgesState(layoutedEdges);

	return (
		<>
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
					<MiniMap />
				</ReactFlow>
			</div>
			<Sidebar nodes={nodes} edges={edges} />
		</>
	);
}
