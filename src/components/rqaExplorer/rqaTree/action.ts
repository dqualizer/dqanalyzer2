"use server";

import type { RuntimeQualityAnalysisDefinition } from "@/types/rqa/definition/RuntimeQualityAnalysisDefinition";

const backendUrl = new URL(
	"/translate",
	`http://${process.env.DQTRANSLATOR_HOST}` || "http://localhost:8080",
);

export const startRQA = async (rqa: RuntimeQualityAnalysisDefinition) => {
	console.log(backendUrl);
	const res = await fetch(`${backendUrl}/${rqa.id}`);
	const data = await res.json();

	console.log(data);
};
