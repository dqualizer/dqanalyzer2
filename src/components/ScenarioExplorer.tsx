import type { RuntimeQualityAnalysisDefinition } from "@/types/rqa/definition/RuntimeQualityAnalysisDefinition";
import { useState } from "react";

export default function ScenarioExplorer() {
	const [scenarioExplorerShow, setScenarioExplorerShow] = useState(false);
	const [scenarioTestShow, setScenarioTestShow] = useState(false);
	const [editScenarioTestShow, setEditScenarioTestShow] = useState(false);
	const [editRqa, setEditRqa] =
		useState<RuntimeQualityAnalysisDefinition | null>(null);

	const onScenarioExplorerClick = () =>
		setScenarioExplorerShow((prevState) => !prevState);

	const onEditScenarioTestClick = (rqa: RuntimeQualityAnalysisDefinition) => {
		setEditRqa(rqa);
		setEditScenarioTestShow((prevState) => !prevState);
	};

	const onScenarioTestClick = () =>
		setScenarioTestShow((prevState) => !prevState);

	return (
		<p>Scenario Explorer</p>
		// <>

		// </>
		// 	<div className="taskbar-container">
		// 		<button
		// 			type="button"
		// 			className="change-mode"
		// 			onClick={onChangeModeClick}
		// 		>
		// 			<div>
		// 				<CloudQueueIcon />
		// 			</div>
		// 		</button>
		// 		<button type="button" onClick={onScenarioExplorerClick}>
		// 			<div>
		// 				<EqualizerIcon />
		// 			</div>
		// 		</button>
		// 		<button type="button" onClick={onScenarioTestClick}>
		// 			<div>
		// 				<ContentPasteSearchIcon />
		// 			</div>
		// 		</button>
		// 	</div>

		// 	{scenarioExplorerShow ? (
		// 		<ScenarioExplorer
		// 			selectedEdge={selectedEdge}
		// 			edges={edges}
		// 			onEditScenarioTestClick={onEditScenarioTestClick}
		// 		/>
		// 	) : null}
		// 	{scenarioTestShow ? (
		// 		<div>
		// 			{" "}
		// 			<ScenarioTestController
		// 				selectedEdge={selectedEdge}
		// 				nodes={nodes}
		// 				edges={edges}
		// 				setScenarioExplorerShow={setScenarioExplorerShow}
		// 				setScenarioTestShow={setScenarioTestShow}
		// 			/>{" "}
		// 		</div>
		// 	) : null}
		// 	{editScenarioTestShow && editRqa ? (
		// 		<div>
		// 			{" "}
		// 			<EditScenarioTestMenu
		// 				edges={edges}
		// 				rqa={editRqa}
		// 				setScenarioExplorerShow={setScenarioExplorerShow}
		// 				setScenarioTestShow={setScenarioTestShow}
		// 			/>{" "}
		// 		</div>
		// 	) : null}
	);
}
