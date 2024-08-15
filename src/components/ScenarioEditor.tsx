import { useSideBarContext } from "@/app/providers/SidebarContext";
import Conditional from "@/components/Conditional";
import LoadTestSpecifier from "@/components/loadtest/LoadtestSpecifier";
import { ResilienceTestSpecifier } from "@/components/resilience-test-specifier/ResilienceTestSpecifier";
import { useState } from "react";
import type { Edge } from "reactflow";
import MonitoringSpecifier from "./monitoring/MonitoringSpecifier";
import { RqaList } from "./rqaExplorer/RqaList";

export default function ScenarioEditor() {
  const {
    rqaExplorerState: [showRqaExplorer],
    loadTestSpecifierState: [showLoadTestSpecifier, setShowLoadTestSpecifier],
    resilienceTestSpecifierState: [
      showResilienceTestSpecifier,
      setShowResilienceTestSpecifier,
    ],
    monitoringSpecifierState: [showMonitoringSpecifier],
  } = useSideBarContext();

  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);

  return (
    <>
      <Conditional showWhen={showLoadTestSpecifier}>
        <LoadTestSpecifier selectedEdge={selectedEdge} />
      </Conditional>
      <Conditional showWhen={showResilienceTestSpecifier}>
        <ResilienceTestSpecifier selectedEdge={selectedEdge} />
      </Conditional>
      <Conditional showWhen={showRqaExplorer}>
        <RqaList
          loadTestSpecifier={setShowLoadTestSpecifier}
          resilienceTestSpecifier={setShowResilienceTestSpecifier}
        />
      </Conditional>
      <Conditional showWhen={showMonitoringSpecifier}>
        <MonitoringSpecifier />
      </Conditional>
    </>
  );
}
