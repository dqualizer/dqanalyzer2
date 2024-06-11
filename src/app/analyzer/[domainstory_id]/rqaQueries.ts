import type { RuntimeQualityAnalysisDefinition } from "@/types/rqa/definition/RuntimeQualityAnalysisDefinition";

const backendUrl = new URL(
	"/api/v2/rqa",
	`http://${process.env.DQAPI_HOST}` || "http://localhost:8099",
);

export const readAllRqas = async () => {
	const res = await fetch(`${backendUrl}`);
	const data: RuntimeQualityAnalysisDefinition[] = await res.json();
	return data;
};
