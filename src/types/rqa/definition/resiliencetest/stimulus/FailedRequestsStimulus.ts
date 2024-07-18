import type { ResilienceStimulus } from "./ResilienceStimulus";

export interface FailedRequestsStimulus extends ResilienceStimulus {
  type: "FAILED_REQUESTS";
}
