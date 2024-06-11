import type { RuntimeQualityAnalysisDefinition } from "@/types/rqa/definition/RuntimeQualityAnalysisDefinition";
import { useState } from "react";
import { LoadTestList } from "./LoadTestList";
import { ResilienceTestList } from "./ResilienceTestList";

interface RqaDefinitionProps {
	rqa: RuntimeQualityAnalysisDefinition;
	loadTestSpecifier: any;
	resilienceTestSpecifier: any;
}

export async function RqaDefinition({
	rqa,
	loadTestSpecifier,
	resilienceTestSpecifier,
}: RqaDefinitionProps) {
	const [data, setData] = useState(null);

	const handleExecute = async () => {
		const res = await fetch(`http://localhost:8080/translate/${rqa.id}`);
		const data = await res.json();
		setData(data);
	};

	return (
		<ul>
			<li>
				<LoadTestList
					loadTestDefinition={rqa.runtime_quality_analysis.loadTestDefinition}
					rqaId={rqa._id}
					loadTestSpecifier={loadTestSpecifier}
				/>
			</li>
			<li>
				<ResilienceTestList
					resilienceTestDefinition={
						rqa.runtime_quality_analysis.resilienceDefinition
					}
					rqaId={rqa._id}
					resilienceTestSpecifier={resilienceTestSpecifier}
				/>
			</li>
			<li>
				<details>
					<summary>Details</summary>
					<ul>
						{Object.keys(rqa).map((key, i) => {
							return (
								key in rqa &&
								typeof rqa[key] === "string" &&
								key !== "name" &&
								key !== "id" && (
									<li key={i}>
										<span>
											{key}: {rqa[key]}
										</span>
									</li>
								)
							);
						})}{" "}
					</ul>
				</details>
			</li>
			<li>
				<button
					type="button"
					className="btn btn-sm btn-primary"
					onClick={handleExecute}
				>
					{data ? "Re-Execute" : "Execute"}
				</button>
				{data && <pre className="mt-2">{JSON.stringify(data, null, 2)}</pre>}
			</li>
		</ul>
	);
}
