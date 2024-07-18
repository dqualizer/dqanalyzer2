import type { DomainArchitectureMapping } from "@/types/dam/dam";
import type { DomainStory } from "@/types/dam/domainstory/DomainStory";
import type { RuntimeQualityAnalysisDefinition } from "@/types/rqa/definition/RuntimeQualityAnalysisDefinition";
import { DomainStoryNotFoundError } from "./errors";

const backendUrl = new URL(
	"/api/v2",
	`http://${process.env.DQAPI_HOST}` || "http://localhost:8099",
);

export const readAllRqas = async (): Promise<
	RuntimeQualityAnalysisDefinition[]
> => {
	try {
		const res = await fetch(`${backendUrl}/rqa`, {
			next: { tags: ["rqas"], revalidate: 30 },
		});
		if (!res.ok) {
			throw new Error("Failed to fetch data");
		}

		return await res.json();
	} catch (error) {
		console.error("Error fetching rqas:", error);
		throw error;
	}
};

export const readDomainstoryById = async (id: string): Promise<DomainStory> => {
	try {
		const res = await fetch(`${backendUrl}/domain-story/${id}`, {
			next: { tags: ["domainstories"], revalidate: 30 },
		});

		switch (res.status) {
			case 200:
				return await res.json();
			case 404:
				throw new DomainStoryNotFoundError({ id });
			default:
				throw new Error("Unknown error");
		}
	} catch (error) {
		console.error("Error fetching domain story:", error);
		throw error;
	}
};

export const readDamByDomainStoryId = async (
	id: string,
): Promise<DomainArchitectureMapping> => {
	try {
		const res = await fetch(`${backendUrl}/dam/domain-story/${id}`);

		switch (res.status) {
			case 200:
				return await await res.json();
			case 400:
				throw new Error("Invalid domain story ID");
			case 401:
				throw new Error("Unauthorized");
			case 404:
				throw new Error("DAM not found");
			case 500:
				throw new Error("Internal server error");
			default:
				throw new Error("Unknown error");
		}
	} catch (error) {
		console.error("Error fetching DAM:", error);
		throw error;
	}
};
