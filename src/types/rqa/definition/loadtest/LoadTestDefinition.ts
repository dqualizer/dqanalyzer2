import { Identifiable } from "../../../Identifiable"
import { ResultMetrics } from "../enums/ResultMetrics";
import { Stimulus } from "../stimulus/Stimulus";
import { Artifact } from "./Artifact";
import { ResponseMeasures } from "./ResponseMeasures";
import { Parametrization } from "./parametrization/Parametrization";

export interface LoadTestDefinition extends Identifiable {
	name?: string | null;
	artifact?: Artifact | null;
	description?: string | null;
	stimulus?: Stimulus | null;
	parametrization?: Parametrization | null;
	response_measure?: ResponseMeasures | null;
	result_metrics?: ResultMetrics[] | null;
}