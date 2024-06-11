"use client";

import Sidebar from "@/components/Sidebar";
import IconNode from "@/components/nodes/IconNode";
import type { DomainArchitectureMapping } from "@/types/dam/dam";
import type { DomainStory } from "@/types/dam/domainstory/DomainStory";
import type { RuntimeQualityAnalysisDefinition } from "@/types/rqa/definition/RuntimeQualityAnalysisDefinition";
import { useQuery } from "@tanstack/react-query";
import { useRef } from "react";
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

// Add the custom node-type IconNode
const nodeTypes = { iconNode: IconNode };

export default function Graph({
	domainstory,
	rqas,
	dam,
}: {
	domainstory: DomainStory;
	rqas: RuntimeQualityAnalysisDefinition[];
	dam: DomainArchitectureMapping;
}) {
	const [initialNodes, initialEgdes] = createInitialElements(domainstory);
	const [layoutedNodes, layoutedEdges] = getLayoutedElements(
		initialNodes,
		initialEgdes,
	);

	const reactFlowWrapper = useRef(null);
	const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
	const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

	const rqaQuery = useQuery({
		queryKey: ["rqas"],
		initialData: rqas,
	});

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
			<Sidebar
				nodes={nodes}
				edges={edges}
				domainstory={domainstory}
				rqas={rqaQuery.data || []}
				dam={dam}
			/>
		</>
	);
}
