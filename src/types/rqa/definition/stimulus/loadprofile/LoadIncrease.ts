import type { SymbolicValue } from "../symbolic/SymbolicValue";
import type { LoadProfile } from "./LoadProfile";

export interface LoadIncrease extends LoadProfile {
  base_load?: SymbolicValue;
  highest_load?: SymbolicValue;
  time_to_highest_load?: SymbolicValue;
  constant_duration?: SymbolicValue;
  type: "increase";
}
