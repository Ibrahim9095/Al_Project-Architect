/**
 * Reusable contract for future document generators.
 *
 * Phase 4.1 registers the contract only.
 * No concrete PROJECT/REQUIREMENTS/... generators are implemented.
 */

import type { EngineeringModel } from "../../analysis/types";
import type {
  DocumentationContext,
  DocumentDescriptor,
  DocumentTypeId,
} from "../types";

/**
 * Input every future generator must accept.
 * The Engineering Model (via DocumentationContext) is the single source of truth.
 */
export interface DocumentGeneratorInput {
  context: DocumentationContext;
  descriptor: DocumentDescriptor;
}

/**
 * Output contract for future generators.
 * Core itself never produces these artifacts in Phase 4.1.
 */
export interface DocumentGeneratorOutput {
  documentType: DocumentTypeId;
  fileName: string;
  /**
   * Markdown body — produced only by future generators, never by Core.
   */
  markdown: string;
  sections: string[];
  modelFingerprint: string;
}

export interface DocumentGeneratorValidation {
  passed: boolean;
  issues: string[];
}

/**
 * Contract that every future document generator must implement.
 */
export interface DocumentGenerator {
  readonly id: DocumentTypeId;
  readonly descriptor: DocumentDescriptor;

  /**
   * Confirm the generator can operate on the bound Engineering Model.
   */
  canGenerate(context: DocumentationContext): DocumentGeneratorValidation;

  /**
   * Extract only the Engineering Model slices required by this document.
   * Must not invent facts outside the model.
   */
  extractSource(model: EngineeringModel): unknown;

  /**
   * Generate Markdown from the DocumentationContext.
   * Not invoked by Documentation Core in Phase 4.1.
   */
  generate(input: DocumentGeneratorInput): DocumentGeneratorOutput;
}

/**
 * Type guard for registered generator contracts.
 */
export function isDocumentGenerator(value: unknown): value is DocumentGenerator {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<DocumentGenerator>;
  return (
    typeof candidate.id === "string" &&
    typeof candidate.canGenerate === "function" &&
    typeof candidate.extractSource === "function" &&
    typeof candidate.generate === "function" &&
    candidate.descriptor !== undefined
  );
}
