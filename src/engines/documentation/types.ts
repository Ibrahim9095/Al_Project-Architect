/**
 * Documentation Core types.
 *
 * Phase 4.1 — Core only.
 * No Markdown generation.
 * No concrete document generators.
 */

import type { EngineeringModel } from "../analysis/types.js";

/**
 * Canonical document identities future generators will implement.
 * Descriptors only — no generation in Documentation Core.
 */
export type DocumentTypeId =
  | "PROJECT"
  | "REQUIREMENTS"
  | "BUSINESS_RULES"
  | "MODULES"
  | "DATABASE"
  | "API"
  | "TASKS"
  | "VISION"
  | "SCOPE"
  | "PERSONAS"
  | "TESTING"
  | "ROADMAP"
  | "CHANGELOG";

export type DocumentationPipelineStageId =
  | "accept_engineering_model"
  | "validate_engineering_model"
  | "bind_source_of_truth"
  | "select_document_plan"
  | "verify_generator_contracts"
  | "build_traceability_map"
  | "approve_pipeline_readiness";

export type DocumentationPipelineStageStatus =
  | "pending"
  | "completed"
  | "blocked"
  | "skipped";

export interface DocumentationValidationIssue {
  code: string;
  section: string;
  message: string;
  severity: "Critical" | "High" | "Medium" | "Low";
}

export interface DocumentationModelValidationResult {
  passed: boolean;
  issues: DocumentationValidationIssue[];
  checkedSections: string[];
}

/**
 * Bound documentation context.
 * Engineering Model is the single source of truth for all future generators.
 */
export interface DocumentationContext {
  readonly sourceOfTruth: "EngineeringModel";
  readonly engineeringModel: Readonly<EngineeringModel>;
  readonly boundAt: string;
  readonly modelFingerprint: string;
}

export interface DocumentDescriptor {
  id: DocumentTypeId;
  title: string;
  responsibility: string;
  requiredModelSections: string[];
  templateName?: string;
  outputFileName: string;
  /**
   * Generators are not implemented in Phase 4.1.
   * This flag records whether a generator contract is registered.
   */
  generatorRegistered: boolean;
}

export interface DocumentPlan {
  documents: DocumentDescriptor[];
  selectedForComplexity: DocumentTypeId[];
  deferredGeneratorIds: DocumentTypeId[];
}

export interface TraceabilityLink {
  modelSection: string;
  documentType: DocumentTypeId;
  artifactIds: string[];
}

export interface TraceabilityMap {
  links: TraceabilityLink[];
  unmappedModelSections: string[];
}

export interface DocumentationPipelineStage {
  id: DocumentationPipelineStageId;
  name: string;
  status: DocumentationPipelineStageStatus;
  detail?: string;
}

export interface DocumentationPipelineState {
  stages: DocumentationPipelineStage[];
  currentStage: DocumentationPipelineStageId | null;
  readyForGenerators: boolean;
  blockedReasons: string[];
}

/**
 * Result of Documentation Core preparation.
 * Explicitly contains no generated Markdown and no document contents.
 */
export interface DocumentationCoreResult {
  accepted: boolean;
  validated: boolean;
  context: DocumentationContext | null;
  modelValidation: DocumentationModelValidationResult;
  plan: DocumentPlan | null;
  traceability: TraceabilityMap | null;
  pipeline: DocumentationPipelineState;
  /**
   * Always empty in Phase 4.1 — Core must not generate documents.
   */
  generatedDocuments: [];
  preparedAt: string;
}

export interface DocumentationCoreOptions {
  /**
   * When true, require generator contracts to be registered before readiness.
   * Default false in Phase 4.1 because generators are intentionally absent.
   */
  requireRegisteredGenerators?: boolean;
}
