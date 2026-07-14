/**
 * Phase 4.2.1 — PROJECT.md Generator
 *
 * Generates PROJECT.md from the Engineering Model only.
 * Uses Documentation Core contracts and pipeline.
 * Does not implement any other document generator.
 */

export {
  ProjectDocumentGenerator,
  createProjectDocumentGenerator,
} from "./ProjectDocumentGenerator";

export { generateProjectDocument } from "./generate-project-document";
export { extractProjectSource } from "./extract-project-source";
export { renderProjectMarkdown } from "./render-project-markdown";
export { validateProjectDocument } from "./validate-project-document";

export type {
  ProjectDocumentSource,
  ProjectDocumentValidationResult,
  GenerateProjectDocumentResult,
} from "./types";
