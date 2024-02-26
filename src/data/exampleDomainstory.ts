import { DomainStory } from "../models/dam/domainstory/DomainStory";
import { WorkObjectType } from "../models/dam/domainstory/WorkObjectType";

export const domainstory: DomainStory = {
	actors: [
		{
			_id: "V29ya3Nob3AtTWFuYWdlcgo=",
			_class: "io.github.dqualizer.dqlang.types.dam.domainstory.System",
			name: "Workshop-Manager"
		},
		{
			_id: "S3VsaWFuCg==",
			_class: "io.github.dqualizer.dqlang.types.dam.domainstory.Person",
			name: "Kulian"
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
			type: WorkObjectType.DOCUMENT
		}
	],
	activities: [
		{
			_id: "cmVhZHMK",
			action: "reads",
			initiators: ["S3VsaWFuCg=="],
			number: 1,
			targets: ["V29ya3Nob3AtTWFuYWdlcgo="],
			workObjects: ["T3JkZXIK_1"]
		},
		{
			_id: "Y3JlYXRlcwo=",
			action: "creates",
			initiators: ["S3VsaWFuCg=="],
			number: 2,
			targets: ["V29ya3Nob3AtTWFuYWdlcgo="],
			workObjects: ["T3JkZXIK_2"]
		},
		{
			_id: "dXBkYXRlcwo=",
			action: "updates",
			initiators: ["S3VsaWFuCg=="],
			number: 3,
			targets: ["V29ya3Nob3AtTWFuYWdlcgo="],
			workObjects: ["T3JkZXJTdGF0dXMK"]
		}
	]
}

export const domainstoryResilience: DomainStory = {
	actors: [
		{
			_id: "a_1",
			_class: "io.github.dqualizer.dqlang.types.dam.domainstory.Person",
			name: "Customer"
		},
		{
			_id: "a_2",
			_class: "io.github.dqualizer.dqlang.types.dam.domainstory.System",
			name: "Comparison Portal"
		},
		{
			_id: "a_3",
			_class: "io.github.dqualizer.dqlang.types.dam.domainstory.System",
			name: "Offer Calculator"
		}
	],
	work_objects: [
		{
			_id: "w_1",
			name: "Quotation Request",
			type: WorkObjectType.MESSAGE,
		},
		{
			_id: "w_2",
			name: "Quotation Request",
			type: WorkObjectType.MESSAGE
		},
		{
			_id: "w_3",
			name: "Insurance Quotation",
			type: WorkObjectType.DOCUMENT,
		},
		{
			_id: "w_4",
			name: "Insurance Quotation",
			type: WorkObjectType.DOCUMENT,
		},
		{
			_id: "w_5",
			name: "Insurance Quotation",
			type: WorkObjectType.DOCUMENT,
		}
	],
	activities: [
		{
			_id: "c_1",
			action: "sends",
			initiators: ["a_1"],
			number: 1,
			targets: ["a_2"],
			workObjects: ["w_1"]
		},
		{
			_id: "c_2",
			action: "sends",
			initiators: ["a_2"],
			number: 2,
			targets: ["a_3"],
			workObjects: ["w_2"]
		},
		{
			_id: "c_3",
			action: "calculates",
			initiators: ["a_3"],
			number: 3,
			targets: [],
			workObjects: ["w_3"]
		},
		{
			_id: "c_4",
			action: "sends",
			initiators: ["a_3"],
			number: 4,
			targets: ["a_2"],
			workObjects: ["w_4"]
		},
		{
			_id: "c_5",
			action: "sends",
			initiators: ["a_2"],
			number: 5,
			targets: ["a_1"],
			workObjects: ["w_5"]
		}
	]
}