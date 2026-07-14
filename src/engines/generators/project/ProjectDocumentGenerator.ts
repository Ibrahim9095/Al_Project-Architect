import {
  DOCUMENT_CATALOG,
  type DocumentGenerator,
  type DocumentGeneratorInput,
  type DocumentGeneratorOutput,
  type DocumentGeneratorValidation,
  type DocumentationContext,
} from "@/engines/documentation";
import type { EngineeringModel } from "@/engines/analysis";
import { extractProjectSource } from "./extract-project-source";
import { renderProjectMarkdown } from "./render-project-markdown";
import type { ProjectDocumentSource } from "./types";

/**
 * Phase 4.2.1 — PROJECT.md Document Generator.
 *
 * Implements the Documentation Core DocumentGenerator contract.
 * Uses Engineering Model as the only source of truth.
 * Does not generate any other document type.
 */
export class ProjectDocumentGenerator implements DocumentGenerator {
  readonly id = "PROJECT" as const;

  readonly descriptor = {
    ...DOCUMENT_CATALOG.PROJECT,
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
      if (typeof value === "string" && value.trim().length === 0) {
        issues.push(`Required Engineering Model section is empty: ${section}`);
      }
    }

    if (!model.projectSummary?.projectName?.trim()) {
      issues.push("projectSummary.projectName is required to generate PROJECT.md.");
    }

    return {
      passed: issues.length === 0,
      issues,
    };
  }

  extractSource(model: EngineeringModel): ProjectDocumentSource {
    return extractProjectSource(model);
  }

  generate(input: DocumentGeneratorInput): DocumentGeneratorOutput {
    const readiness = this.canGenerate(input.context);
    if (!readiness.passed) {
      throw new Error(
        `PROJECT.md generator cannot run: ${readiness.issues.join(" | ")}`,
      );
    }

    const source = this.extractSource(input.context.engineeringModel);
    const { markdown, sections } = renderProjectMarkdown(
      source,
      input.context.modelFingerprint,
    );

    return {
      documentType: "PROJECT",
      fileName: this.descriptor.outputFileName,
      markdown,
      sections,
      modelFingerprint: input.context.modelFingerprint,
    };
  }
}

export function createProjectDocumentGenerator(): ProjectDocumentGenerator {
  return new ProjectDocumentGenerator();
}
