"use server";

import {DomainStory} from "@/types/dam/domainstory/DomainStory";
import type {DomainArchitectureMapping} from "@/types/dam/dam";

const backendUrl = new URL(
  "/api/v2/dam",
  `http://${process.env.DQAPI_HOST}` || "http://localhost:8099",
);

/**
 * Fetches all domain story IDs from the backend.
 *
 * @returns {Promise<string[]>} A promise that resolves to an array of domain story IDs.
 */
export const readAllDAMs = async (): Promise<DomainArchitectureMapping[]> => {
  // Send a GET request to the backend's '/api/v2/domain-story/ids' endpoint.
  // The 'cache' option is set to 'no-store' to prevent caching of the response.
  const res = await fetch(`${backendUrl}`, {
    next: { revalidate: 30 },
  });

  // If the response status is not OK, throw an error.
  if (!res.ok) {
    throw new Error(
      `Failed to fetch domain story IDs: ${res.status} ${res.statusText}`,
    );
  }

  // Parse the response as JSON and return it.
  return await res.json();
};
