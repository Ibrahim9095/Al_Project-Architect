import {
  DOCUMENT_CATALOG,
  type DocumentGenerator,
  type DocumentGeneratorInput,
  type DocumentGeneratorOutput,
  type DocumentGeneratorValidation,
  type DocumentationContext,
} from "@/engines/documentation";
import type { EngineeringModel } from "@/engines/analysis";
import { extractRequirementsSource } from "./extract-requirements-source";
import { renderRequirementsMarkdown } from "./render-requirements-markdown";
import type { RequirementsDocumentSource } from "./types";

/**
 * Phase 4.2.2 — REQUIREMENTS.md Document Generator.
 *
 * Implements the Documentation Core DocumentGenerator contract.
 * Uses Engineering Model as the only source of truth.
 * Does not generate any other document type.
 */
export class RequirementsDocumentGenerator implements DocumentGenerator {
  readonly id = "REQUIREMENTS" as const;

  readonly descriptor = {
    ...DOCUMENT_CATALOG.REQUIREMENTS,
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
        "projectSummary.projectName is required to generate REQUIREMENTS.md.",
      );
    }

    return {
      passed: issues.length === 0,
      issues,
    };
  }

  extractSource(model: EngineeringModel): RequirementsDocumentSource {
    return extractRequirementsSource(model);
  }

  generate(input: DocumentGeneratorInput): DocumentGeneratorOutput {
    const readiness = this.canGenerate(input.context);
    if (!readiness.passed) {
      throw new Error(
        `REQUIREMENTS.md generator cannot run: ${readiness.issues.join(" | ")}`,
      );
    }

    const source = this.extractSource(input.context.engineeringModel);
    const { markdown, sections } = renderRequirementsMarkdown(
      source,
      input.context.modelFingerprint,
    );

    return {
      documentType: "REQUIREMENTS",
      fileName: this.descriptor.outputFileName,
      markdown,
      sections,
      modelFingerprint: input.context.modelFingerprint,
    };
  }
}

export function createRequirementsDocumentGenerator(): RequirementsDocumentGenerator {
  return new RequirementsDocumentGenerator();
}
