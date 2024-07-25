import { graphlib, layout } from "@dagrejs/dagre";
import type { Edge, Node } from "reactflow";

const dagreGraph = new graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 172;
const nodeHeight = 36;

export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  direction = "RL",
) => {
  const isHorizontal = direction === "RL";
  const g = new graphlib.Graph();

  // Set an object for the graph label
  g.setGraph({});

  // Default to assigning a new object as a label for each new edge.
  // biome-ignore lint/complexity/useArrowFunction: <explanation>
  g.setDefaultEdgeLabel(function () {
    return {};
  });

  // g.setGraph({ rankdir: direction });

  // for (const node of nodes) {
  // 	g.setNode(node.id, {
  // 		label: node.id,
  // 		width: nodeWidth,
  // 		height: nodeHeight,
  // 	});
  // }

  g.setNode("kspacey", { label: "Kevin Spacey", width: 144, height: 100 });
  g.setNode("swilliams", { label: "Saul Williams", width: 160, height: 100 });
  g.setNode("bpitt", { label: "Brad Pitt", width: 108, height: 100 });
  g.setNode("hford", { label: "Harrison Ford", width: 168, height: 100 });
  g.setNode("lwilson", { label: "Luke Wilson", width: 144, height: 100 });
  g.setNode("kbacon", { label: "Kevin Bacon", width: 121, height: 100 });

  // Add edges to the graph.
  g.setEdge("kspacey", "swilliams");
  g.setEdge("swilliams", "kbacon");
  g.setEdge("bpitt", "kbacon");
  g.setEdge("hford", "lwilson");
  g.setEdge("lwilson", "kbacon");

  // for (const edge of edges) {
  // 	g.setEdge(edge.source, edge.target);
  // }

  layout(g);

  // for (const node of nodes) {
  // 	const nodeWithPosition = g.node(node.id);

  // 	/*
  // 	TODO check if required
  // 	node.targetPosition = isHorizontal ? 'left' : 'top';
  // 	node.sourcePosition = isHorizontal ? 'right' : 'bottom';
  // 	*/

  // 	// We are shifting the dagre node position (anchor=center center) to the top left
  // 	// so it matches the React Flow node anchor point (top left).
  // 	node.position = {
  // 		x: nodeWithPosition.x - nodeWidth / 2,
  // 		y: nodeWithPosition.y - nodeHeight / 2,
  // 	};
  // }

  return { nodes, edges };
};
