import type {
  DocumentationContext,
  DocumentGeneratorOutput,
} from "@/engines/documentation";
import type {
  DatabaseDocumentSource,
  DatabaseDocumentValidationResult,
} from "./types";

const REQUIRED_HEADINGS = [
  "# DATABASE.md",
  "# Document Purpose",
  "# Project Context",
  "# Database Structure",
  "# Entities",
  "# Relationships",
  "# Indexes",
  "# Constraints",
  "# Generation Metadata",
] as const;

/**
 * Validate generated DATABASE.md against Engineering Model source of truth.
 */
export function validateDatabaseDocument(
  output: DocumentGeneratorOutput,
  context: DocumentationContext,
  source: DatabaseDocumentSource,
): DatabaseDocumentValidationResult {
  const issues: string[] = [];

  if (output.documentType !== "DATABASE") {
    issues.push(
      `Expected documentType DATABASE, received ${output.documentType}.`,
    );
  }

  if (output.fileName !== "DATABASE.md") {
    issues.push(`Expected fileName DATABASE.md, received ${output.fileName}.`);
  }

  if (!output.markdown || output.markdown.trim().length === 0) {
    issues.push("Generated markdown is empty.");
  }

  if (output.modelFingerprint !== context.modelFingerprint) {
    issues.push("Output model fingerprint does not match DocumentationContext.");
  }

  if (!output.markdown.includes(context.modelFingerprint)) {
    issues.push("Generated markdown does not include the model fingerprint.");
  }

  for (const heading of REQUIRED_HEADINGS) {
    if (!output.markdown.includes(heading)) {
      issues.push(`Missing required heading: ${heading}`);
    }
  }

  if (source.entities.length === 0) {
    issues.push("Engineering Model database candidates are empty.");
  } else {
    for (const entity of source.entities) {
      if (!output.markdown.includes(entity.id)) {
        issues.push(
          `Generated markdown is missing database entity id: ${entity.id}`,
        );
      }
      if (!output.markdown.includes(entity.name)) {
        issues.push(
          `Generated markdown is missing database entity name: ${entity.name}`,
        );
      }
    }
  }

  if (source.modules.length === 0) {
    issues.push("Engineering Model modules are empty.");
  } else {
    for (const projectModule of source.modules) {
      if (!output.markdown.includes(projectModule.id)) {
        issues.push(
          `Generated markdown is missing module id: ${projectModule.id}`,
        );
      }
    }
  }

  for (const relationship of source.relationships) {
    if (!output.markdown.includes(relationship.id)) {
      issues.push(
        `Generated markdown is missing relationship id: ${relationship.id}`,
      );
    }
  }

  for (const index of source.indexes) {
    if (!output.markdown.includes(index.id)) {
      issues.push(`Generated markdown is missing index id: ${index.id}`);
    }
  }

  for (const constraint of source.constraints) {
    if (!output.markdown.includes(constraint.id)) {
      issues.push(
        `Generated markdown is missing constraint id: ${constraint.id}`,
      );
    }
  }

  if (output.sections.length === 0) {
    issues.push("Output sections list is empty.");
  }

  const forbiddenMarkers = [
    "# PROJECT.md",
    "# REQUIREMENTS.md",
    "# BUSINESS_RULES.md",
    "# MODULES.md",
    "# API.md",
    "# TASKS.md",
  ];
  for (const marker of forbiddenMarkers) {
    if (output.markdown.includes(marker)) {
      issues.push(`Generated markdown unexpectedly contains ${marker}.`);
    }
  }

  return {
    passed: issues.length === 0,
    issues,
  };
}
