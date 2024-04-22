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
        const edge = createEdge(source, target, activity.action, activity._id);
        edges.push(edge);
      }
      if (index + 1 === activity.workObjects.length) {
        source = activity.targets[0];
        target = workObject;
        const edge = createEdge(source, target, "to", activity._id);
        edges.push(edge);
      } else {
        source = activity.workObjects[index + 1];
        target = workObject;
        const edge = createEdge(source, target, "for", activity._id);
        edges.push(edge);
      }
    });
  });
  return edges;
};

const createEdge = (
  source: string,
  target: string,
  label: string,
  activityId?: string
) => {
  const edge: Edge = {
    id: `edge_${source}_${target}_${label}_${activityId}`, // TODO make _id a required property
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
