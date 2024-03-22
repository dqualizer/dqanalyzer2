import { Workload } from "./Workload";

export interface Stimulus {
	workload?: Workload | null;
	accuracy?: number | null;
}