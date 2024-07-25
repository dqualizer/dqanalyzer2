import type { ResilienceStimulus } from "@/types/rqa/definition/resiliencetest/stimulus/ResilienceStimulus";
import type { UnavailabilityStimulus } from "@/types/rqa/definition/resiliencetest/stimulus/UnavailabilityStimulus";

interface ResilienceTestStimulusProps {
  stimulus?: ResilienceStimulus | UnavailabilityStimulus | null;
}

export function ResilienceTestStimulusDetail({
  stimulus,
}: ResilienceTestStimulusProps) {
  return (
    <details>
      <summary>
        <span>Stimulus</span>
      </summary>
      <ul>
        {stimulus &&
          Object.entries(stimulus).map(([key, value]) => {
            return (
              <li key={key}>
                <span className="capitalize">
                  {key}: {value}
                </span>
              </li>
            );
          })}
      </ul>
    </details>
  );
}
