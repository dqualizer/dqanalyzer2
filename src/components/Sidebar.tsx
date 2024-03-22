import { useRef, useState } from "react";
import { RqaList } from "./rqaExplorer/RqaList";
import { Edge, Node, useOnSelectionChange, useReactFlow } from "reactflow";
import { MarkerType } from "reactflow";
import { hideComponentOnViewportClick } from "../utils/hideComponentOnViewportClick";
import LoadTestSpecifier from "./loadtest/LoadtestSpecifier";
// @ts-expect-error
import ScenarioTestController from "./scenariotest/ScenarioTestController.jsx";
// @ts-expect-error
import ScenarioExplorer from "./scenario_explorer/ScenarioExplorer.jsx";
import { DomainStory } from "../types/dam/domainstory/DomainStory.js";
import { RuntimeQualityAnalysisDefinition } from "../types/rqa/definition/RuntimeQualityAnalysisDefinition";
import "../language/icon/icons.css";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import ContentPasteSearchIcon from "@mui/icons-material/ContentPasteSearch";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import { ResilienceTestSpecifier } from "./resilience-test-specifier/ResilienceTestSpecifier";

import EditScenarioTestMenu from "./EditScenarioTestMenu";

interface SidebarProps {
  domainstory: DomainStory;
  rqas: RuntimeQualityAnalysisDefinition[];
  nodes: Node[];
  edges: Edge[];
}

export default function Sidebar({
  domainstory,
  rqas,
  nodes,
  edges,
}: SidebarProps) {
  const [edgeSelected, setEgdeSelected] = useState(false);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [rqaExplorerShow, setRqaExplorerShow] = useState<boolean>();
  const [showLoadTestSpecifier, setShowLoadTestSpecifier] = useState<boolean>();
  const [showResilienceTestSpecifier, setShowResilienceTestSpecifier] =
    useState<boolean>();
  const [rqaPlayShow, setRqaPlayShow] = useState(false);
  const reactFlowInstance = useReactFlow();
  const loadtestRef = useRef(null);

  const [scenarioMode, setScenarioMode] = useState(true);
  const [scenarioExplorerShow, setScenarioExplorerShow] = useState<boolean>();
  const [scenarioTestShow, setScenarioTestShow] = useState<boolean>();
  const [editScenarioTestShow, setEditScenarioTestShow] = useState<boolean>();
  const [editRqa, setEditRqa] =
    useState<RuntimeQualityAnalysisDefinition | null>(null);

  hideComponentOnViewportClick(loadtestRef, setShowLoadTestSpecifier);

  const selectionChange = useOnSelectionChange({
    onChange: ({ edges }) => {
      if (edges[0]) {
        setSelectedEdge(edges[0]);

        let relatedEdgesArray = reactFlowInstance
          .getEdges()
          .filter((edge) => edge.name == edges[0].name);
        let unrelatedEdgesArray = reactFlowInstance
          .getEdges()
          .filter((edge) => edge.name != edges[0].name);

        let newEdgeArray = [];

        unrelatedEdgesArray.forEach((edge) => {
          edge.animated = false;
          edge.style = {};
          edge.markerStart = {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
          };
        });

        relatedEdgesArray.forEach((edge) => {
          edge.selected = true;
          edge.animated = true;
          edge.style = {
            stroke: "#570FF2",
          };
          edge.markerStart = {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: "#570FF2",
          };
        });

        newEdgeArray = newEdgeArray.concat(
          unrelatedEdgesArray,
          relatedEdgesArray
        );
        reactFlowInstance.setEdges(newEdgeArray);
      } else {
        setSelectedEdge();
        let updatedEdgesArray = reactFlowInstance.getEdges();
        updatedEdgesArray.forEach((edge) => {
          edge.animated = false;
          edge.style = {};
        });
        reactFlowInstance.setEdges(updatedEdgesArray);
      }
    },
  });

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
          <button className="change-mode" onClick={onChangeModeClick}>
            <div>
              <CloudQueueIcon />
            </div>
          </button>
          <button onClick={onScenarioExplorerClick}>
            <div>
              <EqualizerIcon />
            </div>
          </button>
          <button onClick={onScenarioTestClick}>
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
  } else {
    return (
      <div className="sidebar">
        <div className="taskbar-container">
          <button className="change-mode" onClick={onChangeModeClick}>
            <div>
              <CloudOffIcon />
            </div>
          </button>
          <button onClick={onRqaExplorerClick}>
            <div>
              <EqualizerIcon />
            </div>
          </button>
          <button onClick={onClickShowLoadTestSpecifier}>
            <div className="icon-domain-story-loadtest"></div>
          </button>
          <button>
            <div className="icon-domain-story-monitoring"></div>
          </button>
          <button onClick={onClickShowResilienceTestSpecifier}>
            <div className="icon-domain-story-chaosexperiment"></div>
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
          <RqaList loadtestSpecifier={setShowLoadTestSpecifier} />
        )}
      </div>
    );
  }
}
