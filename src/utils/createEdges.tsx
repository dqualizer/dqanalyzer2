import { Edge, MarkerType } from "reactflow";
import { Activity } from "../types/dam/domainstory/Activity";

export const createActivityEdges = (activities: Activity[]) => {
  const edges: Edge[] = [];
  activities.forEach((activity) => {
    activity.workObjects.forEach((workObject, index) => {
      // TODO add support for multiple workobjects in an activity
      // Source Edge
      let source;
      let target;
      if (index === 0) {
        source = workObject;
        target = activity.initiators[0];
        const edge = createEdge(source, target, activity.action);
        edges.push(edge);
      }
      if (index + 1 === activity.workObjects.length) {
        source = activity.targets[0];
        target = workObject;
        const edge = createEdge(source, target, "to");
        edges.push(edge);
      } else {
        source = activity.workObjects[index + 1];
        target = workObject;
        const edge = createEdge(source, target, "for");
        edges.push(edge);
      }

      /* const sourceEdge: Edge = {
        id: activity._id + "_source" || "", // TODO make _id a required property
        source: workObject, // TODO create edge for each initiator
        type: "smoothstep",
        target: activity.initiators[0], // TODO create edge for each target
        markerStart: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
        },
        selected: false,
        label: activity.action,
      };
      edges.push(sourceEdge);

      // Target Edge
      const targetEdge: Edge = {
        id: activity._id + "_target" || "", // TODO make _id a required property
        source: activity.targets[0], // TODO create edge for each initiator
        type: "smoothstep",
        target: workObject, // TODO create edge for each target
        markerStart: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
        },
        selected: false,
        label: "in/to",
      };
      edges.push(targetEdge); */
    });
  });
  return edges;

  /* return activities.map(activity => {
		const edge: Edge = {
			id: activity._id || '', // TODO make _id a required property
			source: activity.initiators[0], // TODO create edge for each initiator
			type: "smoothstep",
			target: activity.targets[0], // TODO create edge for each target
			markerStart: {
				type: MarkerType.ArrowClosed,
				width: 20,
				height: 20,
			},
			selected: false,
			label: activity.action,
		};
		return edge;
	}); */
};

const createEdge = (source: string, target: string, label: string) => {
  const edge: Edge = {
    id: `edge_${source}_${target}`, // TODO make _id a required property
    source,
    type: "straight",
    target,
    markerStart: {
      type: MarkerType.ArrowClosed,
      width: 20,
      height: 20,
    },
    selected: false,
    label,
  };
  return edge;
};
