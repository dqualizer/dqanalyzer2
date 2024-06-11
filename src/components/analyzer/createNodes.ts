import type { NodeData } from "@/components/nodes/IconNode";
import type { Activity } from "@/types/dam/domainstory/Activity";
import type { Actor, Person, System } from "@/types/dam/domainstory/Actor";
import type { WorkObject } from "@/types/dam/domainstory/WorkObject";
import { WorkObjectType } from "@/types/dam/domainstory/WorkObjectType";
import { Position, type HandleProps, type Node } from "reactflow";

export const createActorNodes = (actors: Actor[], activities: Activity[]) => {
	return actors.map((actor) => {
		// Create Node with target-handle
		const node: Node = {
			id: actor.id,
			type: "iconNode",
			position: {
				x: 0,
				y: 0,
			}, // Position is later set by dagre.js
			data: getActorNodeData(actor, activities),
		};
		return node;
	});
};

const getActorNodeData = (
	actor: Actor,
	activities: Activity[],
): NodeData | undefined => {
	const isActorInitiator = !!activities.find((activity) =>
		activity.initiators.find((initiator) => initiator === actor.id),
	);
	const isActorTarget = !!activities.find((activity) =>
		activity.targets.find((target) => target === actor.id),
	);

	let rightHandle: HandleProps | undefined = undefined;
	if (isActorInitiator) {
		rightHandle = {
			position: Position.Right,
			type: "source",
		};
	}

	let leftHandle: HandleProps | undefined = undefined;
	if (isActorInitiator) {
		leftHandle = {
			position: Position.Left,
			type: "target",
		};
	}

	if (actor["@type"] === WorkObjectType.PERSON) {
		const person: Person = {
			id: actor.id,
			personName: actor.name,
			name: actor.name,
			"@type": actor["@type"],
		};
		return {
			id: person.id,
			label: person.personName,
			icon: WorkObjectType.PERSON,
			left_handle: {
				position: Position.Right,
				type: "target",
			},
			right_handle: {
				position: Position.Right,
				type: "source",
			},
		};
	}
	if (actor["@type"] === WorkObjectType.SYSTEM) {
		const system: System = {
			id: actor.id,
			systemName: actor.name,
			name: actor.name,
			"@type": actor["@type"],
		};
		return {
			id: actor.id,
			label: system.systemName,
			icon: WorkObjectType.SYSTEM,
			left_handle: {
				position: Position.Left,
				type: "target",
			},
			right_handle: {
				position: Position.Left,
				type: "source",
			},
		};
	}
	return;
};

export const createWorkObjects = (workObjects: WorkObject[]) => {
	return workObjects.map((workObject) => {
		const workObjectData: NodeData = {
			id: workObject.id,
			label: workObject.name,
			icon: workObject.type,
			left_handle: {
				position: Position.Right,
				type: "target",
			},
			right_handle: {
				position: Position.Left,
				type: "source",
			},
		};

		const node: Node = {
			id: workObject.id,
			type: "iconNode",
			position: {
				x: 100,
				y: -100,
			},
			data: workObjectData,
		};
		return node;
	});
};

export const createSystems = (systems: System[]) => {
	const systemNodes: Node[] = [];
	const type = "iconNode";
	const icon = "System";
	const position = {
		x: 200,
		y: 0,
	};

	for (const system of systems) {
		const newNode = {
			id: `system_${system.id}`,
			type,
			position: {
				...position,
			},
			data: {
				label: `${system.name}`,
				icon: icon,
				handlePosition: "left",
				handleType: "source",
			},
		};
		systemNodes.push(newNode);
		position.y += 200;
	}

	return systemNodes;
};
