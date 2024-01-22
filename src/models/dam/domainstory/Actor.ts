import { DSTElement } from "./DSTElement";

export interface Actor extends DSTElement {
}

export interface Person extends Actor {
    personName: string;
}

export interface System extends Actor {
    systemName: string;
}

export interface Group extends Actor {
    groupName: string;
}