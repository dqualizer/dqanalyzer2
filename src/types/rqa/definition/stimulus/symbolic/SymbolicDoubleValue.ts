import type { SymbolicValue } from "./SymbolicValue";

export interface SymbolicDoubleValue extends SymbolicValue {
	type: 'double';
	name: string;
	value?: number | null;
}