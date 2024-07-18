import type { SymbolicValue } from "./SymbolicValue";

export interface SymbolicIntValue extends SymbolicValue {
	type: 'integer';
	name: string;
	value?: number | null;
}