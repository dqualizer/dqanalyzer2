"use server";

import type { CreateRqa } from "@/types/dtos/CreateRqa";
import { revalidateTag } from "next/cache";

const backendUrl = new URL(
	"/api/v2/rqa",
	`http://${process.env.DQAPI_HOST}` || "http://localhost:8099",
);

export const createRqa = async (dto: CreateRqa) => {
	const res = await fetch(`${backendUrl}`, {
		method: "POST",
		body: JSON.stringify(dto),
		headers: {
			"Content-Type": "application/json",
		},
	});

	revalidateTag("rqas");

	return [await res.json(), res.headers.get("Location")];
};
