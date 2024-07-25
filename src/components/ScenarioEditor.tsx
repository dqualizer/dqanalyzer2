import Conditional from "@/components/Conditional";
import LoadTestSpecifier from "@/components/loadtest/LoadtestSpecifier";
import { ResilienceTestSpecifier } from "@/components/resilience-test-specifier/ResilienceTestSpecifier";
import { useState, type Dispatch, type SetStateAction } from "react";
import type { Edge } from "reactflow";
import { RqaList } from "./rqaExplorer/RqaList";

export default function ScenarioEditor({
  showLoadTestSpecifier,
  showResilienceTestSpecifier,
  rqaExplorerShow,
  setShowLoadTestSpecifier,
  setShowResilienceTestSpecifier,
}: {
  showLoadTestSpecifier: boolean;
  showResilienceTestSpecifier: boolean;
  rqaExplorerShow: boolean;
  setShowLoadTestSpecifier: Dispatch<SetStateAction<boolean>>;
  setShowResilienceTestSpecifier: Dispatch<SetStateAction<boolean>>;
}) {
  const [selectedEdge, setSelectedEdge] = useState<Edge | null>(null);

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
    </>
  );
}
