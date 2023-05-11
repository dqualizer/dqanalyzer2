import { MarkerType } from 'reactflow';
import * as mapping from '../data/werkstatt.json';


export const createSystemWorkobjectEdges = () => {
    let serviceWorkObjectEdges = [];
    mapping.systems.forEach((system) => {
        system.activities.forEach((activity) => {
            const newEdge = {
                id: `system_work_object_${activity.activity_id}`,
                source: `system_${system.system_id}`,
                type: 'smoothstep',
                target: `work_object_${activity.activity_id}`,
                name: activity.name,
                markerStart: {
                    type: MarkerType.ArrowClosed,
                    width: 20,
                    height: 20
                },
                selected: false,
                label: "in"
            }
            serviceWorkObjectEdges.push(newEdge);
        })
    })
    return serviceWorkObjectEdges;
}

export const createWorkobjectActorEdges = () => {
    let workObjectActorEdges = [];
    mapping.systems.forEach((system) => {
        system.activities.forEach((activity) => {
            const newEdge = {
                id: `work_object_actor_${activity.activity_id}`,
                name: activity.name,
                source: `work_object_${activity.activity_id}`,
                target: `actor_${activity.initiator}`,
                type: 'smoothstep',
                label: activity.action,
                selected: false,
                markerStart: {
                    type: MarkerType.ArrowClosed,
                    width: 20,
                    height: 20
                }
            }
            workObjectActorEdges.push(newEdge);
        })
    })
    return workObjectActorEdges;
}