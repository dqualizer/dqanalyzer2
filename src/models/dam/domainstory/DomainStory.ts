import { Activity } from "./Activity";
import { Actor } from "./Actor";
import { WorkObject } from "./WorkObject";

export interface DomainStory {
    actors: Actor[];
    work_objects: WorkObject[];
    activities: Activity[];
}
