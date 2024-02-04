import { useState, useRef, useMemo } from "react";
import "reactflow/dist/style.css";
import {
	Background,
	Controls,
	ReactFlow,
	ReactFlowProvider,
	useNodesState,
	useEdgesState,
	addEdge,
	MarkerType,
} from "reactflow";
import Sidebar from "../components/Sidebar";
import IconNode from "../nodes/IconNode";
import { createInitialElements } from "../utils/createInitialElements";
import { getLayoutedElements } from "../utils/layoutElements";
import { useLoaderData, useParams } from "react-router-dom";
import { getAllRqas } from "../queries/rqa";
import { getDamById } from "../queries/dam";

import { string } from "prop-types";
import { useQuery } from "@tanstack/react-query";
import { domainstory } from "../data/exampleDomainstory";

export function damLoader({ params }) {
	return getDamById(params.damId);
}

export function offlineDomainstoryLoader({ params }) {
	return domainstory;
}

function App() {
	const dam = useLoaderData();

	// create the initial nodes and edges from the mapping
	const [initialNodes, initialEgdes] = createInitialElements(dam);

	// Add the custom node-type IconNode
	const nodeTypes = useMemo(() => ({ iconNode: IconNode }), []);
	const [reactFlowInstance, setReactFlowInstance] = useState(null);

	// Use dagre.js to layout the elements, to render a nice graph
	const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEgdes);

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
						onInit={setReactFlowInstance}
						connectionLineType="straight"
						nodeTypes={nodeTypes}
					>
						<Background />
						<Controls />
					</ReactFlow>
				</div>
				<Sidebar
					nodes={nodes}
					edges={edges}
					domain={dam}
					rqas={rqaQuery.data}
				/>
			</ReactFlowProvider>
		</div>
	);
}

export default App;
