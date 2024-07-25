"use server";

import type { CreateRqa } from "@/types/dtos/CreateRqa";
import type { RuntimeQualityAnalysis } from "@/types/rqa/definition/RuntimeQualityAnalysis";
import { revalidateTag } from "next/cache";

const backendUrl = new URL(
  "/api/v2/rqa",
  `http://${process.env.DQAPI_HOST}` || "http://localhost:8099",
);

export const createRqa = async (
  dto: CreateRqa,
): Promise<[RuntimeQualityAnalysis, string]> => {
  try {
    const res = await fetch(`${backendUrl}`, {
      method: "POST",
      body: JSON.stringify(dto),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    revalidateTag("rqas");

    return [data, res.headers.get("Location") || data.id];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
