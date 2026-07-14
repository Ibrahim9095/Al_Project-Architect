import {
  DOCUMENT_CATALOG,
  type DocumentGenerator,
  type DocumentGeneratorInput,
  type DocumentGeneratorOutput,
  type DocumentGeneratorValidation,
  type DocumentationContext,
} from "@/engines/documentation";
import type { EngineeringModel } from "@/engines/analysis";
import { extractBusinessRulesSource } from "./extract-business-rules-source";
import { renderBusinessRulesMarkdown } from "./render-business-rules-markdown";
import type { BusinessRulesDocumentSource } from "./types";

/**
 * Phase 4.2.3 — BUSINESS_RULES.md Document Generator.
 *
 * Implements the Documentation Core DocumentGenerator contract.
 * Uses Engineering Model as the only source of truth.
 * Does not generate any other document type.
 */
export class BusinessRulesDocumentGenerator implements DocumentGenerator {
  readonly id = "BUSINESS_RULES" as const;

  readonly descriptor = {
    ...DOCUMENT_CATALOG.BUSINESS_RULES,
    generatorRegistered: true,
  };

  canGenerate(context: DocumentationContext): DocumentGeneratorValidation {
    const issues: string[] = [];
    const model = context.engineeringModel;

    if (context.sourceOfTruth !== "EngineeringModel") {
      issues.push("DocumentationContext source of truth must be EngineeringModel.");
    }

    if (!context.modelFingerprint) {
      issues.push("DocumentationContext model fingerprint is missing.");
    }

    for (const section of this.descriptor.requiredModelSections) {
      const value = model[section as keyof EngineeringModel];
      if (value === undefined || value === null) {
        issues.push(`Required Engineering Model section missing: ${section}`);
        continue;
      }
      if (Array.isArray(value) && value.length === 0) {
        issues.push(`Required Engineering Model section is empty: ${section}`);
      }
    }

    if (!model.projectSummary?.projectName?.trim()) {
      issues.push(
        "projectSummary.projectName is required to generate BUSINESS_RULES.md.",
      );
    }

    return {
      passed: issues.length === 0,
      issues,
    };
  }

  extractSource(model: EngineeringModel): BusinessRulesDocumentSource {
    return extractBusinessRulesSource(model);
  }

  generate(input: DocumentGeneratorInput): DocumentGeneratorOutput {
    const readiness = this.canGenerate(input.context);
    if (!readiness.passed) {
      throw new Error(
        `BUSINESS_RULES.md generator cannot run: ${readiness.issues.join(" | ")}`,
      );
    }

    const source = this.extractSource(input.context.engineeringModel);
    const { markdown, sections } = renderBusinessRulesMarkdown(
      source,
      input.context.modelFingerprint,
    );

    return {
      documentType: "BUSINESS_RULES",
      fileName: this.descriptor.outputFileName,
      markdown,
      sections,
      modelFingerprint: input.context.modelFingerprint,
    };
  }
}

export function createBusinessRulesDocumentGenerator(): BusinessRulesDocumentGenerator {
  return new BusinessRulesDocumentGenerator();
}
