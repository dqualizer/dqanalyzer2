import { useRef } from "react";
import { RqaDefinition } from "./rqaTree/RqaDefinition";
import { DeleteRqaButton } from "./Buttons/DeleteRqaButton";
import { deleteRqa } from "../../queries/rqa";
import { RuntimeQualityAnalysisDefinition } from "../../types/rqa/definition/RuntimeQualityAnalysisDefinition";

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
    <ul className="menu rounded-box px-0 text-base py-0 my-4">
      <li>
        <details ref={detailsRef} className="my-0">
          <summary className="pl-0">
            <span>{rqa.name}</span>
            <DeleteRqaButton
              rqa={rqa}
              parentMenuRef={detailsRef}
              action={deleteRqa}
            />
          </summary>
          <RqaDefinition
            rqa={rqa}
            loadTestSpecifier={loadTestSpecifier}
            resilienceTestSpecifier={resilienceTestSpecifier}
          />
        </details>
      </li>
    </ul>
  );
}
