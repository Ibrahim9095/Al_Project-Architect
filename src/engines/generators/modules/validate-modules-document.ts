import type {
  DocumentationContext,
  DocumentGeneratorOutput,
} from "@/engines/documentation";
import type {
  ModulesDocumentSource,
  ModulesDocumentValidationResult,
} from "./types";

const REQUIRED_HEADINGS = [
  "# MODULES.md",
  "# Document Purpose",
  "# Project Context",
  "# Module Catalog",
  "# Modules By Priority",
  "# Generation Metadata",
] as const;

/**
 * Validate generated MODULES.md against Engineering Model source of truth.
 */
export function validateModulesDocument(
  output: DocumentGeneratorOutput,
  context: DocumentationContext,
  source: ModulesDocumentSource,
): ModulesDocumentValidationResult {
  const issues: string[] = [];

  if (output.documentType !== "MODULES") {
    issues.push(
      `Expected documentType MODULES, received ${output.documentType}.`,
    );
  }

  if (output.fileName !== "MODULES.md") {
    issues.push(`Expected fileName MODULES.md, received ${output.fileName}.`);
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

  if (source.modules.length === 0) {
    issues.push("Engineering Model modules are empty.");
  } else {
    for (const projectModule of source.modules) {
      if (!output.markdown.includes(projectModule.id)) {
        issues.push(
          `Generated markdown is missing module id: ${projectModule.id}`,
        );
      }
      if (!output.markdown.includes(projectModule.name)) {
        issues.push(
          `Generated markdown is missing module name: ${projectModule.name}`,
        );
      }
      if (!output.markdown.includes(projectModule.purpose)) {
        issues.push(
          `Generated markdown is missing module purpose: ${projectModule.purpose}`,
        );
      }
    }
  }

  if (source.features.length === 0) {
    issues.push("Engineering Model features are empty.");
  } else {
    for (const feature of source.features) {
      if (!output.markdown.includes(feature.id)) {
        issues.push(
          `Generated markdown is missing feature id: ${feature.id}`,
        );
      }
    }
  }

  if (output.sections.length === 0) {
    issues.push("Output sections list is empty.");
  }

  const forbiddenMarkers = [
    "# PROJECT.md",
    "# REQUIREMENTS.md",
    "# BUSINESS_RULES.md",
    "# DATABASE.md",
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
