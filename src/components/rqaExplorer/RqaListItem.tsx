"use client";

import type { RuntimeQualityAnalysisDefinition } from "@/types/rqa/definition/RuntimeQualityAnalysisDefinition";
import { useRef } from "react";
import { DeleteRqaButton } from "./Buttons/DeleteRqaButton";
import { RqaDefinition } from "./rqaTree/RqaDefinition";

interface RqaListItemProps {
  rqa: RuntimeQualityAnalysisDefinition;
}

export function RqaListItem({ rqa }: RqaListItemProps) {
  const detailsRef = useRef(null);
  return (
    <li>
      <details ref={detailsRef} className="my-0">
        <summary className="pl-0">
          <span>{rqa.name}</span>
          <DeleteRqaButton rqa={rqa} />
        </summary>
        <RqaDefinition rqa={rqa} />
      </details>
    </li>
  );
}
