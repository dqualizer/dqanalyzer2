import type { DomainStory } from "@/types/dam/domainstory/DomainStory";

const backendUrl = new URL(
	"/api/v2/domain-story",
	`http://${process.env.DQAPI_HOST}` || "http://localhost:8099",
);

export const readDomainstoryById = async (id: string) => {
	console.debug(`${backendUrl}/${id}`);
	const res = await fetch(`${backendUrl}/${id}`);
	const data: DomainStory = await res.json();
	return data;
};
