import axios from "axios";
import { getBackendUrl } from "./domainstory";
import { exampleRQAs } from "../data/exampleRQAs";
import { CreateRqaDto } from "../types/dtos/CreateRqaDto";

const backend = new URL("/api/v1", getBackendUrl());

export const getAllRqas = async () => {
  return exampleRQAs;
  // TODO set endpoint
  /*     return axios.get(`${backend}/rqa-definition`)
					.then(res => res.data); */
};

export const getRqaById = (id: String) => {
  return axios.get(`${backend}/rqa-definition/${id}`).then((res) => res.data);
};

export const createRqa = (createRqaDto: CreateRqaDto) => {
  return axios
    .post(`${backend}/rqa-definition`, createRqaDto)
    .then((res) => res.data);
};

//@ts-expect-error
export const deleteRqa = ({ rqaId: String }) => {
  return (
    axios
      //@ts-expect-error
      .delete(`${backend}/rqa-definition/${rqaId}`)
      .then((res) => res.data)
  );
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

// @ts-expect-error
export const addLoadtestToRqa = ({ rqaId, inputs }) => {
  console.log(inputs);
  return axios
    .put(`${backend}/rqa-definition/${rqaId}/loadtest`, inputs)
    .then((res) => res.data);
};
