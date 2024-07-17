"use server";

import type { RuntimeQualityAnalysisDefinition } from "@/types/rqa/definition/RuntimeQualityAnalysisDefinition";

const backendUrl = new URL(
	"/translate",
	`http://${process.env.DQTRANSLATOR_HOST}` || "http://localhost:8080",
);

export const startRQA = async (rqa: RuntimeQualityAnalysisDefinition) => {
	const res = await fetch(`${backendUrl}/${rqa.id}`, {
		method: "POST",
		body: JSON.stringify(rqa),
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (!res.ok) {
		throw new Error("Failed to start RQA");
	}
};
