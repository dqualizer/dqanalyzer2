import type { ResilienceTestDefinition } from "@/types/rqa/definition/resiliencetest/ResilienceTestDefinition";
import { DeleteResilienceTestButton } from "../Buttons/DeleteResilienceTestButton";
import { ResilienceTestArtifactDetail } from "./ResilienceTestArtifactDetail";
import { ResilienceTestResponseMeasureDetail } from "./ResilienceTestResponseMeasureDetail";
import { ResilienceTestStimulusDetail } from "./ResilienceTestStimulusDetail";

interface ResilienceTestDetailProps {
  resilienceTestDefinition: ResilienceTestDefinition;
  rqaId?: string;
  resilienceTestSpecifier: any;
  parentMenuRef: any;
}

export function ResilienceTestDetail({
  resilienceTestDefinition,
  rqaId,
  resilienceTestSpecifier,
  parentMenuRef,
}: ResilienceTestDetailProps) {
  return (
    <details>
      <summary className="flex justify-between items-center">
        <span>{resilienceTestDefinition.name}</span>
        <DeleteResilienceTestButton
          resilienceTestDefinition={resilienceTestDefinition}
          rqaId={rqaId}
          parentMenuRef={parentMenuRef}
        />
        {/* <EditResilienceTestButton
          resilienceTestSpecifier={resilienceTestSpecifier}
          parentMenuRef={parentMenuRef}
        /> */}
      </summary>
      <ul>
        <li>
          {
            <ResilienceTestArtifactDetail
              artifact={resilienceTestDefinition.artifact}
            />
          }
        </li>
        <li>
          {
            <ResilienceTestStimulusDetail
              stimulus={resilienceTestDefinition.stimulus}
            />
          }
        </li>
        {/* <li>
          {
            <ParametrizationDetail
              parametrization={loadTestDefinition.parametrization}
            />
          }
        </li> */}
        <li>
          {
            <ResilienceTestResponseMeasureDetail
              responseMeasure={resilienceTestDefinition.response_measure}
            />
          }
        </li>
        {/*  <li>
          {
            <ResultMetricsDetail
              resultMetrics={loadTestDefinition.result_metrics}
            />
          }
        </li> */}
      </ul>
    </details>
  );
}
