import type { ResilienceStimulus } from "./ResilienceStimulus";

export interface UnavailabilityStimulus extends ResilienceStimulus {
	type: 'UNAVAILABILITY';
}