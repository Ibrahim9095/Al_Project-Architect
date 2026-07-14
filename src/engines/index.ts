export type {
  EngineContext,
  EngineId,
  EngineResult,
  EngineResultStatus,
  EngineService,
  PlatformEngine,
} from "./types";

export { createNotImplementedResult } from "./types";
export { assertEngineContext, blockedCapability } from "./shared";

export {
  DiscoveryEngine,
  DiscoveryService,
  discoveryEngine,
  discoveryService,
  discoveryWorkflow,
  buildDiscoveryJson,
  buildDiscoverySteps,
  getProjectTypeDefinition,
  listProjectTypes,
  PROJECT_TYPE_DEFINITIONS,
  validateCompleteDiscovery,
  validateDiscoveryStep,
  DISCOVERY_SCHEMA_VERSION,
  createDiscoverySchemaDefaults,
  createEmptyNormalizedDiscovery,
  normalizeDiscoveryAnswers,
  normalizeDiscoveryJson,
  validateNormalizedDiscovery,
} from "./discovery";
export type {
  DiscoveryAnswers,
  DiscoveryCompletionResult,
  DiscoveryEngineInput,
  DiscoveryEngineOutput,
  DiscoveryInput,
  DiscoveryJson,
  DiscoveryOutput,
  DiscoveryQuestion,
  DiscoverySession,
  DiscoverySessionStatus,
  DiscoveryStepDefinition,
  DiscoveryValidationResult,
  IDiscoveryService,
  ProjectTypeDefinition,
  DiscoverySchemaVersion,
  NormalizationValidationResult,
  NormalizedDiscovery,
} from "./discovery";

/** Future engines should import the Discovery contract from `@/engines/contracts`. */

export {
  AnalysisEngine,
  AnalysisService,
  analysisEngine,
  analysisService,
  buildEngineeringModel,
  validateAnalysisInput,
  ENGINEERING_MODEL_SCHEMA_VERSION,
} from "./analysis";
export type {
  AnalysisEngineInput,
  AnalysisEngineOutput,
  AnalysisValidationResult,
  ComplexityLevel,
  EngineeringModel,
  IAnalysisService,
} from "./analysis";

export { classificationEngine } from "./classification";

export {
  DocumentationEngine,
  DocumentationService,
  documentationEngine,
  documentationService,
  DocumentationCore,
  createDocumentationCore,
  validateEngineeringModelForDocumentation,
  DOCUMENTATION_PIPELINE_CONTRACT,
} from "./documentation";
export type {
  DocumentationArtifactKind,
  DocumentationArtifactRef,
  DocumentationEngineInput,
  DocumentationEngineOutput,
  DocumentationInput,
  DocumentationJob,
  DocumentationJobStatus,
  DocumentationOutput,
  IDocumentationService,
  DocumentationCoreResult,
  DocumentationContext,
} from "./documentation";

export {
  RepositoryEngine,
  RepositoryService,
  repositoryEngine,
  repositoryService,
} from "./repository";
export type {
  IRepositoryService,
  RepositoryComplexity,
  RepositoryEngineInput,
  RepositoryEngineOutput,
  RepositoryInput,
  RepositoryJobStatus,
  RepositoryOutput,
  RepositoryPlan,
} from "./repository";

export {
  ExportEngine,
  ExportService,
  exportEngine,
  exportService,
} from "./export";
export type {
  ExportEngineInput,
  ExportEngineOutput,
  ExportFormat,
  ExportInput,
  ExportJobStatus,
  ExportManifest,
  ExportOutput,
  IExportService,
} from "./export";

/** Phase 4.2.1 — PROJECT.md generator. */
export {
  ProjectDocumentGenerator,
  createProjectDocumentGenerator,
  generateProjectDocument,
} from "./generators";
export type {
  ProjectDocumentSource,
  ProjectDocumentValidationResult,
  GenerateProjectDocumentResult,
} from "./generators";

/** Phase 4.2.2 — REQUIREMENTS.md generator. */
export {
  RequirementsDocumentGenerator,
  createRequirementsDocumentGenerator,
  generateRequirementsDocument,
} from "./generators";
export type {
  RequirementsDocumentSource,
  RequirementsDocumentValidationResult,
  GenerateRequirementsDocumentResult,
} from "./generators";

/** Phase 4.2.5 — DATABASE.md generator. */
export {
  DatabaseDocumentGenerator,
  createDatabaseDocumentGenerator,
  generateDatabaseDocument,
} from "./generators";
export type {
  DatabaseDocumentSource,
  DatabaseDocumentValidationResult,
  GenerateDatabaseDocumentResult,
} from "./generators";
