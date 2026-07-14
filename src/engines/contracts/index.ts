export type {
  DiscoverySchemaVersion,
  NormalizationValidationResult,
  NormalizedDiscovery,
} from "./discovery-contract";

export {
  DISCOVERY_SCHEMA_VERSION,
  normalizeDiscoveryAnswers,
  normalizeDiscoveryJson,
  validateNormalizedDiscovery,
} from "./discovery-contract";

export type {
  AnalysisConfidence,
  ComplexityLevel,
  EngineeringModel,
  EngineeringModelMetadata,
  ProjectClassification,
  ProjectSummary,
  RecommendedTechnologyStack,
} from "./engineering-model-contract";

export { ENGINEERING_MODEL_SCHEMA_VERSION } from "./engineering-model-contract";
