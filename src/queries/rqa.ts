"use server";

import type { CreateResilienceTestDto } from "@/types/dtos/CreateResilienceTestDto";
import type { RuntimeQualityAnalysisDefinition } from "@/types/rqa/definition/RuntimeQualityAnalysisDefinition";
import type { LoadTestDefinition } from "@/types/rqa/definition/loadtest/LoadTestDefinition";
import type { MonitoringDefinition } from "@/types/rqa/definition/monitoring/MonitoringDefinition";

const backendUrl = new URL(
  "/api/v2/rqa",
  `http://${process.env.DQAPI_HOST}` || "http://localhost:8099",
);

export const getAllRqas = async () => {
  const res = await fetch(backendUrl);
  const data: RuntimeQualityAnalysisDefinition[] = await res.json();
  return data;
};

export const getRqaById = async (id: string) => {
  const res = await fetch(`${backendUrl}/${id}`);
  const data: RuntimeQualityAnalysisDefinition = await res.json();
  return data;
};

export const deleteRqa = async ({
  rqaId,
}: { rqaId: string }): Promise<RuntimeQualityAnalysisDefinition> => {
  const res = await fetch(`${backendUrl}/${rqaId}`, {
    method: "DELETE",
  });
  return res.json();
};

export const deleteLoadtest = async ({
  rqaId,
  loadtestId,
}: {
  rqaId: string;
  loadtestId: string;
}): Promise<RuntimeQualityAnalysisDefinition> => {
  const res = await fetch(`${backendUrl}/${rqaId}/loadtest/${loadtestId}`, {
    method: "DELETE",
  });
  return res.json();
};

export const addLoadtestToRqa = async ({
  rqaId,
  loadTest,
}: {
  rqaId: string;
  loadTest: LoadTestDefinition;
}): Promise<RuntimeQualityAnalysisDefinition> => {
  const res = await fetch(`${backendUrl}/${rqaId}/loadtest`, {
    method: "PUT",
    body: JSON.stringify(loadTest),
  });
  return res.json();
};

export const addResilienceTestToRqa = async ({
  rqaId,
  resilienceTestDto,
}: {
  rqaId: string;
  resilienceTestDto: CreateResilienceTestDto;
}): Promise<RuntimeQualityAnalysisDefinition> => {
  const res = await fetch(`${backendUrl}/${rqaId}/resilience-test`, {
    method: "PUT",
    body: JSON.stringify(resilienceTestDto),
  });
  return res.json();
};

export const deleteResilienceTest = async ({
  rqaId,
  resilienceTestId,
}: {
  rqaId: string;
  resilienceTestId: string;
}): Promise<RuntimeQualityAnalysisDefinition> => {
  const res = await fetch(
    `${backendUrl}/${rqaId}/resilience-test/${resilienceTestId}`,
    { method: "DELETE" },
  );
  return res.json();
};

export const addMonitoringDefintionToRqa = async ({
  rqaId,
  monitoringDefinition,
}: {
  rqaId: string;
  monitoringDefinition: MonitoringDefinition;
}): Promise<RuntimeQualityAnalysisDefinition> => {
  const res = await fetch(`${backendUrl}/${rqaId}/monitoring`, {
    method: "PUT",
    body: JSON.stringify(monitoringDefinition),
  });
  return res.json();
};
