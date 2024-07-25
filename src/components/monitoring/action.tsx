"use server";

import type { RuntimeQualityAnalysisDefinition } from "@/types/rqa/definition/RuntimeQualityAnalysisDefinition";
import type { MonitoringDefinition } from "@/types/rqa/definition/monitoring/MonitoringDefinition";

const backendUrl = new URL(
  "/api/v2/rqa",
  `http://${process.env.DQAPI_HOST}` || "http://localhost:8099",
);

export const updateRqaMonitoring = async (
  rqa_id: string,
  monitoringDefinition: MonitoringDefinition,
) => {
  const res = await fetch(`${backendUrl}/${rqa_id}/monitoring`, {
    method: "PATCH",
    body: JSON.stringify(monitoringDefinition),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data: RuntimeQualityAnalysisDefinition = await res.json();
  return data;
};
