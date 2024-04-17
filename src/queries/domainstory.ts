import axios from "axios";
import { DomainStory } from "../types/dam/domainstory/DomainStory";
import {
  exampleDomainStoryResilience,
  exampleSimpleDomainStoryResilience,
  exampleSimpleDomainStoryResilience2,
} from "../data/domainstories/exampleDomainStoryResilience";
import { exampleDomainstories } from "../data/domainstories/exampleDomainStories";
import { domainstoryResilience } from "../data/exampleDomainstory";

export const getBackendUrl = () => {
  if (import.meta.env.DEV && import.meta.env.VITE_BACKEND_URL === "")
    throw new Error(
      "Your in Dev-Mode. Please set Backend_URL in .env and restart."
    );
  return import.meta.env.DEV
    ? import.meta.env.VITE_BACKEND_URL
    : // @ts-expect-error
      window._env_.VITE_BACKEND_URL;
};

const backend = new URL("/api/v1", getBackendUrl());

export const getAllDomainstories = () => {
  return axios.get(`${backend}/dam/`).then((res) => res.data);
};

// as soon dqapi is read this will be removed
export const getAllDomainstoriesMock = () => {
  return exampleDomainstories;
};

export const getDomainstoryById = async (id: String) => {
  return axios.get(`${backend}/dam/${id}`).then((res) => res.data);
};

export const getDomainstoryByIdMock = async (id: String) => {
  return new Promise<DomainStory>((resolve) => {
    // Simulate a delay and an ID assignment as it might happen on a real backend
    setTimeout(() => {
      resolve(exampleDomainStoryResilience);
      //resolve(exampleSimpleDomainStoryResilience2);

      // resolve(exampleDomainstory); // Resolve the promise with the new domain story
    }, 1000); // Simulate async operation with 1 second delay
  });
};

export const createDomainstory = (domainstory: DomainStory) => {
  return axios.post(`${backend}/dam/`, domainstory).then((res) => res.data);
};

export const createDomainstoryMock = (domainstory: DomainStory) => {
  return new Promise((resolve) => {
    // Simulate a delay and an ID assignment as it might happen on a real backend
    setTimeout(() => {
      const newDomainStory = {
        ...domainstory,
      };
      exampleDomainstories.push(newDomainStory);
      resolve(newDomainStory); // Resolve the promise with the new domain story
    }, 1000); // Simulate async operation with 1 second delay
  });
};
