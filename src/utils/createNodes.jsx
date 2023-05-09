import { getNodePositionWithOrigin, useReactFlow } from 'reactflow';
import * as mapping from '../werkstatt.json';

let actorNodes = [];
let systemNodes = [];
let workObjectNodes = [];

export const createActors = () => {
    actorNodes = [];
    const type = "iconNode";
    const icon = "Person";
    let position = {
        x: 0,
        y: 0

    }
    mapping.actors.forEach((actor) => {
        const newNode = {
            id: `actor_${actor.actor_id}`,
            type,
            position: {
                ...position
            },
            data: { label: `${actor.actor_name}`, icon: icon, handlePosition: "right", handleType: "target" }
        }
        actorNodes.push(newNode);
        position.y += 200;
    });

    return actorNodes;
}

export const createSystems = () => {
    systemNodes = [];
    const type = "iconNode";
    const icon = "System";
    let position = {
        x: 200,
        y: 0
    }

    mapping.systems.forEach((system) => {
        const newNode = {
            id: `system_${system.system_id}`,
            type,
            position: {
                ...position
            },
            data: { label: `${system.name}`, icon: icon, handlePosition: "left", handleType: "source" }
        }
        systemNodes.push(newNode);
        position.y += 200;
    })

    return systemNodes;
}

export const createWorkobjects = (flowInstance) => {
    workObjectNodes = [];
    const type = "iconNode";
    const icon = "Document";

    mapping.systems.forEach((mappingSystem) => {
        const numberActivities = mappingSystem.activities.length;
        const positionCorrespondingSystemNode = systemNodes.find((system) => system.system_id == mappingSystem.system_id);

        let position = {
            x: 100,
            y: -100
        }
        mappingSystem.activities.forEach((activity) => {
            const newNode = {
                id: `work_object_${activity.activity_id}`,
                type,
                position: {
                    ...position
                },
                data: { label: `${activity.workObject}`, icon: icon, handlePosition: "right", handleType: "target", secondHandleType: "source", secondHandlePosition: "left" }
            }
            workObjectNodes.push(newNode);
            position.y += 200;
        });
    });
    return workObjectNodes
}