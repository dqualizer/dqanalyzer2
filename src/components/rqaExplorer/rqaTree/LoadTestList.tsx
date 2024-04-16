import { useRef } from "react";
import { LoadTestDetail } from "./LoadTestDetail";
import { LoadTestDefinition } from "../../../types/rqa/definition/loadtest/LoadTestDefinition";

interface LoadtestsProps {
  loadTestDefinition: LoadTestDefinition[];
  rqaId?: string;
  loadtestSpecifier: any;
}

export function LoadTestList({
  loadTestDefinition,
  rqaId,
  loadtestSpecifier,
}: LoadtestsProps) {
  const detailsRef = useRef(null);
  return (
    <details ref={detailsRef}>
      <summary>
        <span>Loadtests</span>
      </summary>
      <ul>
        {loadTestDefinition.map((loadtest) => {
          return (
            <li key={loadtest._id}>
              <LoadTestDetail
                loadTestDefinition={loadtest}
                parentMenuRef={detailsRef}
                rqaId={rqaId}
                loadtestSpecifier={loadtestSpecifier}
              />
            </li>
          );
        })}
      </ul>
    </details>
  );
}
