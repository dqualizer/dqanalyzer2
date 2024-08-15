"use client";

import "@/language/icon/icons.css";

import {
  SideBarProvider,
  useSideBarContext,
} from "@/app/providers/SidebarContext";
import ScenarioEditor from "./ScenarioEditor";
import ScenarioExplorer from "./ScenarioExplorer";
import Taskbar from "./Taskbar";

export default function Sidebar() {
  const {
    scenarioModeState: [showScenarioExplorer],
  } = useSideBarContext();

  return (
    <div className="sidebar">
      <SideBarProvider>
        <Taskbar />
        {showScenarioExplorer ? <ScenarioExplorer /> : <ScenarioEditor />}
      </SideBarProvider>
    </div>
  );
}
