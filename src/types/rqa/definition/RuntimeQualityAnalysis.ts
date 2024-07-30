import type { LoadTestDefinition } from "@/types/rqa/definition/loadtest/LoadTestDefinition";
import type { ResilienceTestDefinition } from "@/types/rqa/definition/resiliencetest/ResilienceTestDefinition";
import type { MonitoringDefinition } from "./monitoring/MonitoringDefinition";

export interface RuntimeQualityAnalysis {
  load_test_definition: LoadTestDefinition[];
  resilience_definition: ResilienceTestDefinition[];
  monitoring_definition: MonitoringDefinition[];
}
