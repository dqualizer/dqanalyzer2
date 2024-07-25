import type { SymbolicDoubleValue } from "../symbolic/SymbolicDoubleValue";
import type { SymbolicIntValue } from "../symbolic/SymbolicIntValue";
import type { SymbolicValue } from "../symbolic/SymbolicValue";
import type { LoadProfile } from "./LoadProfile";

export interface LoadPeak extends LoadProfile {
  base_load?: SymbolicValue | SymbolicIntValue | SymbolicDoubleValue;
  peak_load?: SymbolicValue | SymbolicIntValue | SymbolicDoubleValue;
  duration?: SymbolicValue | SymbolicIntValue | SymbolicDoubleValue;
  type: "peak";
}
