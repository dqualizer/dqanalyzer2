import EqualizerIcon from "@mui/icons-material/Equalizer";
import type { Dispatch, SetStateAction } from "react";

export default function ScenarioEditorTaskbar({
  setRqaExplorerShow,
  setShowLoadTestSpecifier,
  setShowResilienceTestSpecifier,
}: {
  setRqaExplorerShow: Dispatch<SetStateAction<boolean>>;
  setShowLoadTestSpecifier: Dispatch<SetStateAction<boolean>>;
  setShowResilienceTestSpecifier: Dispatch<SetStateAction<boolean>>;
}) {
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

      <button type="button">
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
