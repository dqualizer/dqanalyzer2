import type { RuntimeQualityAnalysisDefinition } from "@/types/rqa/definition/RuntimeQualityAnalysisDefinition";

interface DropdownLeftProps {
	rqas: RuntimeQualityAnalysisDefinition[];
	onClick: (rqaId: string) => void;
}

export function DropdownLeft({ rqas, onClick }: DropdownLeftProps) {
	console.log(rqas);

	return (
		<div className="dropdown dropdown-right">
			<label className="btn m-1">Add to Rqa {">"}</label>
			<ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
				{rqas.map((rqa, i) => {
					return (
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						<li key={i}>
							<button
								type="button"
								className="no-underline"
								onClick={() => onClick(rqa.id)}
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
