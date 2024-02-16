import { useRef } from "react";
import { RqaDefinition } from "./rqaTree/RqaDefinition";
import { DeleteRqaButton } from "./Buttons/DeleteRqaButton";
import { deleteRqa } from "../../queries/rqa";
import { RuntimeQualityAnalysisDefinition } from "../../models/rqa/definition/RuntimeQualityAnalysisDefinition";

interface RqaListItemProps {
	rqa: RuntimeQualityAnalysisDefinition;
	loadtestSpecifier: any;
}

export function RqaListItem({ rqa, loadtestSpecifier }: RqaListItemProps) {
	const detailsRef = useRef();
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
					<RqaDefinition rqa={rqa} loadtestSpecifier={loadtestSpecifier} />
				</details>
			</li>
		</ul>
	);
}
