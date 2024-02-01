import { Edge, MarkerType } from "reactflow";
import { Activity } from "../models/dam/domainstory/Activity";


export const createActivityEdges = (activities: Activity[]) => {
	const edges: Edge[] = [];
	activities.forEach(activity => {
		activity.workObjects.forEach(workObject => {
			// TODO add support for multiple workobjects in an activity
			// Source Edge
			const sourceEdge: Edge = {
				id: activity._id + '_source' || '', // TODO make _id a required property
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
				id: activity._id + '_target' || '', // TODO make _id a required property
				source: activity.targets[0], // TODO create edge for each initiator
				type: "smoothstep",
				target: workObject, // TODO create edge for each target
				markerStart: {
					type: MarkerType.ArrowClosed,
					width: 20,
					height: 20,
				},
				selected: false,
				label: 'in',
			};
			edges.push(targetEdge);
		})
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
