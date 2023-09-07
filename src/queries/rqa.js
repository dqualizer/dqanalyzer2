import axios from "axios";

const backend = import.meta.env.VITE_BACKEND_URL;

export const getAllRqas = () => {
    return axios.get(`${backend}/rqa-definition`)
        .then(res => res.data);
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

export const addLoadtestToRqa = ({ rqaId, loadtest }) => {
    return axios.put(`${backend}/rqa-definition/${rqaId}/loadtest`, loadtest).then(res => res.data);
} 