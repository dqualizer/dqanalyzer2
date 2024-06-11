import type { SymbolicValue } from "../symbolic/SymbolicValue";
import type { LoadProfile } from "./LoadProfile";

export interface ConstantLoad extends LoadProfile {
	base_load?: SymbolicValue;
	target_load?: SymbolicValue;
	duration?: SymbolicValue;
	type: "constant";
}
