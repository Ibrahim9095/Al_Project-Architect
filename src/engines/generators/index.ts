/**
 * Document generators.
 *
 * Phase 4.2.1: PROJECT.md only.
 * Other generators are intentionally not implemented.
 */

export {
  ProjectDocumentGenerator,
  createProjectDocumentGenerator,
  generateProjectDocument,
  extractProjectSource,
  renderProjectMarkdown,
  validateProjectDocument,
} from "./project";

export type {
  ProjectDocumentSource,
  ProjectDocumentValidationResult,
  GenerateProjectDocumentResult,
} from "./project";
