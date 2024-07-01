"use server";

const backendUrl = new URL(
	"/api/v2/domain-story",
	`http://${process.env.DQAPI_HOST}` || "http://localhost:8099",
);

export const readAllDomainStoryIds = async () => {
	const res = await fetch(`${backendUrl}/ids`);
	const data: string[] = await res.json();

	return data;
};
