import { Scenario } from "./Scenario";

export interface Payload {
	name?: string | null;
	scenarios?: Scenario[] | null;
}