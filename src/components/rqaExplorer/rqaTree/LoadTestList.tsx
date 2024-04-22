import { useRef } from "react";
import { LoadTestDetail } from "./LoadTestDetail";
import { LoadTestDefinition } from "../../../types/rqa/definition/loadtest/LoadTestDefinition";

interface LoadTestListProps {
  loadTestDefinition: LoadTestDefinition[];
  rqaId?: string;
  loadTestSpecifier: any;
}

export function LoadTestList({
  loadTestDefinition,
  rqaId,
  loadTestSpecifier,
}: LoadTestListProps) {
  const detailsRef = useRef(null);
  return (
    <details ref={detailsRef}>
      <summary>
        <span>Load Tests</span>
      </summary>
      <ul>
        {loadTestDefinition.map((loadtest) => {
          return (
            <li key={loadtest._id}>
              <LoadTestDetail
                loadTestDefinition={loadtest}
                parentMenuRef={detailsRef}
                rqaId={rqaId}
                loadTestSpecifier={loadTestSpecifier}
              />
            </li>
          );
        })}
      </ul>
    </details>
  );
}
