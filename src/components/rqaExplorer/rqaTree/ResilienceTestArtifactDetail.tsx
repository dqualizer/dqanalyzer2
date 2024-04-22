import { Artifact } from "../../../types/rqa/definition/loadtest/Artifact";

interface ResilienceTestArtifactDetailProps {
  artifact: Artifact;
}

export function ResilienceTestArtifactDetail({
  artifact,
}: ResilienceTestArtifactDetailProps) {
  return (
    <details>
      <summary>
        <span>Artifact</span>
      </summary>
      <ul>
        <li>
          <span>SystemId: {artifact.system_id}</span>
        </li>
        <li>
          <span>
            ActivityId: {artifact.activity_id ? artifact.activity_id : "-"}
          </span>
        </li>
      </ul>
    </details>
  );
}
