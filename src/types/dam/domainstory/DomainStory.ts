import type { Identifiable } from "@/types/Identifiable";
import type { Activity } from "./Activity";
import type { Actor } from "./Actor";
import type { WorkObject } from "./WorkObject";

export interface DomainStory extends Identifiable {
	actors: Actor[];
	work_objects: WorkObject[];
	activities: Activity[];
}
