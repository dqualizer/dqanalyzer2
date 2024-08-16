import { useSideBarContext } from "@/app/providers/SidebarContext";
import Conditional from "@/components/Conditional";
import { ResilienceTestSpecifier } from "@/components/resilience-test-specifier/ResilienceTestSpecifier";
import { LoadTestSpecifier } from "./loadtest/LoadtestSpecifier";
import MonitoringSpecifier from "./monitoring/MonitoringSpecifier";
import { RqaList } from "./rqaExplorer/RqaList";

export default function ScenarioEditor() {
  const {
    rqaExplorerState: [showRqaExplorer],
    loadTestSpecifierState: [showLoadTestSpecifier],
    resilienceTestSpecifierState: [showResilienceTestSpecifier],
    monitoringSpecifierState: [showMonitoringSpecifier],
  } = useSideBarContext();

  return (
    <>
      <Conditional showWhen={showLoadTestSpecifier}>
        <LoadTestSpecifier />
      </Conditional>
      <Conditional showWhen={showResilienceTestSpecifier}>
        <ResilienceTestSpecifier />
      </Conditional>
      <Conditional showWhen={showRqaExplorer}>
        <RqaList />
      </Conditional>
      <Conditional showWhen={showMonitoringSpecifier}>
        <MonitoringSpecifier />
      </Conditional>
    </>
  );
}
