import type { Identifiable } from "../../../Identifiable";
import type { ResultMetrics } from "../enums/ResultMetrics";
import type { Stimulus } from "../stimulus/Stimulus";
import type { Artifact } from "./Artifact";
import type { ResponseMeasures } from "./ResponseMeasures";
import type { Parametrization } from "./parametrization/Parametrization";

export interface LoadTestDefinition extends Identifiable {
	name?: string;
	artifact?: Artifact;
	description?: string;
	stimulus?: Stimulus;
	parametrization?: Parametrization;
	response_measure?: ResponseMeasures;
	result_metrics?: ResultMetrics[];
}
