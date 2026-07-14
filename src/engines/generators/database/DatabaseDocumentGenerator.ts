import {
  DOCUMENT_CATALOG,
  type DocumentGenerator,
  type DocumentGeneratorInput,
  type DocumentGeneratorOutput,
  type DocumentGeneratorValidation,
  type DocumentationContext,
} from "@/engines/documentation";
import type { EngineeringModel } from "@/engines/analysis";
import { extractDatabaseSource } from "./extract-database-source";
import { renderDatabaseMarkdown } from "./render-database-markdown";
import type { DatabaseDocumentSource } from "./types";

/**
 * Phase 4.2.5 — DATABASE.md Document Generator.
 *
 * Implements the Documentation Core DocumentGenerator contract.
 * Uses Engineering Model as the only source of truth.
 * Does not generate any other document type.
 */
export class DatabaseDocumentGenerator implements DocumentGenerator {
  readonly id = "DATABASE" as const;

  readonly descriptor = {
    ...DOCUMENT_CATALOG.DATABASE,
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
        "projectSummary.projectName is required to generate DATABASE.md.",
      );
    }

    return {
      passed: issues.length === 0,
      issues,
    };
  }

  extractSource(model: EngineeringModel): DatabaseDocumentSource {
    return extractDatabaseSource(model);
  }

  generate(input: DocumentGeneratorInput): DocumentGeneratorOutput {
    const readiness = this.canGenerate(input.context);
    if (!readiness.passed) {
      throw new Error(
        `DATABASE.md generator cannot run: ${readiness.issues.join(" | ")}`,
      );
    }

    const source = this.extractSource(input.context.engineeringModel);
    const { markdown, sections } = renderDatabaseMarkdown(
      source,
      input.context.modelFingerprint,
    );

    return {
      documentType: "DATABASE",
      fileName: this.descriptor.outputFileName,
      markdown,
      sections,
      modelFingerprint: input.context.modelFingerprint,
    };
  }
}

export function createDatabaseDocumentGenerator(): DatabaseDocumentGenerator {
  return new DatabaseDocumentGenerator();
}
