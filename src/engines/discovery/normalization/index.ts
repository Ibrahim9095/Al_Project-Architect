export {
  DISCOVERY_SCHEMA_VERSION,
  type DiscoverySchemaVersion,
  type NormalizationValidationResult,
  type NormalizedApi,
  type NormalizedApiResource,
  type NormalizedBusinessRule,
  type NormalizedDatabase,
  type NormalizedDatabaseEntity,
  type NormalizedDeployment,
  type NormalizedDiscovery,
  type NormalizedDiscoveryMetadata,
  type NormalizedIntegration,
  type NormalizedNamedItem,
  type NormalizedProject,
  type NormalizedUi,
} from "./schema";

export {
  createDiscoverySchemaDefaults,
  createEmptyNormalizedDiscovery,
} from "./defaults";

export {
  normalizeDiscoveryAnswers,
  normalizeDiscoveryJson,
} from "./normalize";

export { validateNormalizedDiscovery } from "./validate";
