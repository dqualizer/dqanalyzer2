"use client";

import "@/language/icon/icons.css";
import type { Edge, Node } from "reactflow";

import Taskbar from "@/components/Taskbar";
import { useState } from "react";
import ScenarioEditor from "./ScenarioEditor";
import ScenarioExplorer from "./ScenarioExplorer";

export default function Sidebar({
  nodes,
  edges,
}: {
  nodes: Node[];
  edges: Edge[];
}) {
  // hideComponentOnViewportClick(loadtestRef, setShowLoadTestSpecifier);
  const [scenarioMode, setScenarioMode] = useState(false);
  const [rqaExplorer, setRqaExplorer] = useState(false);
  const [showLoadTestSpecifier, setShowLoadTestSpecifier] = useState(false);
  const [showResilienceTestSpecifier, setShowResilienceTestSpecifier] =
    useState(false);
  const [showMonitoringSpecifier, setShowMonitoringSpecifier] = useState(false);

  return (
    <div className="sidebar">
      <Taskbar
        scenarioMode={scenarioMode}
        setScenarioMode={setScenarioMode}
        setRqaExplorerShow={setRqaExplorer}
        setShowLoadTestSpecifier={setShowLoadTestSpecifier}
        setShowResilienceTestSpecifier={setShowResilienceTestSpecifier}
        setShowMonitoringSpecifier={setShowMonitoringSpecifier}
      />
      {scenarioMode ? (
        <ScenarioExplorer />
      ) : (
        <ScenarioEditor
          showLoadTestSpecifier={showLoadTestSpecifier}
          showResilienceTestSpecifier={showResilienceTestSpecifier}
          rqaExplorerShow={rqaExplorer}
          showMonitoringSpecifier={showMonitoringSpecifier}
          setShowLoadTestSpecifier={setShowLoadTestSpecifier}
          setShowResilienceTestSpecifier={setShowResilienceTestSpecifier}
        />
      )}
    </div>
  );
}
