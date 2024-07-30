import type { ResilienceResponseMeasures } from "@/types/rqa/definition/resiliencetest/ResilienceResponseMeasures";

interface ResilienceTestResponseMeasureDetailProps {
  responseMeasure: ResilienceResponseMeasures;
}

export function ResilienceTestResponseMeasureDetail({
  responseMeasure,
}: ResilienceTestResponseMeasureDetailProps) {
  return (
    <details>
      <summary>
        <span>Response Measures</span>
      </summary>
      <ul>
        <li>
          <span>Recovery Time: {responseMeasure?.recovery_time}</span>
        </li>
      </ul>
    </details>
  );
}
