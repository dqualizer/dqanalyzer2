import type { DomainArchitectureMapping } from "@/types/dam/dam";

const backendUrl = new URL(
	"/api/v2/dam",
	`http://${process.env.DQAPI_HOST}` || "http://localhost:8099",
);

export const readDamByDomainStoryId = async (id: string) => {
	console.debug(`${backendUrl}/domain-story/${id}`);
	const res = await fetch(`${backendUrl}/domain-story/${id}`);
	const data: DomainArchitectureMapping = await res.json();

	return data;
};
