import { Satisfaction } from "../rqa/definition/enums/Satisfaction";

export interface CreateResilienceTestDto {
  name: string;
  description: string;
  system_id: string;
  activity_id?: string;
  stimulus_type: string;
  accuracy: number;
  recovery_time?: Satisfaction;
  error_rate?: Satisfaction;
  response_time?: Satisfaction;
}
