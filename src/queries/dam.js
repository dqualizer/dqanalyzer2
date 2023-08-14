import axios from "axios";
export const getBackendUrl = () => {
    return import.meta.env.DEV ? import.meta.env.VITE_BACKEND_URL : window._env_.VITE_BACKEND_URL
}

const backend = new URL('/api/v1', getBackendUrl());

export const getAllDams = () => {
    return axios.get(`${backend}/dam/`)
        .then(res => res.data);
}

export const getDamById = async (id) => {
    return axios.get(`${backend}/dam/${id}`)
        .then(res => res.data);
}