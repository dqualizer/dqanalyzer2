import { Satisfaction } from "../rqa/definition/enums/Satisfaction";

export interface CreateResilienceTestDto {
  name: string;
  description: string;
  system_id: string;
  activity_id?: string;
  stimulus_type: "UNAVAILABILITY" | "LATE_RESPONSES" | "FAILED_REQUESTS";
  accuracy: number;
  pause_before_triggering_seconds: number;
  experiment_duration_seconds: number;
  delay_min_milliseconds?: number;
  delay_max_milliseconds?: number;
  injection_frequency?: number;
  recovery_time?: Satisfaction;
  error_rate?: Satisfaction;
  response_time?: Satisfaction;
}
