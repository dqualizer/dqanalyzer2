import type { Identifiable } from "@/types/Identifiable";
import type { RuntimeQualityAnalysis } from "./RuntimeQualityAnalysis";
import type { Environment } from "./enums/Environment";

export interface RuntimeQualityAnalysisDefinition extends Identifiable {
  [key: string]: any;
  name: string;
  version: string;
  domain_id: string;
  context: string;
  environment: Environment;
  runtime_quality_analysis: RuntimeQualityAnalysis;
}
