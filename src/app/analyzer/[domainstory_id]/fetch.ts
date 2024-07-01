import type { DomainArchitectureMapping } from "@/types/dam/dam";
import type { DomainStory } from "@/types/dam/domainstory/DomainStory";
import type { RuntimeQualityAnalysisDefinition } from "@/types/rqa/definition/RuntimeQualityAnalysisDefinition";

const backendUrl = new URL(
	"/api/v2",
	`http://${process.env.DQAPI_HOST}` || "http://localhost:8099",
);

export const readAllRqas = async () => {
	const res = await fetch(`${backendUrl}/rqa`, {
		next: { tags: ["rqas"], revalidate: 30 },
	});
	const data: RuntimeQualityAnalysisDefinition[] = await res.json();
	return data;
};

export const readDomainstoryById = async (id: string) => {
	const res = await fetch(`${backendUrl}/domain-story/${id}`);
	const data: DomainStory = await res.json();
	return data;
};

export const readDamByDomainStoryId = async (id: string) => {
	const res = await fetch(`${backendUrl}/dam/domain-story/${id}`);
	const data: DomainArchitectureMapping = await res.json();

	return data;
};
