import { graphlib, layout } from "@dagrejs/dagre";
import { Position, type Edge, type Node } from "reactflow";

import type { DomainStory } from "@/types/dam/domainstory/DomainStory";
import { createActivityEdges } from "./createEdges";
import { createActorNodes, createWorkObjects } from "./createNodes";

const dagreGraph = new graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

export const createInitialElements = (
	domainStory: DomainStory,
): [Node[], Edge[]] => {
	const actorNodes = createActorNodes(
		domainStory.actors,
		domainStory.activities,
	);

	const workObjectNodes = createWorkObjects(domainStory.work_objects);
	const initialNodes: Node[] = [...actorNodes, ...workObjectNodes];
	const initialEgdes: Edge[] = createActivityEdges(domainStory.activities);

	return [initialNodes, initialEgdes];
};

export const getLayoutedElements = (
	nodes: Node[],
	edges: Edge[],
	direction = "RL",
): [Node[], Edge[]] => {
	const isHorizontal = direction === "RL";
	dagreGraph.setGraph({ rankdir: direction });

	for (const node of nodes) {
		dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
	}

	for (const edge of edges) {
		dagreGraph.setEdge(edge.source, edge.target);
	}

	layout(dagreGraph);

	for (const node of nodes) {
		const nodeWithPosition = dagreGraph.node(node.id);

		node.targetPosition = isHorizontal ? Position.Left : Position.Top;
		node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;

		// We are shifting the dagre node position (anchor=center center) to the top left
		// so it matches the React Flow node anchor point (top left).
		node.position = {
			x: nodeWithPosition.x - nodeWidth / 2,
			y: nodeWithPosition.y - nodeHeight / 2,
		};
	}

	return [nodes, edges];
};
