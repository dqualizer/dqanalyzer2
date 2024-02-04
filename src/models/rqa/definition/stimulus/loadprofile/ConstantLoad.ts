import { SymbolicValue } from "../symbolic/SymbolicValue";
import { LoadProfile } from "./LoadProfile";

export interface ConstantLoad extends LoadProfile {
	base_load?: SymbolicValue | null;
	target_load?: SymbolicValue | null;
	duration?: SymbolicValue | null;
	type: 'constant';
}