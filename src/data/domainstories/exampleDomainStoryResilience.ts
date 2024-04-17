import { DomainStory } from "../../types/dam/domainstory/DomainStory";
import { WorkObjectType } from "../../types/dam/domainstory/WorkObjectType";

export const exampleDomainStoryResilience: DomainStory = {
  actors: [
    {
      _id: "customer",
      _class: "io.github.dqualizer.dqlang.types.dam.domainstory.Person",
      name: "Customer",
    },
    {
      _id: "comparisonPortal",
      _class: "io.github.dqualizer.dqlang.types.dam.domainstory.System",
      name: "Comparison Portal",
    },
    {
      _id: "leasingNinja",
      _class: "io.github.dqualizer.dqlang.types.dam.domainstory.System",
      name: "LeasingNinja",
    },
    {
      _id: "riskApi",
      _class: "io.github.dqualizer.dqlang.types.dam.domainstory.System",
      name: "RiskApi",
    },
    {
      _id: "leasingCompetitionX",
      _class: "io.github.dqualizer.dqlang.types.dam.domainstory.System",
      name: "Leasing Competition X",
    },
    {
      _id: "leasingCompetitionY",
      _class: "io.github.dqualizer.dqlang.types.dam.domainstory.System",
      name: "Leasing Competition Y",
    },
  ],
  work_objects: [
    {
      _id: "car",
      name: "Car",
      type: WorkObjectType.CAR,
    },
    {
      _id: "contractRequest",
      name: "Contract Request",
      type: WorkObjectType.MESSAGE,
    },
    {
      _id: "contractOffer",
      name: "Contract Offer",
      type: WorkObjectType.DOCUMENT,
    },
    {
      _id: "installment",
      name: "Installment",
      type: WorkObjectType.EURO,
    },
    {
      _id: "contractOffer2",
      name: "Contract Offer",
      type: WorkObjectType.DOCUMENT,
    },
    {
      _id: "creditRating",
      name: "Credit Rating",
      type: WorkObjectType.SHIELD,
    },
    {
      _id: "resaleValue",
      name: "Resale Value",
      type: WorkObjectType.HAMMER,
    },
    {
      _id: "voteResult",
      name: "Vote Result",
      type: WorkObjectType.RATING,
    },
    {
      _id: "contractOffer3",
      name: "Contract Offer",
      type: WorkObjectType.DOCUMENT,
    },
    {
      _id: "contractOffer4",
      name: "Contract Offer",
      type: WorkObjectType.DOCUMENT,
    },
    {
      _id: "contractOffer5",
      name: "Contract Offer",
      type: WorkObjectType.DOCUMENT,
    },
    {
      _id: "contractOffer6",
      name: "Contract Offer",
      type: WorkObjectType.DOCUMENT,
    },
    {
      _id: "contract",
      name: "Contract",
      type: WorkObjectType.DOCUMENT,
    },
  ],
  activities: [
    {
      _id: "c_1",
      action: "tells wish for",
      initiators: ["customer"],
      number: 1,
      targets: ["comparisonPortal"],
      workObjects: ["car"],
    },
    {
      _id: "c_2",
      action: "sends",
      initiators: ["comparisonPortal"],
      number: 2,
      targets: ["leasingNinja"],
      workObjects: ["contractRequest"],
    },
    {
      _id: "c_3",
      action: "creates",
      initiators: ["leasingNinja"],
      number: 3,
      targets: [],
      workObjects: ["contractOffer"],
    },
    {
      _id: "c_4",
      action: "calculates",
      initiators: ["leasingNinja"],
      number: 4,
      targets: [],
      workObjects: ["installment", "contractOffer2"],
    },
    {
      _id: "c_5",
      action: "checks",
      initiators: ["riskApi"],
      number: 5,
      targets: [],
      workObjects: ["creditRating"],
    },
    {
      _id: "c_6",
      action: "calculates",
      initiators: ["riskApi"],
      number: 6,
      targets: [],
      workObjects: ["resaleValue"],
    },
    {
      _id: "c_7",
      action: "calculates",
      initiators: ["riskApi"],
      number: 7,
      targets: ["leasingNinja"],
      workObjects: ["voteResult", "contractOffer3"],
    },
    {
      _id: "c_8",
      action: "persists",
      initiators: ["leasingNinja"],
      number: 8,
      targets: [],
      workObjects: ["contractOffer4"],
    },
    {
      _id: "c_9",
      action: "sends",
      initiators: ["leasingNinja"],
      number: 9,
      targets: ["comparisonPortal"],
      workObjects: ["contractOffer5"],
    },
    {
      _id: "c_10",
      action: "sends",
      initiators: ["comparisonPortal"],
      number: 10,
      targets: ["customer"],
      workObjects: ["contractOffer6"],
    },
    {
      _id: "c_11",
      action: "signs",
      initiators: ["customer"],
      number: 11,
      targets: ["leasingNinja"],
      workObjects: ["contract"],
    },
  ],
};

export const exampleSimpleDomainStoryResilience: DomainStory = {
  actors: [
    {
      _id: "customer",
      _class: "io.github.dqualizer.dqlang.types.dam.domainstory.Person",
      name: "Customer",
    },
    {
      _id: "comparisonPortal",
      _class: "io.github.dqualizer.dqlang.types.dam.domainstory.System",
      name: "Comparison Portal",
    },
  ],
  work_objects: [
    {
      _id: "car",
      name: "Car",
      type: WorkObjectType.DOCUMENT,
    },
    {
      _id: "contractOffer6",
      name: "Contract Offer",
      type: WorkObjectType.DOCUMENT,
    },
  ],
  activities: [
    {
      _id: "c_1",
      action: "tells wish for",
      initiators: ["customer"],
      number: 1,
      targets: ["comparisonPortal"],
      workObjects: ["car"],
    },
    {
      _id: "c_10",
      action: "sends",
      initiators: ["comparisonPortal"],
      number: 2,
      targets: ["customer"],
      workObjects: ["contractOffer6"],
    },
  ],
};

export const exampleSimpleDomainStoryResilience2: DomainStory = {
  actors: [
    {
      _id: "customer",
      _class: "io.github.dqualizer.dqlang.types.dam.domainstory.Person",
      name: "Customer",
    },
    {
      _id: "comparisonPortal",
      _class: "io.github.dqualizer.dqlang.types.dam.domainstory.System",
      name: "Comparison Portal",
    },
  ],
  work_objects: [
    {
      _id: "car",
      name: "Car",
      type: WorkObjectType.DOCUMENT,
    },
    {
      _id: "contractOffer6",
      name: "Contract Offer 1",
      type: WorkObjectType.DOCUMENT,
    },
    {
      _id: "contractOffer7",
      name: "Contract Offer 2",
      type: WorkObjectType.EURO,
    },
  ],
  activities: [
    {
      _id: "c_1",
      action: "tells wish for",
      initiators: ["customer"],
      number: 1,
      targets: ["comparisonPortal"],
      workObjects: ["car"],
    },
    {
      _id: "c_10",
      action: "sends",
      initiators: ["comparisonPortal"],
      number: 2,
      targets: ["customer"],
      workObjects: ["contractOffer6", "contractOffer7"],
    },
  ],
};
