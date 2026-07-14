/**
 * Phase 4.2.2 — REQUIREMENTS.md Generator
 *
 * Generates REQUIREMENTS.md from the Engineering Model only.
 * Uses Documentation Core contracts and pipeline.
 * Does not implement any other document generator.
 */

export {
  RequirementsDocumentGenerator,
  createRequirementsDocumentGenerator,
} from "./RequirementsDocumentGenerator";

export { generateRequirementsDocument } from "./generate-requirements-document";
export { extractRequirementsSource } from "./extract-requirements-source";
export { renderRequirementsMarkdown } from "./render-requirements-markdown";
export { validateRequirementsDocument } from "./validate-requirements-document";

export type {
  RequirementsDocumentSource,
  RequirementsDocumentValidationResult,
  GenerateRequirementsDocumentResult,
} from "./types";
