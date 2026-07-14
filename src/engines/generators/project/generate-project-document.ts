import type { EngineeringModel } from "@/engines/analysis";
import { createDocumentationCore } from "@/engines/documentation";
import { createProjectDocumentGenerator } from "./ProjectDocumentGenerator";
import { extractProjectSource } from "./extract-project-source";
import { validateProjectDocument } from "./validate-project-document";
import type { GenerateProjectDocumentResult } from "./types";

/**
 * Generate PROJECT.md using Documentation Core pipeline + PROJECT generator.
 *
 * Flow:
 * 1. Documentation Core accepts/validates Engineering Model
 * 2. Bind immutable DocumentationContext
 * 3. Register PROJECT generator contract
 * 4. Generate PROJECT.md from Engineering Model only
 * 5. Validate generated document
 */
export function generateProjectDocument(
  model: EngineeringModel,
): GenerateProjectDocumentResult {
  const core = createDocumentationCore();
  const generator = createProjectDocumentGenerator();
  core.registerGenerator(generator);

  const prepared = core.prepare(model);
  if (!prepared.accepted || !prepared.validated || !prepared.context) {
    const reasons =
      prepared.pipeline.blockedReasons.length > 0
        ? prepared.pipeline.blockedReasons.join(" | ")
        : prepared.modelValidation.issues.map((issue) => issue.message).join(" | ");
    throw new Error(
      `Documentation Core rejected Engineering Model for PROJECT.md generation: ${reasons}`,
    );
  }

  const readiness = generator.canGenerate(prepared.context);
  if (!readiness.passed) {
    throw new Error(
      `PROJECT.md generator readiness failed: ${readiness.issues.join(" | ")}`,
    );
  }

  const output = generator.generate({
    context: prepared.context,
    descriptor: {
      ...generator.descriptor,
      generatorRegistered: true,
    },
  });

  const source = extractProjectSource(model);
  const validation = validateProjectDocument(output, prepared.context, source);

  if (!validation.passed) {
    throw new Error(
      `PROJECT.md validation failed: ${validation.issues.join(" | ")}`,
    );
  }

  return {
    output,
    validation,
    modelFingerprint: prepared.context.modelFingerprint,
  };
}
