/**
 * Documentation Core public API — Phase 4.1
 *
 * Accepts Engineering Model, validates it, prepares pipeline/contracts.
 * Does not generate Markdown or implement concrete document generators.
 */

export {
  DocumentationCore,
  createDocumentationCore,
} from "./DocumentationCore.js";

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
} from "./types.js";

export type {
  DocumentGenerator,
  DocumentGeneratorInput,
  DocumentGeneratorOutput,
  DocumentGeneratorValidation,
} from "./contracts/index.js";
export { isDocumentGenerator } from "./contracts/index.js";

export {
  DOCUMENT_CATALOG,
  CORE_DOCUMENT_TYPES,
  REQUIRED_ENGINEERING_MODEL_SECTIONS,
} from "./constants.js";

export {
  DocumentRegistry,
  createDocumentRegistry,
  validateEngineeringModelForDocumentation,
  buildDocumentPlan,
  buildTraceabilityMap,
  DOCUMENTATION_PIPELINE_CONTRACT,
  createDocumentationContext,
} from "./services/index.js";
