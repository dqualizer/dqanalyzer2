import type { Workload } from "./Workload";

export interface Stimulus {
  workload?: Workload;
  accuracy?: number;
}
