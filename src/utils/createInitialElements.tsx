import {
  createPersonNodes,
  createSystemNodes,
  createWorkobjects,
} from "./createNodes";
import {
  createSystemWorkobjectEdges,
  createWorkobjectActorEdges,
} from "./createEdges";
import { DomainStory } from "../models/dam/domainstory/DomainStory";
import { Actor, Person, System } from "../models/dam/domainstory/Actor";
import { Edge, Node } from "reactflow";

export function createInitialElements(domainstory: DomainStory) {
  let initialNodes: Node[] = [];
  let initialEgdes: Edge[] = [];

  let personNodes = getPersonNodesFromActors(domainstory.actors);
  let systemNodes = getSystemNodesFromActors(domainstory.actors);
  let workObjectNodes = createWorkobjects(domainstory.work_objects);

  //   let systemWorkObjectEdges = createSystemWorkobjectEdges(domain);
  //   let workObjectActorEdges = createWorkobjectActorEdges(domain);

  // Create the initial elements array which is sent to layouting function
  initialNodes = initialNodes.concat(systemNodes, personNodes, workObjectNodes);
  //   initialEgdes = initialEgdes.concat(
  //     systemWorkObjectEdges,
  //     workObjectActorEdges
  //   );

  return [initialNodes, initialEgdes];
}

function getPersonNodesFromActors(actors: Actor[]) {
  const persons = actors.filter(
    (actor) =>
      actor._class == "io.github.dqualizer.dqlang.types.dam.domainstory.Person"
  ) as Person[];
  return createPersonNodes(persons);
}

function getSystemNodesFromActors(actors: Actor[]) {
  const systems = actors.filter(
    (actor) =>
      actor._class == "io.github.dqualizer.dqlang.types.dam.domainstory.System"
  ) as System[];
  return createSystemNodes(systems);
}
