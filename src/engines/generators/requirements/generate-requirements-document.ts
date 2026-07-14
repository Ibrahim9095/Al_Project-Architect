import type { EngineeringModel } from "@/engines/analysis";
import { createDocumentationCore } from "@/engines/documentation";
import { createRequirementsDocumentGenerator } from "./RequirementsDocumentGenerator";
import { extractRequirementsSource } from "./extract-requirements-source";
import { validateRequirementsDocument } from "./validate-requirements-document";
import type { GenerateRequirementsDocumentResult } from "./types";

/**
 * Generate REQUIREMENTS.md using Documentation Core pipeline + REQUIREMENTS generator.
 *
 * Flow:
 * 1. Documentation Core accepts/validates Engineering Model
 * 2. Bind immutable DocumentationContext
 * 3. Register REQUIREMENTS generator contract
 * 4. Generate REQUIREMENTS.md from Engineering Model only
 * 5. Validate generated document
 */
export function generateRequirementsDocument(
  model: EngineeringModel,
): GenerateRequirementsDocumentResult {
  const core = createDocumentationCore();
  const generator = createRequirementsDocumentGenerator();
  core.registerGenerator(generator);

  const prepared = core.prepare(model);
  if (!prepared.accepted || !prepared.validated || !prepared.context) {
    const reasons =
      prepared.pipeline.blockedReasons.length > 0
        ? prepared.pipeline.blockedReasons.join(" | ")
        : prepared.modelValidation.issues.map((issue) => issue.message).join(" | ");
    throw new Error(
      `Documentation Core rejected Engineering Model for REQUIREMENTS.md generation: ${reasons}`,
    );
  }

  const readiness = generator.canGenerate(prepared.context);
  if (!readiness.passed) {
    throw new Error(
      `REQUIREMENTS.md generator readiness failed: ${readiness.issues.join(" | ")}`,
    );
  }

  const output = generator.generate({
    context: prepared.context,
    descriptor: {
      ...generator.descriptor,
      generatorRegistered: true,
    },
  });

  const source = extractRequirementsSource(model);
  const validation = validateRequirementsDocument(
    output,
    prepared.context,
    source,
  );

  if (!validation.passed) {
    throw new Error(
      `REQUIREMENTS.md validation failed: ${validation.issues.join(" | ")}`,
    );
  }

  return {
    output,
    validation,
    modelFingerprint: prepared.context.modelFingerprint,
  };
}
