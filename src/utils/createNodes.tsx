import { Node, getNodePositionWithOrigin, useReactFlow } from "reactflow";
import { Actor, Person, System } from "../models/dam/domainstory/Actor";
import { WorkObject } from "../models/dam/domainstory/WorkObject";

let systemNodes: Node[] = [];
let workObjectNodes: Node[] = [];

export const createPersonNodes = (persons: Person[]) => {
  let personNodes: Node[] = [];
  const type = "iconNode";
  // Icon from the Icon-Set of Egon.io
  const icon = "Person";

  // Position is later set by dagre.js
  let position = {
    x: 0,
    y: 0,
  };

  // Get all actors from the mapping
  persons.forEach((person) => {
    // Create Node with target-handle
    const newNode = {
      id: `actor_${person._id}`,
      type,
      position: {
        ...position,
      },
      data: {
        label: `${person.name}`,
        icon: icon,
        handlePosition: "right",
        handleType: "target",
      },
    };
    personNodes.push(newNode);
  });
  console.log(personNodes);
  return personNodes;
};

// Getting Systems
export const createSystemNodes = (systems: System[]) => {
  systemNodes = [];
  const type = "iconNode";
  const icon = "System";
  let position = {
    x: 200,
    y: 0,
  };

  systems.forEach((system) => {
    const newNode = {
      id: `system_${system._id}`,
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
  });

  return systemNodes;
};

// Getting Workobjects of Activitys
export const createWorkobjects = (workObjects: WorkObject[]) => {
  workObjectNodes = [];
  const type = "iconNode";
  const icon = "Document";

  workObjects.forEach((workObject) => {
    let position = {
      x: 100,
      y: -100,
    };
    const newNode = {
      id: `work_object_${workObject._id}`,
      type,
      position: {
        ...position,
      },
      data: {
        label: `${workObject.name}`,
        icon: icon,
        handlePosition: "right",
        handleType: "target",
        secondHandleType: "source",
        secondHandlePosition: "left",
      },
    };
    workObjectNodes.push(newNode);
    position.y += 200;
  });
  return workObjectNodes;
};
