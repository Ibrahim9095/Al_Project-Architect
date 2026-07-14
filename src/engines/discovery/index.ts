export type {
  DiscoveryCompletionResult,
  DiscoveryEngineInput,
  DiscoveryEngineOutput,
  DiscoveryInput,
  DiscoveryOutput,
  DiscoverySession,
  DiscoverySessionStatus,
  IDiscoveryService,
} from "./types";

export type {
  DiscoveryAnswers,
  DiscoveryJson,
  DiscoveryQuestion,
  DiscoveryStepDefinition,
  DiscoveryValidationResult,
  ProjectTypeDefinition,
} from "./catalog";

export type {
  DiscoverySchemaVersion,
  NormalizationValidationResult,
  NormalizedApi,
  NormalizedApiResource,
  NormalizedBusinessRule,
  NormalizedDatabase,
  NormalizedDatabaseEntity,
  NormalizedDeployment,
  NormalizedDiscovery,
  NormalizedDiscoveryMetadata,
  NormalizedIntegration,
  NormalizedNamedItem,
  NormalizedProject,
  NormalizedUi,
} from "./normalization";

export {
  buildDiscoveryJson,
  buildDiscoverySteps,
  getProjectTypeDefinition,
  listProjectTypes,
  PROJECT_TYPE_DEFINITIONS,
  validateCompleteDiscovery,
  validateDiscoveryStep,
} from "./catalog";

export {
  DISCOVERY_SCHEMA_VERSION,
  createDiscoverySchemaDefaults,
  createEmptyNormalizedDiscovery,
  normalizeDiscoveryAnswers,
  normalizeDiscoveryJson,
  validateNormalizedDiscovery,
} from "./normalization";

export {
  DiscoveryService,
  discoveryService,
  discoveryWorkflow,
} from "./discovery.service";
export { DiscoveryEngine, discoveryEngine } from "./discovery.engine";
