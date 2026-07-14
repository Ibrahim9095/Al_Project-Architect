/**
 * Documentation Engine public API.
 *
 * Includes:
 * - Documentation Engine orchestrator scaffold
 * - Documentation Core (Phase 4.1)
 *
 * Does not generate Markdown or implement concrete document generators.
 */

export {
  DocumentationEngine,
  documentationEngine,
} from "./documentation.engine";
export {
  DocumentationService,
  documentationService,
} from "./documentation.service";

export {
  DocumentationCore,
  createDocumentationCore,
} from "./DocumentationCore";

export type {
  DocumentTypeId,
  DocumentationContext,
  DocumentationCoreOptions,
  DocumentationCoreResult,
  DocumentationModelValidationResult,
  DocumentationPipelineState,
  DocumentationValidationIssue,
  DocumentDescriptor,
  DocumentPlan,
  TraceabilityMap,
  TraceabilityLink,
  DocumentationArtifactKind,
  DocumentationArtifactRef,
  DocumentationEngineInput,
  DocumentationEngineOutput,
  DocumentationInput,
  DocumentationJob,
  DocumentationJobStatus,
  DocumentationOutput,
  IDocumentationService,
} from "./types";

export type {
  DocumentGenerator,
  DocumentGeneratorInput,
  DocumentGeneratorOutput,
  DocumentGeneratorValidation,
} from "./contracts/index";
export { isDocumentGenerator } from "./contracts/index";

export {
  DOCUMENT_CATALOG,
  CORE_DOCUMENT_TYPES,
  REQUIRED_ENGINEERING_MODEL_SECTIONS,
} from "./constants";

export {
  DocumentRegistry,
  createDocumentRegistry,
  validateEngineeringModelForDocumentation,
  buildDocumentPlan,
  buildTraceabilityMap,
  DOCUMENTATION_PIPELINE_CONTRACT,
  createDocumentationContext,
} from "./services/index";
