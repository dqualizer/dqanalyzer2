import { AddCircleOutlineSharp } from "@mui/icons-material";
import axios from "axios";
import { getBackendUrl } from "./dam";

const backend = new URL('/api/v1', getBackendUrl());

export const getAllDomains = () => {
    return axios.get(`${backend}/`).then(res => res.data);
}

export const getDomainByName = (domainName) => {
    return axios.get(`${backend}/${domainName}`)
}

export const deleteDomainByName = (name) => {
    return axios.delete(`${backend}/${name}`).then(res => res.data);
}

export const deleteSubdomainByName = ({ parent, domain }) => {
    console.log(parent)
    return axios.delete(`${backend}/${parent}/${domain}`).then(res => res.data);
}

export const createDomain = (name) => {
    console.log(name)
    return axios.post(`${backend}/${name}`).then(res => res.data);
}

export const createContext = (domain, subdomain, context) => {
    return axios.post(`${backend}/${domain}/${subdomain}/${context}`)
}