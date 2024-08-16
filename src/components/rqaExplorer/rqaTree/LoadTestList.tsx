import { LoadTestDetail } from "@/components/rqaExplorer/rqaTree/LoadTestDetail";
import type { LoadTestDefinition } from "@/types/rqa/definition/loadtest/LoadTestDefinition";
import { useRef } from "react";

interface LoadTestListProps {
  loadTestDefinition: LoadTestDefinition[];
  rqaId: string;
}

export function LoadTestList({ loadTestDefinition, rqaId }: LoadTestListProps) {
  const detailsRef = useRef(null);
  return (
    <details ref={detailsRef}>
      <summary>
        <span>Load Tests</span>
      </summary>
      <ul>
        {loadTestDefinition.map((loadtest) => {
          return (
            <li key={loadtest.id}>
              <LoadTestDetail
                loadTestDefinition={loadtest}
                parentMenuRef={detailsRef}
                rqaId={rqaId}
              />
            </li>
          );
        })}
      </ul>
    </details>
  );
}
