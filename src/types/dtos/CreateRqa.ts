import type { LoadTestDefinition } from "@/types/rqa/definition/loadtest/LoadTestDefinition";
import type { ResilienceTestDefinition } from "@/types/rqa/definition/resiliencetest/ResilienceTestDefinition";

export type CreateRqa = {
  name: string;
  domain_id: string;
  environment: string;
  context: string;
  rqa: {
    loadTestDefinition: LoadTestDefinition[];
    resilienceDefinition: ResilienceTestDefinition[];
    monitoringDefinition: [];
  };
};
