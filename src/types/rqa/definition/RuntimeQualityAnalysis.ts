import { ResilienceTestDefinition } from "../../../models/rqa/definition/resiliencetest/ResilienceTestDefinition";
import { LoadTestDefinition } from "./loadtest/LoadTestDefinition";

export interface RuntimeQualityAnalysis {
  loadTestDefinition: LoadTestDefinition[];
  // monitoringDefinition: Set<MonitoringDefinition>;
  resilienceDefinition: ResilienceTestDefinition[];
}
