import { AddCircleOutlineSharp } from "@mui/icons-material";
import axios from "axios";
const backend = import.meta.env.VITE_BACKEND_URL;


export const getAllDomains = () => {
    return axios.get(`${backend}/`).then(res => res.data);
}

export const deleteDomainByName = (name) => {
    return axios.delete(`${backend}/${name}`).then(res => res.data);
}

export const deleteSubdomainByName = ({ parent, domain }) => {
    console.log(parent)
    return axios.delete(`${backend}/${parent}/${domain}`).then(res => res.data);
}