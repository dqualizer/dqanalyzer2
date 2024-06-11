import type { Identifiable } from "@/types/Identifiable";
import type { WorkObjectType } from "./WorkObjectType";

export interface DSTElement extends Identifiable {
	name: string;
	"@type": WorkObjectType;
}
