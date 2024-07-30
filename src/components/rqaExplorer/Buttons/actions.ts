"use server";

import type { RuntimeQualityAnalysisDefinition } from "@/types/rqa/definition/RuntimeQualityAnalysisDefinition";
import { revalidateTag } from "next/cache";

const backendUrl = new URL(
  "/api/v2/rqa",
  `http://${process.env.DQAPI_HOST}` || "http://localhost:8099",
);

export const deleteLoadtest = async ({
  rqaId,
  loadTestId,
}: {
  rqaId: string;
  loadTestId: string;
}): Promise<RuntimeQualityAnalysisDefinition> => {
  const res = await fetch(`${backendUrl}/${rqaId}/loadtest/${loadTestId}`, {
    method: "DELETE",
  });

  revalidateTag("rqas");

  return res.json();
};

export const deleteRQA = async ({
  rqaId,
}: {
  rqaId: string;
}): Promise<RuntimeQualityAnalysisDefinition> => {
  const res = await fetch(`${backendUrl}/${rqaId}`, {
    method: "DELETE",
  });

  revalidateTag("rqas");

  return res.json();
};
