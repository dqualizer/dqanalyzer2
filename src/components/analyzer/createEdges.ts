import type { Activity } from "@/types/dam/domainstory/Activity";
import { MarkerType, type Edge } from "reactflow";

export const createActivityEdges = (activities: Activity[]) => {
  const edges: Edge[] = [];
  for (const activity of activities) {
    for (let index = 0; index < activity.work_objects.length; index++) {
      const workObject = activity.work_objects[index];
      // TODO add support for multiple workobjects in an activity
      // Source Edge
      let source: string;
      let target: string;
      if (index === 0) {
        source = workObject;
        target = activity.initiators[0];
        const edge = createEdge(source, target, activity.action, activity.id);
        edges.push(edge);
      }
      if (index + 1 === activity.work_objects.length) {
        source = activity.targets[0];
        target = workObject;
        const edge = createEdge(source, target, "to", activity.id);
        edges.push(edge);
      } else {
        source = activity.work_objects[index + 1];
        target = workObject;
        const edge = createEdge(source, target, "for", activity.id);
        edges.push(edge);
      }
    }
  }
  return edges;
};

const createEdge = (
  source: string,
  target: string,
  label: string,
  activityId?: string,
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
