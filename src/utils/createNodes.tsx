import { Node } from "reactflow";
import { Actor } from "../types/dam/domainstory/Actor";
import { WorkObject } from "../types/dam/domainstory/WorkObject";

export const createActorNodes = (actors: Actor[]) => {
  return actors.map((actor) => {
    // Create Node with target-handle
    const node: Node = {
      id: actor._id || "", // TODO make _id a required property
      type: "iconNode",
      position: {
        x: 0,
        y: 0,
      }, // Position is later set by dagre.js
      data: getActorNodeData(actor),
    };
    return node;
  });
};

const getActorNodeData = (actor: Actor) => {
  switch (actor._class) {
    case "io.github.dqualizer.dqlang.types.dam.domainstory.Person": {
      return {
        label: actor.name,
        icon: "Person", // Icon from the Icon-Set of Egon.io
        handlePosition: "right",
        handleType: "target",
      };
    }
    case "io.github.dqualizer.dqlang.types.dam.domainstory.System": {
      return {
        label: actor.name,
        icon: "System", // Icon from the Icon-Set of Egon.io
        handlePosition: "left",
        handleType: "source",
      };
    }
    default: {
      return {};
    }
  }
};

export const createWorkObjects = (workObjects: WorkObject[]) => {
  return workObjects.map((workObject) => {
    const node: Node = {
      id: workObject._id || "", // TODO make _id a required property
      type: "iconNode",
      position: {
        x: 100,
        y: -100,
      }, // Position is later set by dagre.js
      data: {
        label: workObject.name,
        icon: "Document",
        handleType: "target",
        handlePosition: "right",
        secondHandleType: "source",
        secondHandlePosition: "left",
      },
    };
    return node;
  });
};
