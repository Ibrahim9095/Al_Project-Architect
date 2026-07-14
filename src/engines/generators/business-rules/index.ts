/**
 * Phase 4.2.3 — BUSINESS_RULES.md Generator
 *
 * Generates BUSINESS_RULES.md from the Engineering Model only.
 * Uses Documentation Core contracts and pipeline.
 * Does not implement any other document generator.
 */

export {
  BusinessRulesDocumentGenerator,
  createBusinessRulesDocumentGenerator,
} from "./BusinessRulesDocumentGenerator";

export { generateBusinessRulesDocument } from "./generate-business-rules-document";
export { extractBusinessRulesSource } from "./extract-business-rules-source";
export { renderBusinessRulesMarkdown } from "./render-business-rules-markdown";
export { validateBusinessRulesDocument } from "./validate-business-rules-document";

export type {
  BusinessRulesDocumentSource,
  BusinessRulesDocumentValidationResult,
  GenerateBusinessRulesDocumentResult,
} from "./types";
