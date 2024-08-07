import type { ResultMetrics } from "@/types/rqa/definition/enums/ResultMetrics";
import { formatResultMetric } from "@/utils/rqa.utils";

interface ResultMetricsDetail {
  resultMetrics?: ResultMetrics[] | null;
}

export function ResultMetricsDetail({ resultMetrics }: ResultMetricsDetail) {
  return (
    <details>
      <summary>
        <span>Result Metrics</span>
      </summary>
      <ul>
        {resultMetrics?.map((metric) => {
          return (
            <li key={metric.valueOf()}>
              <span>{formatResultMetric(metric.toString())}</span>
            </li>
          );
        })}
        {!resultMetrics?.length && <li>empty</li>}
      </ul>
    </details>
  );
}
