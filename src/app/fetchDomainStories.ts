import type { DomainStory } from "@/types/dam/domainstory/DomainStory";

const backendUrl = new URL(
	"/api/v2/domain-story",
	`http://${process.env.DQAPI_HOST}` || "http://localhost:8099",
);

export const readAllDomainStoryIds = async () => {
	const res = await fetch(`${backendUrl}/ids`, { cache: "no-store" });
	const data: string[] = await res.json();

	return data;
};

export const readDomainstoryById = async (id: string) => {
	const res = await fetch(`${backendUrl}/${id}`);
	const data: DomainStory = await res.json();

	return data;
};

export const createDomainstory = async (domainstory: DomainStory) => {
	const res = await fetch(`${backendUrl}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(domainstory),
	});

	const data: DomainStory = await res.json();
	return data;
};
