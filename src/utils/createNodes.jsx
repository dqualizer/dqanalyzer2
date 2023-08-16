import { getNodePositionWithOrigin, useReactFlow } from "reactflow";

let systemNodes = [];
let workObjectNodes = [];

export const createActors = (actors) => {
  let actorNodes = [];
  const type = "iconNode";
  // Icon from the Icon-Set of Egon.io
  const icon = "Person";

  // Position is later set by dagre.js
  let position = {
    x: 0,
    y: 0,
  };

  console.log(actors.length);

  // Get all actors from the mapping
  actors.forEach((actor) => {
    // Create Node with target-handle
    const newNode = {
      id: `actor_${actor.actor_name}`,
      type,
      position: {
        ...position,
      },
      data: {
        label: `${actor.actor_name}`,
        icon: icon,
        handlePosition: "right",
        handleType: "target",
      },
    };
    actorNodes.push(newNode);
  });
  console.log(actorNodes);
  return actorNodes;
};

// Getting Systems
export const createSystems = (systems) => {
  systemNodes = [];
  const type = "iconNode";
  const icon = "System";
  let position = {
    x: 200,
    y: 0,
  };

  systems.forEach((system) => {
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
  });

  return systemNodes;
};

// Getting Workobjects of Activitys
export const createWorkobjects = (systems) => {
  workObjectNodes = [];
  const type = "iconNode";
  const icon = "Document";

  systems.forEach((mappingSystem) => {
    let position = {
      x: 100,
      y: -100,
    };
    mappingSystem.activities.forEach((activity) => {
      const newNode = {
        id: `work_object_${activity.id}`,
        type,
        position: {
          ...position,
        },
        data: {
          label: `${activity.workObject}`,
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
  });
  return workObjectNodes;
};
