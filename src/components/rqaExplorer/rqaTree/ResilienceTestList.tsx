import type { ResilienceTestDefinition } from "@/types/rqa/definition/resiliencetest/ResilienceTestDefinition";
import { useRef } from "react";

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

  console.debug(resilienceTestDefinition)
  return (
    <details ref={detailsRef}>
      <summary>
        <span>Resilience Tests</span>
      </summary>
      {/* <ul>
        {resilienceTestDefinition.map((resilienceTest) => {
          return (
            <li key={resilienceTest.name}>
              <ResilienceTestDetail
                resilienceTestDefinition={resilienceTest}
                parentMenuRef={detailsRef}
                rqaId={rqaId}
                resilienceTestSpecifier={resilienceTestSpecifier}
              />
            </li>
          );
        })}
      </ul> */}
    </details>
  );
}
