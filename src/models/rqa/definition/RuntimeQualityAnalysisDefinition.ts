import { Identifiable } from "../../Identifiable";
import { RuntimeQualityAnalysis } from "./RuntimeQualityAnalysis";
import { Environment } from "./enums/Environment";

export interface RuntimeQualityAnalysisDefinition extends Identifiable {
	name: string;
	version: string;
	domain_id: string;
	context: string;
	environment: Environment;
	runtime_quality_analysis: RuntimeQualityAnalysis;
}
