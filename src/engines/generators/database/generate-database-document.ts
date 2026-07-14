import type { EngineeringModel } from "@/engines/analysis";
import { createDocumentationCore } from "@/engines/documentation";
import { createDatabaseDocumentGenerator } from "./DatabaseDocumentGenerator";
import { extractDatabaseSource } from "./extract-database-source";
import { validateDatabaseDocument } from "./validate-database-document";
import type { GenerateDatabaseDocumentResult } from "./types";

/**
 * Generate DATABASE.md using Documentation Core pipeline + DATABASE generator.
 *
 * Flow:
 * 1. Documentation Core accepts/validates Engineering Model
 * 2. Bind immutable DocumentationContext
 * 3. Register DATABASE generator contract
 * 4. Generate DATABASE.md from Engineering Model only
 * 5. Validate generated document
 */
export function generateDatabaseDocument(
  model: EngineeringModel,
): GenerateDatabaseDocumentResult {
  const core = createDocumentationCore();
  const generator = createDatabaseDocumentGenerator();
  core.registerGenerator(generator);

  const prepared = core.prepare(model);
  if (!prepared.accepted || !prepared.validated || !prepared.context) {
    const reasons =
      prepared.pipeline.blockedReasons.length > 0
        ? prepared.pipeline.blockedReasons.join(" | ")
        : prepared.modelValidation.issues.map((issue) => issue.message).join(" | ");
    throw new Error(
      `Documentation Core rejected Engineering Model for DATABASE.md generation: ${reasons}`,
    );
  }

  const readiness = generator.canGenerate(prepared.context);
  if (!readiness.passed) {
    throw new Error(
      `DATABASE.md generator readiness failed: ${readiness.issues.join(" | ")}`,
    );
  }

  const output = generator.generate({
    context: prepared.context,
    descriptor: {
      ...generator.descriptor,
      generatorRegistered: true,
    },
  });

  const source = extractDatabaseSource(model);
  const validation = validateDatabaseDocument(
    output,
    prepared.context,
    source,
  );

  if (!validation.passed) {
    throw new Error(
      `DATABASE.md validation failed: ${validation.issues.join(" | ")}`,
    );
  }

  return {
    output,
    validation,
    modelFingerprint: prepared.context.modelFingerprint,
  };
}
