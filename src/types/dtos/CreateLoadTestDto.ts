import { ResponseTime } from "../rqa/definition/enums/ResponseTime";
import { ResultMetrics } from "../rqa/definition/enums/ResultMetrics";
import { LoadProfile } from "../rqa/definition/stimulus/loadprofile/LoadProfile";

export interface CreateLoadTestDto {
  name: string;
  system: string;
  activity: string;
  load_profile: LoadProfile;
  accuracy: number;
  design_Prameters?: any;
  response_time: ResponseTime;
  result_metrics: ResultMetrics[];
}
