import CloudOffIcon from "@mui/icons-material/CloudOff";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import type { Dispatch, SetStateAction } from "react";
import ScenarioEditorTaskbar from "./ScenarioEditorTaskbar";
import ScenarioExplorerTaskbar from "./ScenarioExporerTaskbar";

export default function Taskbar({
  scenarioMode,
  setScenarioMode,
  setRqaExplorerShow,
  setShowLoadTestSpecifier,
  setShowResilienceTestSpecifier,
  setShowMonitoringSpecifier,
}: {
  scenarioMode: boolean;
  setScenarioMode: Dispatch<SetStateAction<boolean>>;
  setRqaExplorerShow: Dispatch<SetStateAction<boolean>>;
  setShowLoadTestSpecifier: Dispatch<SetStateAction<boolean>>;
  setShowResilienceTestSpecifier: Dispatch<SetStateAction<boolean>>;
  setShowMonitoringSpecifier: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="taskbar-container">
      <button
        type="button"
        className="change-mode"
        onClick={() => setScenarioMode((prevState) => !prevState)}
      >
        <div>{scenarioMode ? <CloudQueueIcon /> : <CloudOffIcon />}</div>
      </button>
  return (
    <div className="taskbar-container">
      <button
        type="button"
        className="change-mode"
        onClick={() => setScenarioMode((prevState) => !prevState)}
      >
        <div>{scenarioMode ? <CloudQueueIcon /> : <CloudOffIcon />}</div>
      </button>

      {scenarioMode ? (
        <ScenarioExplorerTaskbar />
      ) : (
        <ScenarioEditorTaskbar
          {...{
            setRqaExplorerShow,
            setShowLoadTestSpecifier,
            setShowResilienceTestSpecifier,
            setShowMonitoringSpecifier,
          }}
        />
      )}
    </div>
  );
}
