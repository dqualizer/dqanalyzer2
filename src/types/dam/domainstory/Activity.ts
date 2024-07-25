import type { DSTElement } from "./DSTElement";

export interface Activity extends DSTElement {
  action: string;
  number: number;
  initiators: string[];
  targets: string[];
  work_objects: string[];
}
