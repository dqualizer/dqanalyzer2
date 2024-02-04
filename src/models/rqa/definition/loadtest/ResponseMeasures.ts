import { ResponseTime } from "../enums/ResponseTime";

export interface ResponseMeasures {
	response_time?: ResponseTime | null;
}