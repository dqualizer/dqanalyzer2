import { useSideBarContext } from "@/app/providers/SidebarContext";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import CloudQueueIcon from "@mui/icons-material/CloudQueue";
import ScenarioEditorTaskbar from "./ScenarioEditorTaskbar";
import ScenarioExplorerTaskbar from "./ScenarioExporerTaskbar";

export default function Taskbar() {
  const {
    scenarioModeState: [showScenarioExplorer, setShowScenarioExplorer],
  } = useSideBarContext();

  return (
    <div className="taskbar-container">
      <button
        type="button"
        className="change-mode"
        onClick={() => setShowScenarioExplorer((prevState) => !prevState)}
      >
        <div>
          {showScenarioExplorer ? <CloudQueueIcon /> : <CloudOffIcon />}
        </div>
      </button>

      {showScenarioExplorer ? (
        <ScenarioExplorerTaskbar />
      ) : (
        <ScenarioEditorTaskbar />
      )}
    </div>
  );
}
