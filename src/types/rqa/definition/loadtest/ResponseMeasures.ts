import type { ResponseTime } from "@/types/rqa/definition/enums/ResponseTime";

export interface ResponseMeasures {
	response_time?: ResponseTime | null;
}
