import { RuntimeQualityAnalysisDefinition } from "../models/rqa/definition/RuntimeQualityAnalysisDefinition";
import { Environment } from "../models/rqa/definition/enums/Environment";
import { ResponseTime } from "../models/rqa/definition/enums/ResponseTime";
import { ResultMetrics } from "../models/rqa/definition/enums/ResultMetrics";

export const exampleRQAs: RuntimeQualityAnalysisDefinition[] = [{
	_id: '659c2b13f32e263b1a3c80dd',
	context: 'testContext',
	domain_id: '65b757d3fe8ea06856910970',
	environment: Environment.DEV,
	name: 'TestContextRQA',
	runtime_quality_analysis: {
		loadTestDefinition: [],
		resilienceDefinition: [],
		/* loadTestDefinition: [
			{
				_id: 'RGVtb0xvYWRUZXN0Cg==',
				artifact:
				{
					activity_id: 'DemoActivityId',
					system_id: 'DemoSystemId',
				},
				description: 'DemoDescription',
				name: 'DemoLoadTest',
				parametrization: {
					path_variables: null,
					payload: null,
					request_parameter: null,
					url_parameter: null,
				},
				stimulus: {
					accuracy: 0,
					workload: {
						load_profile: {
							type: 'constant',
						}
					}
				},
				response_measure: {
					response_time: ResponseTime.SATISFIED,
				},
				result_metrics: [
					ResultMetrics.RESPONSE_TIME,
					ResultMetrics.NINETY_FIVE_PERCENTILE,
				]
			}
		], */
	},
	version: '1',
}]