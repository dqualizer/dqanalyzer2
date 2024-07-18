import { LoadTestDetail } from "@/components/rqaExplorer/rqaTree/LoadTestDetail";
import type { LoadTestDefinition } from "@/types/rqa/definition/loadtest/LoadTestDefinition";
import { useRef } from "react";

interface LoadTestListProps {
	loadTestDefinition: LoadTestDefinition[];
	rqaId?: string;
	loadTestSpecifier: any;
}

export function LoadTestList({
	loadTestDefinition,
	rqaId,
	loadTestSpecifier,
}: LoadTestListProps) {
	const detailsRef = useRef(null);
	return (
		<details ref={detailsRef}>
			<summary>
				<span>Load Tests</span>
			</summary>
			<ul>
				{loadTestDefinition.map((loadtest) => {
					return (
						<li key={loadtest.id}>
							<LoadTestDetail
								loadTestDefinition={loadtest}
								parentMenuRef={detailsRef}
								rqaId={rqaId}
								loadTestSpecifier={loadTestSpecifier}
							/>
						</li>
					);
				})}
			</ul>
		</details>
	);
}
