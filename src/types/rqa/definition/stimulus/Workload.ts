import type { WorkloadType } from "./WorkloadType";
import type { ConstantLoad } from "./loadprofile/ConstantLoad";
import type { LoadIncrease } from "./loadprofile/LoadIncrease";
import type { LoadPeak } from "./loadprofile/LoadPeak";

export interface Workload {
  type?: WorkloadType;
  load_profile?: ConstantLoad | LoadIncrease | LoadPeak;
}
