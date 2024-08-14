import type { DomainArchitectureMapping } from "@/types/dam/dam";
import type { DomainStory } from "@/types/dam/domainstory/DomainStory";
import type { RuntimeQualityAnalysisDefinition } from "@/types/rqa/definition/RuntimeQualityAnalysisDefinition";
import { DamNotFoundError } from "./errors";

const backendUrl = new URL(
  "/api/v2",
  `http://${process.env.DQAPI_HOST}` || "http://localhost:8099",
);

export const readAllRqas = async (): Promise<
  RuntimeQualityAnalysisDefinition[]
> => {
  try {
    const res = await fetch(`${backendUrl}/rqa`, {
      next: { tags: ["rqas"], revalidate: 30 },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching rqas:", error);
    throw error;
  }
};

export const readDamById = async (id: string): Promise<DomainArchitectureMapping> => {
  try {
    const res = await fetch(`${backendUrl}/dam/${id}`, {});

    switch (res.status) {
      case 200:
        return await res.json();
      case 404:
        throw new DamNotFoundError({ id });
      default:
        throw new Error("Unknown error");
    }
  } catch (error) {
    console.error("Error fetching domain story:", error);
    throw error;
  }
};
