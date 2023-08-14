import axios from "axios";
const backend = import.meta.env.VITE_BACKEND_URL;


export const getAllDams = () => {
    return axios.get(`${backend}/dam/`)
        .then(res => res.data);
}

export const getDamById = async (id) => {
    return axios.get(`${backend}/dam/${id}`)
        .then(res => res.data);
}