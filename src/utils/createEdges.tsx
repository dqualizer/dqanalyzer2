import { MarkerType } from "reactflow";
import { DomainStory } from "../models/dam/domainstory/DomainStory";

export const createSystemWorkobjectEdges = (domain: DomainStory) => {
  let serviceWorkObjectEdges = [];
  domainstory.ac.forEach((system) => {
    system.activities.forEach((activity) => {
      const newEdge = {
        id: `system_work_object_${activity.id}`,
        mappingId: activity.id,
        source: `system_${system.id}`,
        system: system.system_id,
        activity: activity.id,
        type: "smoothstep",
        target: `work_object_${activity.id}`,
        name: activity.name,
        parametrization: {
          path_variables: activity.endpoint.path_variables,
          payload: activity.endpoint.payload,
          request_parameter: activity.endpoint.request_parameter,
          url_parameter: activity.endpoint.url_parameter,
        },
        markerStart: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
        },
        selected: false,
        label: "in",
      };
      serviceWorkObjectEdges.push(newEdge);
    });
  });
  return serviceWorkObjectEdges;
};

export const createWorkobjectActorEdges = (domain) => {
  let workObjectActorEdges = [];
  domain.systems.forEach((system) => {
    system.activities.forEach((activity) => {
      const newEdge = {
        id: `work_object_actor_${activity.id}`,
        mappingId: activity.id,
        name: activity.name,
        parametrization: {
          path_variables: activity.endpoint.path_variables,
          url_parameter: activity.endpoint.url_parameter,
          payload: activity.endpoint.payload,
          request_parameters: activity.endpoint.request_parameter,
        },
        source: `work_object_${activity.id}`,
        target: `actor_${activity.initiator}`,
        system: system.id,
        type: "smoothstep",
        label: activity.action,
        selected: false,
        markerStart: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
        },
      };
      workObjectActorEdges.push(newEdge);
    });
  });
  return workObjectActorEdges;
};
