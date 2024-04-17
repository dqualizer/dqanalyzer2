import { HandleProps, Node, NodeProps, Position } from "reactflow";
import { Actor } from "../types/dam/domainstory/Actor";
import { WorkObject } from "../types/dam/domainstory/WorkObject";
import { NodeData } from "../nodes/IconNode";
import { Activity } from "../types/dam/domainstory/Activity";
import { WorkObjectType } from "../types/dam/domainstory/WorkObjectType";

export const createActorNodes = (actors: Actor[], activities: Activity[]) => {
  return actors.map((actor) => {
    // Create Node with target-handle
    const node: Node = {
      id: actor._id || "", // TODO make _id a required property
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
  activities: Activity[]
): NodeData | undefined => {
  const isActorInitiator = !!activities.find((activity) =>
    activity.initiators.find((initiator) => initiator === actor._id)
  );
  const isActorTarget = !!activities.find((activity) =>
    activity.targets.find((target) => target === actor._id)
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

  switch (actor._class) {
    case "io.github.dqualizer.dqlang.types.dam.domainstory.Person": {
      return {
        id: actor._id!,
        label: actor.name!,
        icon: WorkObjectType.PERSON, // Icon from the Icon-Set of Egon.io
        /* left_handle: leftHandle,
        right_handle: rightHandle, */
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
    case "io.github.dqualizer.dqlang.types.dam.domainstory.System": {
      return {
        id: actor._id!,
        label: actor.name!,
        icon: WorkObjectType.SYSTEM, // Icon from the Icon-Set of Egon.io
        /* left_handle: leftHandle,
        right_handle: rightHandle, */
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
    default: {
      return;
    }
  }
};

export const createWorkObjects = (workObjects: WorkObject[]) => {
  return workObjects.map((workObject) => {
    const workObjectData: NodeData = {
      id: workObject._id!,
      label: workObject.name!,
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
      id: workObject._id || "", // TODO make _id a required property
      type: "iconNode",
      position: {
        x: 100,
        y: -100,
      }, // Position is later set by dagre.js
      data: workObjectData,
    };
    return node;
  });
};
