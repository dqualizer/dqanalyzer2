import type { LoadTestDefinition } from "@/types/rqa/definition/loadtest/LoadTestDefinition";
import type { ResilienceTestDefinition } from "@/types/rqa/definition/resiliencetest/ResilienceTestDefinition";

export interface RuntimeQualityAnalysis {
  load_test_definition: LoadTestDefinition[];
  // monitoringDefinition: Set<MonitoringDefinition>;
  resilience_definition: ResilienceTestDefinition[];
}
