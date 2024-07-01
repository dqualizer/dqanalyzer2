"use server";

import type { CreateLoadTestDefinitionDTO } from "@/types/rqa/definition/loadtest/LoadTestDefinition";

const backendUrl = new URL(
	"/api/v2/rqa",
	`http://${process.env.DQAPI_HOST}` || "http://localhost:8099",
);

export const updateRqaLoadTest = async (
	rqa_id: string,
	loadtest: CreateLoadTestDefinitionDTO,
) => {
	const res = await fetch(`${backendUrl}/${rqa_id}/loadtest`, {
		method: "PATCH",
		body: JSON.stringify(loadtest),
		headers: {
			"Content-Type": "application/json",
		},
	});

	console.debug(res);

	const data = await res.json();

	console.log(data);
};
