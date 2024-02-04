import axios from "axios";
import { getBackendUrl } from "./dam";
import { exampleRQAs } from "../data/exampleRQAs";

const backend = new URL('/api/v1', getBackendUrl());

export const getAllRqas = async () => {
	return exampleRQAs;
	// TODO set endpoint
	/*     return axios.get(`${backend}/rqa-definition`)
					.then(res => res.data); */
}

export const getRqaById = (id) => {
	return axios.get(`${backend}/rqa-definition/${id}`)
		.then(res => res.data);
}

export const createRqa = (createRqaDto) => {
	return axios.post(`${backend}/rqa-definition`, createRqaDto).then(res => res.data);
}

export const deleteRqa = ({ rqaId }) => {
	return axios.delete(`${backend}/rqa-definition/${rqaId}`).then(res => res.data);
}

export const deleteLoadtest = (deleteLoadtestPath) => {
	return axios.delete(`${backend}/rqa-definition/${deleteLoadtestPath.rqaId}/loadtest/${deleteLoadtestPath.loadtestName}`).then(res => res.data);
}

export const addLoadtestToRqa = ({ rqaId, inputs }) => {
	console.log(inputs);
	return axios.put(`${backend}/rqa-definition/${rqaId}/loadtest`, inputs).then(res => res.data);
} 