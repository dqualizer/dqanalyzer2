import { createActors, createSystems, createWorkobjects } from "./createNodes";
import { createSystemWorkobjectEdges, createWorkobjectActorEdges } from "./createEdges";

export function createInitialElements(domain) {

    let initialNodes = [];
    let initialEgdes = [];

    let actorNodes = createActors(domain.actors);
    let systemNodes = createSystems(domain.systems);
    let workObjectNodes = createWorkobjects(domain.systems);

    let systemWorkObjectEdges = createSystemWorkobjectEdges(domain)
    let workObjectActorEdges = createWorkobjectActorEdges(domain);

    // Create the initial elements array which is sent to layouting function
    initialNodes = initialNodes.concat(systemNodes, actorNodes, workObjectNodes);
    initialEgdes = initialEgdes.concat(systemWorkObjectEdges, workObjectActorEdges);

    return [initialNodes, initialEgdes]
}