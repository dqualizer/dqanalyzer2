"use client";

import type { RuntimeQualityAnalysisDefinition } from "@/types/rqa/definition/RuntimeQualityAnalysisDefinition";
import { useRef } from "react";
import { DeleteRqaButton } from "./Buttons/DeleteRqaButton";
import { RqaDefinition } from "./rqaTree/RqaDefinition";

interface RqaListItemProps {
  rqa: RuntimeQualityAnalysisDefinition;
  loadTestSpecifier: any;
  resilienceTestSpecifier: any;
}

export function RqaListItem({
  rqa,
  loadTestSpecifier,
  resilienceTestSpecifier,
}: RqaListItemProps) {
  const detailsRef = useRef(null);
  return (
    <li>
      <details ref={detailsRef} className="my-0">
        <summary className="pl-0">
          <span>{rqa.name}</span>
          <DeleteRqaButton rqa={rqa} />
        </summary>
        <RqaDefinition
          rqa={rqa}
          loadTestSpecifier={loadTestSpecifier}
          resilienceTestSpecifier={resilienceTestSpecifier}
        />
      </details>
    </li>
  );
}
