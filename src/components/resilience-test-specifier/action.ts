"use server";

import type { CreateResilienceTestDto } from "@/types/dtos/CreateResilienceTestDto";
import type { RuntimeQualityAnalysisDefinition } from "@/types/rqa/definition/RuntimeQualityAnalysisDefinition";
import { revalidateTag } from "next/cache";

const backendUrl = new URL(
  "/api/v2/rqa",
  `http://${process.env.DQAPI_HOST}` || "http://localhost:8099",
);

export const updateRqaResilience = async (
  rqaId: string,
  resilienceTest: CreateResilienceTestDto,
) => {
  const res = await fetch(`${backendUrl}/${rqaId}/resilience-test`, {
    method: "PATCH",
    body: JSON.stringify(resilienceTest),
    headers: {
      "Content-Type": "application/json",
    },
  });

  revalidateTag("rqas");

  const data: RuntimeQualityAnalysisDefinition = await res.json();
  return data;
};
