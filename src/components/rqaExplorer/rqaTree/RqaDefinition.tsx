import { LoadTestList } from "./LoadTestList";
import { RuntimeQualityAnalysisDefinition } from "../../../types/rqa/definition/RuntimeQualityAnalysisDefinition";
import axios from "axios";
import { ResilienceTestList } from "./ResilienceTestList";

interface RqaDefinitionProps {
  rqa: RuntimeQualityAnalysisDefinition;
  loadTestSpecifier: any;
  resilienceTestSpecifier: any;
}

export function RqaDefinition({
  rqa,
  loadTestSpecifier,
  resilienceTestSpecifier,
}: RqaDefinitionProps) {
  const handleExecute = () => {
    var data_copy = rqa; // The other components call the system_id and activity_id "object" and "activity"
    const call = axios
      .post(`http://localhost:8080/translate/${data_copy.id}`)
      .then((res) => console.log(res.data));
  };
  return (
    <ul>
      <li>
        <LoadTestList
          loadTestDefinition={rqa.runtime_quality_analysis.loadTestDefinition}
          rqaId={rqa._id}
          loadTestSpecifier={loadTestSpecifier}
        />
      </li>
      <li>
        <ResilienceTestList
          resilienceTestDefinition={
            rqa.runtime_quality_analysis.resilienceDefinition
          }
          rqaId={rqa._id}
          resilienceTestSpecifier={resilienceTestSpecifier}
        />
      </li>
      <li>
        <details>
          <summary>Details</summary>
          <ul>
            {Object.keys(rqa).map((key, i) => {
              return (
                key in rqa &&
                typeof rqa[key] === "string" &&
                key != "name" &&
                key != "id" && (
                  <li key={i}>
                    <span>
                      {key}: {rqa[key]}
                    </span>
                  </li>
                )
              );
            })}{" "}
          </ul>
        </details>
      </li>
      <li>
        <button className="btn btn-sm btn-primary" onClick={handleExecute}>
          Execute
        </button>
      </li>
    </ul>
  );
}
