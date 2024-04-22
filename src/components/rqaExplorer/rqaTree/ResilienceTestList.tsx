import { useRef } from "react";
import { ResilienceTestDefinition } from "../../../types/rqa/definition/resiliencetest/ResilienceTestDefinition";
import { ResilienceTestDetail } from "./ResilienceTestDetail";

interface ResilienceTestListProps {
  resilienceTestDefinition: ResilienceTestDefinition[];
  rqaId?: string;
  resilienceTestSpecifier: any;
}

export function ResilienceTestList({
  resilienceTestDefinition,
  rqaId,
  resilienceTestSpecifier,
}: ResilienceTestListProps) {
  const detailsRef = useRef(null);
  return (
    <details ref={detailsRef}>
      <summary>
        <span>Resilience Tests</span>
      </summary>
      <ul>
        {resilienceTestDefinition.map((resilienceTest, index) => {
          return (
            <li key={index}>
              <ResilienceTestDetail
                resilienceTestDefinition={resilienceTest}
                parentMenuRef={detailsRef}
                rqaId={rqaId}
                resilienceTestSpecifier={resilienceTestSpecifier}
              />
            </li>
          );
        })}
      </ul>
    </details>
  );
}
