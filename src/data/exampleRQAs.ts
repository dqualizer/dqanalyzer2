import { RuntimeQualityAnalysisDefinition } from "../types/rqa/definition/RuntimeQualityAnalysisDefinition";
import { Environment } from "../types/rqa/definition/enums/Environment";
import { ResponseTime } from "../types/rqa/definition/enums/ResponseTime";
import { ResultMetrics } from "../types/rqa/definition/enums/ResultMetrics";

export const exampleRQAs: RuntimeQualityAnalysisDefinition[] = [
  {
    _id: "RGVtb1JRQQo=",
    context: "DemoContext",
    domain_id: "DemoID",
    environment: Environment.DEV,
    name: "DemoRQA",
    runtime_quality_analysis: {
      loadTestDefinition: [
        {
          _id: "RGVtb0xvYWRUZXN0Cg==",
          artifact: {
            activity_id: "DemoActivityId",
            system_id: "DemoSystemId",
          },
          description: "DemoDescription",
          name: "DemoLoadTest",
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
                type: "constant",
              },
            },
          },
          response_measure: {
            response_time: ResponseTime.SATISFIED,
          },
          result_metrics: [
            ResultMetrics.RESPONSE_TIME,
            ResultMetrics.NINETY_FIVE_PERCENTILE,
          ],
        },
      ],
    },
    version: "DemoVersion",
  },
];
