// import Sidebar from "@/components/Sidebar";
// import IconNode from "@/nodes/IconNode";
// import { getAllRqas } from "@/queries/rqa";
// import { createInitialElements } from "@/utils/createInitialElements";
// import { getLayoutedElements } from "@/utils/layoutElements";
// import { useRef } from "react";
// import {
// 	Background,
// 	Controls,
// 	ReactFlow,
// 	ReactFlowProvider,
// 	useEdgesState,
// 	useNodesState,
// 	type Edge,
// 	type Node,
// 	type NodeTypes,
// } from "reactflow";
// import "reactflow/dist/style.css";

// import type { DomainStory } from "@/types/dam/domainstory/DomainStory";
// import { fetchDomainStory } from "./fetchDomainStory";

// // Add the custom node-type IconNode
// const nodeTypes: NodeTypes = { iconNode: IconNode };

// export default async function Analyzer({
// 	params,
// }: { params: { domainstory_id: string } }) {
// 	const domainstory: DomainStory = await fetchDomainStory({
// 		params: { damId: params.domainstory_id },
// 	});

// 	const rqas = await getAllRqas();

// 	// create the initial nodes and edges from the mapping
// 	const [initialNodes, initialEgdes]: [Node[], Edge[]] =
// 		createInitialElements(domainstory);

// 	// Use dagre.js to layout the elements, to render a nice graph
// 	const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
// 		initialNodes,
// 		initialEgdes,
// 	);

// 	// Create the node- and edge-states
// 	const reactFlowWrapper = useRef(null);
// 	const [nodes, , onNodesChange] = useNodesState(layoutedNodes);
// 	const [edges, , onEdgesChange] = useEdgesState(layoutedEdges);

// 	return (
// 		<div className="root" style={{ height: "100%" }}>
// 			<ReactFlowProvider>
// 				<div className="reactflow-wrapper" ref={reactFlowWrapper}>
// 					<ReactFlow
// 						fitView
// 						nodes={nodes}
// 						edges={edges}
// 						onNodesChange={onNodesChange}
// 						onEdgesChange={onEdgesChange}
// 						nodeTypes={nodeTypes}
// 					>
// 						<Background />
// 						<Controls />
// 					</ReactFlow>
// 				</div>
// 				{/* <DomainStoryGraph edges={edges} nodes={nodes}></DomainStoryGraph> */}
// 				<Sidebar
// 					nodes={nodes}
// 					edges={edges}
// 					domainstory={domainstory}
// 					rqas={rqas}
// 				/>
// 			</ReactFlowProvider>
// 		</div>
// 	);
// }

import Graph from "@/components/analyzer/graph";
import "reactflow/dist/style.css";
import { readDamByDomainStoryId } from "./dam";
import { readDomainstoryById } from "./domainStoryQueries";
import { readAllRqas } from "./rqaQueries";

export default async function Analyzer({
	params,
}: { params: { domainstory_id: string } }) {
	const domainstory = await readDomainstoryById(params.domainstory_id);
	const rqas = await readAllRqas();
	const dam = await readDamByDomainStoryId(domainstory.id);

	return <Graph domainstory={domainstory} rqas={rqas} dam={dam} />;
}
