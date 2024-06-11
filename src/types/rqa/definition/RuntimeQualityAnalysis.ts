import type { LoadTestDefinition } from "@/types/rqa/definition/loadtest/LoadTestDefinition";
import type { ResilienceTestDefinition } from "@/types/rqa/definition/resiliencetest/ResilienceTestDefinition";

export interface RuntimeQualityAnalysis {
	loadTestDefinition: LoadTestDefinition[];
	// monitoringDefinition: Set<MonitoringDefinition>;
	resilienceDefinition: ResilienceTestDefinition[];
}
