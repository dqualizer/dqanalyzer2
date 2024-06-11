"use client";

import "@/language/icon/icons.css";
import type { DomainStory } from "@/types/dam/domainstory/DomainStory.js";
import type { RuntimeQualityAnalysisDefinition } from "@/types/rqa/definition/RuntimeQualityAnalysisDefinition";
import { hideComponentOnViewportClick } from "@/utils/hideComponentOnViewportClick";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import { useRef, useState } from "react";
import type { Edge, Node } from "reactflow";
import LoadTestSpecifier from "./loadtest/LoadtestSpecifier";
import { ResilienceTestSpecifier } from "./resilience-test-specifier/ResilienceTestSpecifier";
import { RqaList } from "./rqaExplorer/RqaList";
import ScenarioExplorer from "./scenario_explorer/ScenarioExplorer.jsx";
import ScenarioTestController from "./scenariotest/ScenarioTestController.jsx";

import type { DomainArchitectureMapping } from "@/types/dam/dam";
import EditScenarioTestMenu from "./EditScenarioTestMenu";

interface SidebarProps {
	domainstory: DomainStory;
	rqas: RuntimeQualityAnalysisDefinition[];
	nodes: Node[];
	edges: Edge[];
	dam: DomainArchitectureMapping;
}

export default function Sidebar({
	domainstory,
	rqas,
	nodes,
	edges,
	dam,
}: SidebarProps) {
	const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
	const [rqaExplorerShow, setRqaExplorerShow] = useState<boolean>();
	const [showLoadTestSpecifier, setShowLoadTestSpecifier] = useState<boolean>();
	const [showResilienceTestSpecifier, setShowResilienceTestSpecifier] =
		useState<boolean>();
	const loadtestRef = useRef(null);

	const [scenarioMode, setScenarioMode] = useState(true);
	const [scenarioExplorerShow, setScenarioExplorerShow] = useState<boolean>();
	const [scenarioTestShow, setScenarioTestShow] = useState<boolean>();
	const [editScenarioTestShow, setEditScenarioTestShow] = useState<boolean>();
	const [editRqa, setEditRqa] =
		useState<RuntimeQualityAnalysisDefinition | null>(null);

	hideComponentOnViewportClick(loadtestRef, setShowLoadTestSpecifier);

	const onChangeModeClick = () => {
		setScenarioMode((prevState) => !prevState);

		// Hide all possible windows when changing the mode
		setScenarioExplorerShow(false);
		setScenarioTestShow(false);
		setRqaExplorerShow(false);
		setShowLoadTestSpecifier(false);
		setShowResilienceTestSpecifier(false);
	};

	const onScenarioExplorerClick = () =>
		setScenarioExplorerShow((prevState) => !prevState);

	const onEditScenarioTestClick = (rqa: RuntimeQualityAnalysisDefinition) => {
		setEditRqa(rqa);
		setEditScenarioTestShow((prevState) => !prevState);
	};

	const onScenarioTestClick = () =>
		setScenarioTestShow((prevState) => !prevState);

	const onRqaExplorerClick = () =>
		setRqaExplorerShow((prevState) => !prevState);

	const onClickShowLoadTestSpecifier = () =>
		setShowLoadTestSpecifier((prevState) => !prevState);

	const onClickShowResilienceTestSpecifier = () =>
		setShowResilienceTestSpecifier((prevState) => !prevState);

	if (scenarioMode) {
		return (
			<div className="sidebar">
				<div className="taskbar-container">
					<button
						type="button"
						className="change-mode"
						onClick={onChangeModeClick}
					>
						<div>
							<CloudQueueIcon />
						</div>
					</button>
					<button type="button" onClick={onScenarioExplorerClick}>
						<div>
							<EqualizerIcon />
						</div>
					</button>
					<button type="button" onClick={onScenarioTestClick}>
						<div>
							<ContentPasteSearchIcon />
						</div>
					</button>
				</div>

				{scenarioExplorerShow ? (
					<ScenarioExplorer
						selectedEdge={selectedEdge}
						edges={edges}
						onEditScenarioTestClick={onEditScenarioTestClick}
					/>
				) : null}
				{scenarioTestShow ? (
					<div>
						{" "}
						<ScenarioTestController
							selectedEdge={selectedEdge}
							nodes={nodes}
							edges={edges}
							setScenarioExplorerShow={setScenarioExplorerShow}
							setScenarioTestShow={setScenarioTestShow}
						/>{" "}
					</div>
				) : null}
				{editScenarioTestShow && editRqa ? (
					<div>
						{" "}
						<EditScenarioTestMenu
							edges={edges}
							rqa={editRqa}
							setScenarioExplorerShow={setScenarioExplorerShow}
							setScenarioTestShow={setScenarioTestShow}
						/>{" "}
					</div>
				) : null}
			</div>
		);
	}
	return (
		<div className="sidebar">
			<div className="taskbar-container">
				<button
					type="button"
					className="change-mode"
					onClick={onChangeModeClick}
				>
					<div>
						<CloudOffIcon />
					</div>
				</button>
				<button type="button" onClick={onRqaExplorerClick}>
					<div>
						<EqualizerIcon />
					</div>
				</button>
				<button type="button" onClick={onClickShowLoadTestSpecifier}>
					<div className="icon-domain-story-loadtest" />
				</button>
				<button type="button">
					<div className="icon-domain-story-monitoring" />
				</button>
				<button type="button" onClick={onClickShowResilienceTestSpecifier}>
					<div className="icon-domain-story-chaosexperiment" />
				</button>
			</div>
			{showLoadTestSpecifier && (
				<div ref={loadtestRef}>
					<LoadTestSpecifier
						domainstory={domainstory}
						rqas={rqas}
						selectedEdge={selectedEdge}
					/>
				</div>
			)}
			{showResilienceTestSpecifier && (
				<div ref={loadtestRef}>
					<ResilienceTestSpecifier
						domain={domainstory}
						rqas={rqas}
						selectedEdge={selectedEdge}
					/>
				</div>
			)}
			{rqaExplorerShow && (
				<RqaList
					loadTestSpecifier={setShowLoadTestSpecifier}
					resilienceTestSpecifier={setShowResilienceTestSpecifier}
					rqas={rqas}
					domainStory={domainstory}
					dam={dam}
				/>
			)}
		</div>
	);
}
