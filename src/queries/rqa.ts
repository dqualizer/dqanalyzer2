import axios from "axios";
import { getBackendUrl } from "./dam";
import { exampleRQAs } from "../data/exampleRQAs";
import { LoadTestDefinition } from "../models/rqa/definition/loadtest/LoadTestDefinition";
import { RuntimeQualityAnalysisDefinition } from "../models/rqa/definition/RuntimeQualityAnalysisDefinition";
import { CreateResilienceTestDto } from "../models/dtos/CreateResilienceTestDto";

const backend = new URL("/api/v1", getBackendUrl());

export const getAllRqas = async () => {
  // return exampleRQAs;
  // TODO set endpoint
  return axios.get(`${backend}/rqa-definition`).then((res) => {
    const data = res.data as RuntimeQualityAnalysisDefinition[];
    console.log("RQAs", data);
    const rqaDefinitions = data.map((rqa: any) => {
      // TODO remove following statements when dqlang3.0 is fully implemented
      if (!rqa._id) {
        rqa._id = rqa.id;
      }
      if (
        !rqa.runtime_quality_analysis?.loadTestDefinition &&
        rqa.runtime_quality_analysis?.loadtests
      ) {
        rqa.runtime_quality_analysis.loadTestDefinition =
          rqa.runtime_quality_analysis.loadtests;
      }
      if (
        !rqa.runtime_quality_analysis?.resilienceTestDefinition &&
        rqa.runtime_quality_analysis?.resilienceTests
      ) {
        rqa.runtime_quality_analysis.resilienceTestDefinition =
          rqa.runtime_quality_analysis.resilienceTests;
      }
      return rqa as RuntimeQualityAnalysisDefinition;
    });
    return rqaDefinitions;
  });
};

export const getRqaById = (id: string) => {
  return axios.get(`${backend}/rqa-definition/${id}`).then((res) => res.data);
};

export const createRqa = (createRqaDto: RuntimeQualityAnalysisDefinition) => {
  return axios
    .post(`${backend}/rqa-definition`, createRqaDto)
    .then((res) => res.data);
};

export const deleteRqa = ({ rqaId }: { rqaId: string }) => {
  return axios
    .delete(`${backend}/rqa-definition/${rqaId}`)
    .then((res) => res.data);
};

export const deleteLoadtest = (deleteLoadtestPath) => {
  // TODO delete LoadTest by ID
  return axios
    .delete(
      `${backend}/rqa-definition/${deleteLoadtestPath.rqaId}/loadtest/${deleteLoadtestPath.loadtestName}`
    )
    .then((res) => res.data);
};

export const addLoadtestToRqa = ({
  rqaId,
  loadTest,
}: {
  rqaId: string;
  loadTest: LoadTestDefinition;
}) => {
  return axios
    .put(`${backend}/rqa-definition/${rqaId}/loadtest`, loadTest)
    .then((res) => res.data);
};

export const addResilienceTestToRqa = ({
  rqaId,
  resilienceTestDto,
}: {
  rqaId: string;
  resilienceTestDto: CreateResilienceTestDto;
}) => {
  console.log("addResiliencetestToRqa", "rqaId: " + rqaId, resilienceTestDto);
  return axios
    .put(`${backend}/rqa-definition/${rqaId}/resilienceTest`, resilienceTestDto)
    .then((res) => res.data);
};
