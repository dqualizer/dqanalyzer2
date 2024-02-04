import { LoadTestDefinition } from "./loadtest/LoadTestDefinition";

export interface RuntimeQualityAnalysis {
	loadTestDefinition: LoadTestDefinition[];
	// monitoringDefinition: Set<MonitoringDefinition>;
	// resilienceDefinition: Set<ResilienceDefinition>;
}