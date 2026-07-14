import type { EngineeringModel } from "@/engines/analysis";
import { createDocumentationCore } from "@/engines/documentation";
import { createModulesDocumentGenerator } from "./ModulesDocumentGenerator";
import { extractModulesSource } from "./extract-modules-source";
import { validateModulesDocument } from "./validate-modules-document";
import type { GenerateModulesDocumentResult } from "./types";

/**
 * Generate MODULES.md using Documentation Core pipeline + MODULES generator.
 *
 * Flow:
 * 1. Documentation Core accepts/validates Engineering Model
 * 2. Bind immutable DocumentationContext
 * 3. Register MODULES generator contract
 * 4. Generate MODULES.md from Engineering Model only
 * 5. Validate generated document
 */
export function generateModulesDocument(
  model: EngineeringModel,
): GenerateModulesDocumentResult {
  const core = createDocumentationCore();
  const generator = createModulesDocumentGenerator();
  core.registerGenerator(generator);

  const prepared = core.prepare(model);
  if (!prepared.accepted || !prepared.validated || !prepared.context) {
    const reasons =
      prepared.pipeline.blockedReasons.length > 0
        ? prepared.pipeline.blockedReasons.join(" | ")
        : prepared.modelValidation.issues.map((issue) => issue.message).join(" | ");
    throw new Error(
      `Documentation Core rejected Engineering Model for MODULES.md generation: ${reasons}`,
    );
  }

  const readiness = generator.canGenerate(prepared.context);
  if (!readiness.passed) {
    throw new Error(
      `MODULES.md generator readiness failed: ${readiness.issues.join(" | ")}`,
    );
  }

  const output = generator.generate({
    context: prepared.context,
    descriptor: {
      ...generator.descriptor,
      generatorRegistered: true,
    },
  });

  const source = extractModulesSource(model);
  const validation = validateModulesDocument(
    output,
    prepared.context,
    source,
  );

  if (!validation.passed) {
    throw new Error(
      `MODULES.md validation failed: ${validation.issues.join(" | ")}`,
    );
  }

  return {
    output,
    validation,
    modelFingerprint: prepared.context.modelFingerprint,
  };
}
