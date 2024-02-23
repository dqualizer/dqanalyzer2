import { RuntimeQualityAnalysisDefinition } from "../types/rqa/definition/RuntimeQualityAnalysisDefinition";

interface DropdownLeftProps {
  rqas?: RuntimeQualityAnalysisDefinition[];
  onClick: (rqaId?: string) => void;
}

export function DropdownLeft({ rqas, onClick }: DropdownLeftProps) {
  return (
    <div className="dropdown dropdown-right">
      <label tabIndex={0} className="btn m-1">
        Add to Rqa {">"}
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
      >
        {rqas?.map((rqa, i) => {
          return (
            <li key={i}>
              <button
                className="no-underline"
                onClick={(e) => onClick(rqa._id)}
              >
                {rqa.name}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
