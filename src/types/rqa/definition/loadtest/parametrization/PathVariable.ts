import type { Scenario } from "./Scenario";

export interface PathVariable {
  name?: string | null;
  scenarios?: Scenario[] | null;
}
