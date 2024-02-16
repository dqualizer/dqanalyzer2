import { ResponseTime } from "../models/rqa/definition/enums/ResponseTime";
import { ResultMetrics } from "../models/rqa/definition/enums/ResultMetrics";

export const validateObject = (obj: any) => {
	if (obj === undefined || obj === null) {
		return false;
	}

	if (Array.isArray(obj) && obj.length === 0) {
		return false;
	}

	if (typeof obj === 'object') {
		for (const key in obj) {
			if (validateObject(obj[key]) === false) {
				return false;
			}
		}
	}

	return true;
}

export const formatResponseTime = (responseTime: ResponseTime) => {
	switch (responseTime) {
		case ResponseTime.FRUSTRATED:
			return 'Frustrated';
		case ResponseTime.SATISFIED:
			return 'Satisfied';
		case ResponseTime.TOLERATED:
			return 'Tolerated';
		default:
			return 'unknown response time';
	}
}

export const formatResultMetric = (resultMetric: ResultMetrics) => {
	switch (resultMetric) {
		case ResultMetrics.NINETY_FIVE_PERCENTILE:
			return '95th Percentile';
		case ResultMetrics.NINETY_PERCENTILE:
			return '90th Percentile';
		case ResultMetrics.RESPONSE_TIME:
			return 'Response Time';
		default:
			return 'unknown result metric';
	}
}
