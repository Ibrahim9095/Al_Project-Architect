/**
 * Phase 4.2.4 — MODULES.md Generator
 *
 * Generates MODULES.md from the Engineering Model only.
 * Uses Documentation Core contracts and pipeline.
 * Does not implement any other document generator.
 */

export {
  ModulesDocumentGenerator,
  createModulesDocumentGenerator,
} from "./ModulesDocumentGenerator";

export { generateModulesDocument } from "./generate-modules-document";
export { extractModulesSource } from "./extract-modules-source";
export { renderModulesMarkdown } from "./render-modules-markdown";
export { validateModulesDocument } from "./validate-modules-document";

export type {
  ModulesDocumentSource,
  ModulesDocumentValidationResult,
  GenerateModulesDocumentResult,
} from "./types";
