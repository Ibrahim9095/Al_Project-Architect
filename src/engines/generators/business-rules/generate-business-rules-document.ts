import type { EngineeringModel } from "@/engines/analysis";
import { createDocumentationCore } from "@/engines/documentation";
import { createBusinessRulesDocumentGenerator } from "./BusinessRulesDocumentGenerator";
import { extractBusinessRulesSource } from "./extract-business-rules-source";
import { validateBusinessRulesDocument } from "./validate-business-rules-document";
import type { GenerateBusinessRulesDocumentResult } from "./types";

/**
 * Generate BUSINESS_RULES.md using Documentation Core pipeline + BUSINESS_RULES generator.
 */
export function generateBusinessRulesDocument(
  model: EngineeringModel,
): GenerateBusinessRulesDocumentResult {
  const core = createDocumentationCore();
  const generator = createBusinessRulesDocumentGenerator();
  core.registerGenerator(generator);

  const prepared = core.prepare(model);
  if (!prepared.accepted || !prepared.validated || !prepared.context) {
    const reasons =
      prepared.pipeline.blockedReasons.length > 0
        ? prepared.pipeline.blockedReasons.join(" | ")
        : prepared.modelValidation.issues.map((issue) => issue.message).join(" | ");
    throw new Error(
      `Documentation Core rejected Engineering Model for BUSINESS_RULES.md generation: ${reasons}`,
    );
  }

  const readiness = generator.canGenerate(prepared.context);
  if (!readiness.passed) {
    throw new Error(
      `BUSINESS_RULES.md generator readiness failed: ${readiness.issues.join(" | ")}`,
    );
  }

  const output = generator.generate({
    context: prepared.context,
    descriptor: {
      ...generator.descriptor,
      generatorRegistered: true,
    },
  });

  const source = extractBusinessRulesSource(model);
  const validation = validateBusinessRulesDocument(
    output,
    prepared.context,
    source,
  );

  if (!validation.passed) {
    throw new Error(
      `BUSINESS_RULES.md validation failed: ${validation.issues.join(" | ")}`,
    );
  }

  return {
    output,
    validation,
    modelFingerprint: prepared.context.modelFingerprint,
  };
}
