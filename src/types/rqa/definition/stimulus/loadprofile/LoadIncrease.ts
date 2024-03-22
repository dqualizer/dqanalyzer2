import { SymbolicValue } from "../symbolic/SymbolicValue";
import { LoadProfile } from "./LoadProfile";

export interface LoadIncrease extends LoadProfile {
	base_load?: SymbolicValue | null;
	highest_load?: SymbolicValue | null;
	time_to_highest_load?: SymbolicValue | null;
	constant_duration?: SymbolicValue | null;
	type: 'increase';
}