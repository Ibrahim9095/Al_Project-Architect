/**
 * Document generators.
 *
 * Phase 4.2.1: PROJECT.md
 * Phase 4.2.2: REQUIREMENTS.md
 * Phase 4.2.5: DATABASE.md
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

export {
  RequirementsDocumentGenerator,
  createRequirementsDocumentGenerator,
  generateRequirementsDocument,
  extractRequirementsSource,
  renderRequirementsMarkdown,
  validateRequirementsDocument,
} from "./requirements";

export type {
  RequirementsDocumentSource,
  RequirementsDocumentValidationResult,
  GenerateRequirementsDocumentResult,
} from "./requirements";

export {
  DatabaseDocumentGenerator,
  createDatabaseDocumentGenerator,
  generateDatabaseDocument,
  extractDatabaseSource,
  renderDatabaseMarkdown,
  validateDatabaseDocument,
} from "./database";

export type {
  DatabaseDocumentSource,
  DatabaseDocumentValidationResult,
  GenerateDatabaseDocumentResult,
} from "./database";
