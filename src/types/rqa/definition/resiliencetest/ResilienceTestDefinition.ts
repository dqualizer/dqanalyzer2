import type { Artifact } from "../loadtest/Artifact";
import type { ResilienceResponseMeasures } from "./ResilienceResponseMeasures";
import type { ResilienceStimulus } from "./stimulus/ResilienceStimulus";
import type { UnavailabilityStimulus } from "./stimulus/UnavailabilityStimulus";

export interface ResilienceTestDefinition {
	name: string;
	artifact: Artifact;
	description: string;
	stimulus: ResilienceStimulus | UnavailabilityStimulus;
	response_measure: ResilienceResponseMeasures;
}

export interface CreateResilienceTestDefinitionDTO {
	name: string;
	artifact: Artifact;
	description: string;
	stimulus: ResilienceStimulus | UnavailabilityStimulus;
	response_measure: ResilienceResponseMeasures;
}
