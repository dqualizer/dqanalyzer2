import type { RuntimeQualityAnalysisDefinition } from "@/types/rqa/definition/RuntimeQualityAnalysisDefinition";
import { useState } from "react";
import { LoadTestList } from "./LoadTestList";
import MonitoringDefinitionList from "./MonitoringDefinitionList";
import { ResilienceTestList } from "./ResilienceTestList";
import { startRQA } from "./action";

interface RqaDefinitionProps {
  rqa: RuntimeQualityAnalysisDefinition;
}

export function RqaDefinition({ rqa }: RqaDefinitionProps) {
  const [data] = useState(null);
  const startRQAWithRQA = startRQA.bind(null, rqa);

  return (
    <ul>
      <li>
        <LoadTestList
          loadTestDefinition={rqa.runtime_quality_analysis.load_test_definition}
          rqaId={rqa.id}
        />
      </li>
      <li>
        <ResilienceTestList
          resilienceTestDefinition={
            rqa.runtime_quality_analysis.resilience_definition
          }
          rqaId={rqa.id}
        />
      </li>
      <li>
        <MonitoringDefinitionList
          monitoringDefinitions={
            rqa.runtime_quality_analysis.monitoring_definition
          }
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
                key !== "name" &&
                key !== "id" && (
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
        <form action={startRQAWithRQA}>
          <button type="submit" className="btn btn-sm btn-primary">
            {data ? "Re-Execute" : "Execute"}
          </button>
          {data && <pre className="mt-2">{JSON.stringify(data, null, 2)}</pre>}
        </form>
      </li>
    </ul>
  );
}
