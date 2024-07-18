import { WORKOBJECT, GROUP, ACTOR, CONNECTION, ACTIVITY } from './elementTypes';

'use strict';

let elementRegistry;
let initCorrected = false;

export function wasInitialized() {
  return initCorrected;
}

export function initElementRegistry(registry) {
  initCorrected = false;
  elementRegistry = registry._elements;
}

// since the elementRegistry from BPMN does a lazy initialize, where it only gets the desired children, once an Object has been added via import or by the user.
// once the desired children are present, we correct the referenced Object to the one we actually want.
export function correctElementRegitryInit() {
  if (!initCorrected) {
    if (elementRegistry.__implicitrootbase) {
      elementRegistry = elementRegistry.__implicitrootbase.element.children;
      initCorrected = true;
    }
  }
}

export function getAllActivities() {
  const activities = [];

  getAllCanvasObjects().forEach(element => {
    if (element.type.includes(ACTIVITY)) {
      activities.push(element);
    }
  });

  return activities;
}

export function getAllConnections() {
  const connections = [];
  getAllCanvasObjects().forEach(element => {
    const type = element.type;
    if (type == CONNECTION) {
      connections.push(element);
    }
  });
  return connections;
}

export function getAllActors() {
  const actors = [];
  getAllCanvasObjects().forEach(element => {
    const type = element.type;
    if (type == ACTOR) {
      actors.push(element);
    }
  });
  return actors;
}

export function getAllWorkObjects() {
  const workObjects = [];
  getAllCanvasObjects().forEach(element => {
    const type = element.type;
    if (type.includes(WORKOBJECT)) {
      workObjects.push(element);
    }
  });
  return workObjects;
}

export function getAllCanvasObjects() {
  const allObjects=[];
  const groupObjects=[];

  // check for every child of the canvas wether it is a group or not
  let i=0;
  for (i = 0; i < elementRegistry.length; i++) {
    const type = elementRegistry[i].type;
    if (type.includes(GROUP)) {

      // if it is a group, memorize this for later
      groupObjects.push(elementRegistry[i]);
    }
    else {
      allObjects.push(elementRegistry[i]);
    }
  }

  // for each memorized group, remove it from the group-array and check its chidren, wether they are roups or not
  // if a child is a group, memorize it in the goup-array
  // else add the child to the return-array
  i = groupObjects.length - 1;
  while (groupObjects.length >= 1) {
    const currentGroup = groupObjects.pop();
    currentGroup.children.forEach(child => {
      const type = child.type;
      if (type.includes(GROUP)) {
        groupObjects.push(child);
      }
      else {
        allObjects.push(child);
      }
    });
    i = groupObjects.length - 1;
  }
  return allObjects;
}

// returns all groups on the canvas and inside other groups
export function getAllGroups() {
  const groupObjects=[];
  const allObjects=[];

  // check for every child of the canvas wether it is a group or not
  let i=0;
  for (i = 0; i < elementRegistry.length; i++) {
    const type = elementRegistry[i].type;
    if (type.includes(GROUP)) {

      // if it is a group, memorize this for later
      groupObjects.push(elementRegistry[i]);
    }
    else {
      allObjects.push(elementRegistry[i]);
    }
  }
  for (i=0; i<groupObjects.length;i++) {
    const currentgroup=groupObjects[i];
    currentgroup.children.forEach(child => {
      if (child.type.includes(GROUP)) {
        groupObjects.push(child);
      }
    });
  }
  return groupObjects;
}

// get a list of activities, that originate from an actor-type
export function getActivitesFromActors() {
  const activiesFromActors = [];
  const activities = getAllActivities();

  activities.forEach(activity => {
    if (activity.source.type.includes(ACTOR)) {
      activiesFromActors.push(activity);
    }
  });
  return activiesFromActors;
}

export function getElementRegistry() {
  return elementRegistry;
}

export function setElementregistry(stub) {
  elementRegistry = stub;
}