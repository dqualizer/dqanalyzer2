import type { DomainStory } from "@/types/dam/domainstory/DomainStory";

export const getBackendUrl = () => {
  return `http://${process.env.DQAPI_HOST}` || "http://localhost:8099";
};

const backend = new URL("/api/v2", getBackendUrl());

export const getAllDomainstories = async () => {
  const res = await fetch(`${backend}/dam/domain-story`, { cache: "no-store" });
  const data: DomainStory[] = await res.json();

  return data;
};

export const getDomainstoryById = async (id: string) => {
  const res = await fetch(`${backend}/dam/domain-story/${id}`);
  const data: DomainStory = await res.json();

  return data;
};

export const createDomainstory = async (domainstory: DomainStory) => {
  const res = await fetch(`${backend}/dam/domain-story`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(domainstory),
  });

  const data: DomainStory = await res.json();
  return data;
};
