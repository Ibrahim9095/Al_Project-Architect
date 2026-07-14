/**
 * Phase 4.2.5 — DATABASE.md Generator
 *
 * Generates DATABASE.md from the Engineering Model only.
 * Uses Documentation Core contracts and pipeline.
 * Does not implement any other document generator.
 */

export {
  DatabaseDocumentGenerator,
  createDatabaseDocumentGenerator,
} from "./DatabaseDocumentGenerator";

export { generateDatabaseDocument } from "./generate-database-document";
export { extractDatabaseSource } from "./extract-database-source";
export { renderDatabaseMarkdown } from "./render-database-markdown";
export { validateDatabaseDocument } from "./validate-database-document";

export type {
  DatabaseDocumentSource,
  DatabaseDocumentValidationResult,
  GenerateDatabaseDocumentResult,
} from "./types";
