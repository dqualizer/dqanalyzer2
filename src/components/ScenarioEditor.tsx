import Conditional from "@/components/Conditional";
import LoadTestSpecifier from "@/components/loadtest/LoadtestSpecifier";
import { ResilienceTestSpecifier } from "@/components/resilience-test-specifier/ResilienceTestSpecifier";
import { type Dispatch, type SetStateAction, useState } from "react";
import type { Edge } from "reactflow";
import MonitoringSpecifier from "./monitoring/MonitoringSpecifier";
import { RqaList } from "./rqaExplorer/RqaList";

export default function ScenarioEditor({
  showLoadTestSpecifier,
  showResilienceTestSpecifier,
  rqaExplorerShow,
  showMonitoringSpecifier,
  setShowLoadTestSpecifier,
  setShowResilienceTestSpecifier,
}: {
  showLoadTestSpecifier: boolean;
  showResilienceTestSpecifier: boolean;
  rqaExplorerShow: boolean;
  showMonitoringSpecifier: boolean;
  setShowLoadTestSpecifier: Dispatch<SetStateAction<boolean>>;
  setShowResilienceTestSpecifier: Dispatch<SetStateAction<boolean>>;
}) {
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);

  console.log(showMonitoringSpecifier);
  return (
    <>
      <Conditional showWhen={showLoadTestSpecifier}>
        <LoadTestSpecifier selectedEdge={selectedEdge} />
      </Conditional>
      <Conditional showWhen={showResilienceTestSpecifier}>
        <ResilienceTestSpecifier selectedEdge={selectedEdge} />
      </Conditional>
      <Conditional showWhen={rqaExplorerShow}>
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
