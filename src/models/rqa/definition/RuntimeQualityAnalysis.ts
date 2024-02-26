import { LoadTestDefinition } from "./loadtest/LoadTestDefinition";
import { ResilienceTestDefinition } from "./resiliencetest/ResilienceTestDefinition";

export interface RuntimeQualityAnalysis {
	loadTestDefinition: LoadTestDefinition[];
	// monitoringDefinition: Set<MonitoringDefinition>;
	resilienceDefinition: ResilienceTestDefinition[];
}