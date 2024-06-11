import type { Environment } from "@/types/rqa/definition/enums/Environment";
import type { LoadTestDefinition } from "@/types/rqa/definition/loadtest/LoadTestDefinition";
import type { ResilienceTestDefinition } from "@/types/rqa/definition/resiliencetest/ResilienceTestDefinition";

export type CreateRqa = {
	name: string;
	domain_id: string;
	environment: Environment;
	context: string;
	rqa: {
		loadTestDefinition: LoadTestDefinition[];
		resilienceDefinition: ResilienceTestDefinition[];
		monitoringDefinition: [];
	};
};
