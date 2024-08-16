import { DeleteLoadTestButton } from "@/components/rqaExplorer/Buttons/DeleteLoadTestButton";
import type { LoadTestDefinition } from "@/types/rqa/definition/loadtest/LoadTestDefinition";
import { EditLoadTestButton } from "./EditLoadTestButton";
import ParametrizationDetail from "./ParametrizationDetail";
import { ResponseMeasureDetail } from "./ResponseMeasureDetail";
import { ResultMetricsDetail } from "./ResultMetricsDetail";
import { StimulusDetail } from "./StimulusDetail";

interface LoadTestDetailProps {
  loadTestDefinition: LoadTestDefinition;
  rqaId: string;
  parentMenuRef: any;
}

export function LoadTestDetail({
  loadTestDefinition,
  rqaId,
  parentMenuRef,
}: LoadTestDetailProps) {
  return (
    <details>
      <summary className="flex justify-between items-center">
        <span>{loadTestDefinition.name}</span>
        <DeleteLoadTestButton
          loadTestDefinition={loadTestDefinition}
          rqaId={rqaId}
          parentMenuRef={parentMenuRef}
        />
        <EditLoadTestButton />
      </summary>
      <ul>
        <li>
          <StimulusDetail stimulus={loadTestDefinition.stimulus} />
        </li>
        <li>
          <ParametrizationDetail
            parametrization={loadTestDefinition.parametrization}
          />
        </li>
        <li>
          <ResponseMeasureDetail
            responseMeasure={loadTestDefinition.response_measure}
          />
        </li>
        <li>
          <ResultMetricsDetail
            resultMetrics={loadTestDefinition.result_metrics}
          />
        </li>
      </ul>
    </details>
  );
}
