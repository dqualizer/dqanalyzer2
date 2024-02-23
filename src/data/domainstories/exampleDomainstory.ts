import { DomainStory } from "../../types/dam/domainstory/DomainStory";
import { WorkObjectType } from "../../types/dam/domainstory/WorkObjectType";

export const exampleDomainstory: DomainStory = {
  _id: "1",
  actors: [
    {
      _id: "V29ya3Nob3AtTWFuYWdlcgo=",
      _class: "io.github.dqualizer.dqlang.types.dam.domainstory.System",
      name: "Workshop-Manager",
    },
    {
      _id: "S3VsaWFuCg==",
      _class: "io.github.dqualizer.dqlang.types.dam.domainstory.Person",
      name: "Kulian",
    },
  ],
  work_objects: [
    {
      _id: "T3JkZXIK_1",
      name: "Order",
      type: WorkObjectType.DOCUMENT,
    },
    {
      _id: "T3JkZXIK_2",
      name: "Order",
      type: WorkObjectType.DOCUMENT,
    },
    {
      _id: "T3JkZXJTdGF0dXMK",
      name: "OrderStatus",
      type: WorkObjectType.DOCUMENT,
    },
  ],
  activities: [
    {
      _id: "cmVhZHMK",
      action: "reads",
      initiators: ["S3VsaWFuCg=="],
      number: 1,
      targets: ["V29ya3Nob3AtTWFuYWdlcgo="],
      workObjects: ["T3JkZXIK_1"],
    },
    {
      _id: "Y3JlYXRlcwo=",
      action: "creates",
      initiators: ["S3VsaWFuCg=="],
      number: 2,
      targets: ["V29ya3Nob3AtTWFuYWdlcgo="],
      workObjects: ["T3JkZXIK_2"],
    },
    {
      _id: "dXBkYXRlcwo=",
      action: "updates",
      initiators: ["S3VsaWFuCg=="],
      number: 3,
      targets: ["V29ya3Nob3AtTWFuYWdlcgo="],
      workObjects: ["T3JkZXJTdGF0dXMK"],
    },
  ],
};
