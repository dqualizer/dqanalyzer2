import { StimulusDetail } from "./StimulusDetail";
import { ParametrizationDetail } from "./ParametrizationDetail";
import { ResponseMeasureDetail } from "./ResponseMeasureDetail";
import { ResultMetricsDetail } from "./ResultMetricsDetail";
import { DeleteLoadTestButton } from "../Buttons/DeleteLoadTestButton";
import { EditLoadTestButton } from "./EditLoadTestButton";
import { LoadTestDefinition } from "../../../types/rqa/definition/loadtest/LoadTestDefinition";

interface LoadtestProps {
  loadTestDefinition: LoadTestDefinition;
  rqaId?: string;
  loadtestSpecifier: any;
  parentMenuRef: any;
}

export function LoadTestDetail({
  loadTestDefinition,
  rqaId,
  loadtestSpecifier,
  parentMenuRef,
}: LoadtestProps) {
  return (
    <details>
      <summary className="flex justify-between items-center">
        <span>{loadTestDefinition.name}</span>
        <DeleteLoadTestButton
          loadTestDefinition={loadTestDefinition}
          rqaId={rqaId}
          parentMenuRef={parentMenuRef}
        />
        <EditLoadTestButton
          loadtestSpecifier={loadtestSpecifier}
          parentMenuRef={parentMenuRef}
        />
      </summary>
      <ul>
        <li>{<StimulusDetail stimulus={loadTestDefinition.stimulus} />}</li>
        <li>
          {
            <ParametrizationDetail
              parametrization={loadTestDefinition.parametrization}
            />
          }
        </li>
        <li>
          {
            <ResponseMeasureDetail
              responseMeasure={loadTestDefinition.response_measure}
            />
          }
        </li>
        <li>
          {
            <ResultMetricsDetail
              resultMetrics={loadTestDefinition.result_metrics}
            />
          }
        </li>
      </ul>
    </details>
  );
}
