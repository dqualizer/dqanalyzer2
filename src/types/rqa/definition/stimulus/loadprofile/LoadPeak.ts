import { SymbolicDoubleValue } from "../symbolic/SymbolicDoubleValue";
import { SymbolicIntValue } from "../symbolic/SymbolicIntValue";
import { SymbolicValue } from "../symbolic/SymbolicValue";
import { LoadProfile } from "./LoadProfile"

export interface LoadPeak extends LoadProfile {
	base_load?: SymbolicValue | SymbolicIntValue | SymbolicDoubleValue | null;
	peak_load?: SymbolicValue | SymbolicIntValue | SymbolicDoubleValue | null;
	duration?: SymbolicValue | SymbolicIntValue | SymbolicDoubleValue | null;
	type: 'peak';
}