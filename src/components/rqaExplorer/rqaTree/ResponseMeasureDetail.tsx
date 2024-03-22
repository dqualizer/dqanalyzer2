import { ResponseMeasures } from "../../../types/rqa/definition/loadtest/ResponseMeasures";
import { formatResponseTime } from "../../../utils/rqa.utils";

interface ResponseMeasureDetailProps {
  responseMeasure?: ResponseMeasures | null;
}

export function ResponseMeasureDetail({
  responseMeasure,
}: ResponseMeasureDetailProps) {
  return (
    <details>
      <summary>
        <span>Response Measures</span>
      </summary>
      <ul>
        <li>
          <span>
            Response Time:{" "}
            {responseMeasure?.response_time != null
              ? formatResponseTime(responseMeasure.response_time)
              : "empty"}
          </span>
        </li>
      </ul>
    </details>
  );
}
