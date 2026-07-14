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
