import type { Stimulus } from "@/types/rqa/definition/stimulus/Stimulus";

interface StimulusProps {
  stimulus?: Stimulus | null;
}

export function StimulusDetail({ stimulus }: StimulusProps) {
  return (
    <details>
      <summary>
        <span>Stimulus</span>
      </summary>
      <ul>
        {stimulus?.accuracy !== undefined && stimulus?.accuracy !== null && (
          <li>
            <span>Accuracy: {stimulus?.accuracy}</span>
          </li>
        )}
        {stimulus?.workload?.type !== undefined &&
          stimulus?.workload?.type !== null && (
            <li>
              <span>Workload Type: {stimulus?.workload?.type}</span>
            </li>
          )}
      </ul>
    </details>
  );
}
