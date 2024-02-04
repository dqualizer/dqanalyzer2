import { Scenario } from "./Scenario";

export interface UrlParameter {
	name?: string | null;
	scenarios?: Scenario[] | null;
}