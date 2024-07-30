import type { RuntimeQualityAnalysisDefinition } from "@/types/rqa/definition/RuntimeQualityAnalysisDefinition";

interface DropdownLeftProps {
  rqas: RuntimeQualityAnalysisDefinition[];
  onClick: (rqaId: string) => void;
}

export function DropdownLeft({ rqas, onClick }: DropdownLeftProps) {
  return (
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn m-1">
        Choose rqa {">"}
      </div>
      <ul
        // biome-ignore lint/a11y/noNoninteractiveTabindex: <explanation>
        tabIndex={0}
        className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
      >
        {rqas.map((rqa, i) => {
          return (
            <li key={rqa.id}>
              <button type="button" onClick={() => onClick(rqa.id)}>
                {rqa.name}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// <div className="dropdown dropdown-right">
// 	<label className="btn m-1">Add to Rqa {">"}</label>
// 	<ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
// 		{rqas.map((rqa, i) => {
// 			return (
// 				// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
// 				<li key={i}>
// 					<button
// 						type="button"
// 						className="no-underline"
// 						onClick={() => onClick(rqa.id)}
// 					>
// 						{rqa.name}
// 					</button>
// 				</li>
// 			);
// 		})}
// 	</ul>
// </div>
