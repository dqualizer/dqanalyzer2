import { WorkloadType } from "./WorkloadType";
import { ConstantLoad } from "./loadprofile/ConstantLoad";
import { LoadIncrease } from "./loadprofile/LoadIncrease";
import { LoadPeak } from "./loadprofile/LoadPeak";

export interface Workload {
	type?: WorkloadType | null;
	load_profile?: ConstantLoad | LoadIncrease | LoadPeak | null;
}
