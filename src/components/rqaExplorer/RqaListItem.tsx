import { DeleteRqaButton } from "@/components/rqaExplorer/Buttons/DeleteRqaButton";
import { RqaDefinition } from "@/components/rqaExplorer/rqaTree/RqaDefinition";
import { deleteRqa } from "@/queries/rqa";
import type { DomainStory } from "@/types/dam/domainstory/DomainStory";
import type { RuntimeQualityAnalysisDefinition } from "@/types/rqa/definition/RuntimeQualityAnalysisDefinition";
import { useRef } from "react";

interface RqaListItemProps {
	rqa: RuntimeQualityAnalysisDefinition;
	domainStory: DomainStory;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	loadTestSpecifier: any;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
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
