import { DomainStory } from "../models/dam/domainstory/DomainStory";
import { WorkObjectType } from "../models/dam/domainstory/WorkObjectType";

export const domainstory: DomainStory = {
    actors: [
        {
            name: "Kulian",
            _class: "io.github.dqualizer.dqlang.types.dam.domainstory.Person",
            _id: "S3VsaWFuCg=="
        },
        {
            name: "Workshop-Manager",
            _class: "io.github.dqualizer.dqlang.types.dam.domainstory.System",
            _id: "V29ya3Nob3AtTWFuYWdlcgo="
        },
    ],
    work_objects: [
        {
            _id: "1",
            name: "Order",
            type: WorkObjectType.DOCUMENT,
        },
        {
            _id: "2",
            name: "Orderstatus",
            type: WorkObjectType.DOCUMENT
        }
    ],
    activities: [
        {
            action: "reads",
            initiators: ["S3VsaWFuCg=="],
            number: 1,
            targets: ["V29ya3Nob3AtTWFuYWdlcgo="],
            workObjects: ["Order"]
        },
        {
            action: "creates",
            initiators: ["S3VsaWFuCg=="],
            number: 2,
            targets: ["V29ya3Nob3AtTWFuYWdlcgo="],
            workObjects: ["Order"]
        },
        {
            action: "updates",
            initiators: ["S3VsaWFuCg=="],
            number: 3,
            targets: ["V29ya3Nob3AtTWFuYWdlcgo="],
            workObjects: ["Orderstatus"]
        }

    ]

}