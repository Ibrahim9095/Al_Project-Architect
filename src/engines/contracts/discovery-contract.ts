/**
 * Official Discovery contract for future engines.
 * Every future engine must consume ONLY NormalizedDiscovery.
 */
export type {
  NormalizedDiscovery,
  DiscoverySchemaVersion,
  NormalizationValidationResult,
} from "../discovery/normalization";

export {
  DISCOVERY_SCHEMA_VERSION,
  normalizeDiscoveryAnswers,
  normalizeDiscoveryJson,
  validateNormalizedDiscovery,
} from "../discovery/normalization";
