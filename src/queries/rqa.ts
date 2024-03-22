import axios from "axios";
import { getBackendUrl } from "./domainstory";
import { exampleRQAs } from "../data/exampleRQAs";
import { ResilienceTestDefinition } from "../models/rqa/definition/resiliencetest/ResilienceTestDefinition";

import { CreateRqaDto } from "../types/dtos/CreateRqaDto";
import { LoadTestDefinition } from "../types/rqa/definition/loadtest/LoadTestDefinition";

const backend = new URL("/api/v1", getBackendUrl());

export const getAllRqas = async () => {
  return exampleRQAs;
  // TODO set endpoint
  /* return axios.get(`${backend}/rqa-definition`)
		.then(res => {
			console.log(res.data);
			let data = res.data;
			return data.map((rqa: any) => {
				rqa._id = rqa.id;
				return rqa;
			})
			//return res.data;
		}); */
};

export const getRqaById = (id: string) => {
  return axios.get(`${backend}/rqa-definition/${id}`).then((res) => res.data);
};

export const createRqa = (createRqaDto: CreateRqaDto) => {
  return axios
    .post(`${backend}/rqa-definition`, createRqaDto)
    .then((res) => res.data);
};

export const deleteRqa = ({ rqaId }: { rqaId: string }) => {
  return axios
    .delete(`${backend}/rqa-definition/${rqaId}`)
    .then((res) => res.data);
};

export const deleteLoadtest = ({
  rqaId,
  loadtestId,
}: {
  rqaId: String;
  loadtestId: String;
}) => {
  return axios
    .delete(`${backend}/rqa-definition/${rqaId}/loadtest/${loadtestId}`)
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
  resilienceTest,
}: {
  rqaId: string;
  resilienceTest: ResilienceTestDefinition;
}) => {
  console.log("addResiliencetestToRqa", "rqaId: " + rqaId, resilienceTest);
  return axios
    .put(`${backend}/rqa-definition/${rqaId}/resilienceTest`, resilienceTest)
    .then((res) => res.data);
};
