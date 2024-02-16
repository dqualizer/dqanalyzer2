import { LoadTestList } from "./LoadTestList";
import { RuntimeQualityAnalysisDefinition } from "../../../models/rqa/definition/RuntimeQualityAnalysisDefinition";
import axios from "axios";

interface RqaDefinitionProps {
	rqa: RuntimeQualityAnalysisDefinition;
	loadtestSpecifier: any;
}

export function RqaDefinition({ rqa, loadtestSpecifier }: RqaDefinitionProps) {
	const handleExecute = () => {
		var data_copy = rqa; // The other components call the system_id and activity_id "object" and "activity"
		const call = axios
			.post(`http://localhost:8080/translate/${data_copy.id}`)
			.then((res) => console.log(res.data));
	};
	return (
		<ul>
			<li>
				<LoadTestList
					loadTestDefinition={rqa.runtime_quality_analysis.loadTestDefinition}
					rqaId={rqa._id}
					loadtestSpecifier={loadtestSpecifier}
				/>
			</li>
			<li>
				<details>
					<summary>Details</summary>
					<ul>
						{Object.keys(rqa).map((key, i) => {
							return (
								key in rqa && typeof rqa[key] === "string" &&
								key != "name" &&
								key != "id" && (
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
				<button className="btn btn-sm btn-primary" onClick={handleExecute}>
					Execute
				</button>
			</li>
		</ul>
	);
}
