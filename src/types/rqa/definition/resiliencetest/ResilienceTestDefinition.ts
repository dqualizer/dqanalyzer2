import { Artifact } from "../loadtest/Artifact";
import { ResilienceResponseMeasures } from "./ResilienceResponseMeasures";
import { ResilienceStimulus } from "./stimulus/ResilienceStimulus";
import { UnavailabilityStimulus } from "./stimulus/UnavailabilityStimulus";

export interface ResilienceTestDefinition {
  name: string;
  artifact: Artifact;
  description: string;
  stimulus: ResilienceStimulus | UnavailabilityStimulus;
  response_measure: ResilienceResponseMeasures;
}
