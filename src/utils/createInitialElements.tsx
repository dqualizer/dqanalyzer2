import { createWorkObjects, createActorNodes } from "./createNodes";
import { createActivityEdges } from "./createEdges";
import { DomainStory } from "../types/dam/domainstory/DomainStory";
import { Edge, Node } from "reactflow";

export const createInitialElements = (
  domainStory: DomainStory
): [Node[], Edge[]] => {
  const actorNodes = createActorNodes(
    domainStory.actors,
    domainStory.activities
  );
  const workObjectNodes = createWorkObjects(domainStory.work_objects);
  const initialNodes: Node[] = [...actorNodes, ...workObjectNodes];
  const initialEgdes: Edge[] = createActivityEdges(domainStory.activities);

  return [initialNodes, initialEgdes];
};
