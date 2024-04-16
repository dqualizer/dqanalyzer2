import { DSTElement } from "./DSTElement";
import { WorkObjectType } from "./WorkObjectType";

export interface WorkObject extends DSTElement {
    type: WorkObjectType;
}