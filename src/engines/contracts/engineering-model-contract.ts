/**
 * Official Engineering Model contract for future engines.
 * Analysis produces this model. Downstream engines may consume it later.
 * This model is INTERNAL — not Markdown documentation and not a repository.
 */
export type {
  AnalysisConfidence,
  ComplexityLevel,
  EngineeringModel,
  EngineeringModelMetadata,
  ProjectClassification,
  ProjectSummary,
  RecommendedTechnologyStack,
} from "../analysis/types";

export { ENGINEERING_MODEL_SCHEMA_VERSION } from "../analysis/schema";
