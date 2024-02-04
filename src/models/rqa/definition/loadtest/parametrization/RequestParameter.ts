import { Scenario } from "./Scenario";

export interface RequestParameter {
	name?: string | null;
	scenarios?: Scenario[] | null;
}