import type { DSTElement } from "./DSTElement";

export interface WorkObject extends DSTElement {
	"@type": string;
	type: string;
	value_objects: string[];
}
