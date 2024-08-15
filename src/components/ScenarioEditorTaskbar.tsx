import { useSideBarContext } from "@/app/providers/SidebarContext";
import EqualizerIcon from "@mui/icons-material/Equalizer";

export default function ScenarioEditorTaskbar() {
  const {
    rqaExplorerState: [, setRqaExplorerShow],
    loadTestSpecifierState: [, setShowLoadTestSpecifier],
    resilienceTestSpecifierState: [, setShowResilienceTestSpecifier],
    monitoringSpecifierState: [, setShowMonitoringSpecifier],
  } = useSideBarContext();

  return (
    <>
      <button
        type="button"
        onClick={() => setRqaExplorerShow((prevState) => !prevState)}
      >
        <div>
          <EqualizerIcon />
        </div>
      </button>
      <button
        type="button"
        onClick={() => setShowLoadTestSpecifier((prevState) => !prevState)}
      >
        <div className="icon-domain-story-loadtest" />
      </button>

      <button
        type="button"
        onClick={() =>
          setShowMonitoringSpecifier((prevState) => {
            return !prevState;
          })
        }
      >
        <div className="icon-domain-story-monitoring" />
      </button>
      <button
        type="button"
        onClick={() =>
          setShowResilienceTestSpecifier((prevState) => !prevState)
        }
      >
        <div className="icon-domain-story-chaosexperiment" />
      </button>
    </>
  );
}
