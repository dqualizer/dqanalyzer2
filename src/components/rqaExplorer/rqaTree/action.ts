"use server";

import type { RuntimeQualityAnalysisDefinition } from "@/types/rqa/definition/RuntimeQualityAnalysisDefinition";

const backendUrl = new URL(
  "/translate",
  `http://${process.env.DQTRANSLATOR_HOST}` || "http://localhost:8080"
);

export const startRQA = async (rqa: RuntimeQualityAnalysisDefinition) => {
  console.log(rqa.runtime_quality_analysis.monitoring_definition);
  const res = await fetch(`${backendUrl}/${rqa.id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("Failed to start RQA");
  }
};
