import type {
  DocumentationContext,
  DocumentGeneratorOutput,
} from "@/engines/documentation";
import type {
  RequirementsDocumentSource,
  RequirementsDocumentValidationResult,
} from "./types";

const REQUIRED_HEADINGS = [
  "# REQUIREMENTS.md",
  "# Document Purpose",
  "# Project Context",
  "# Functional Requirements",
  "# Non-Functional Requirements",
  "# Security Requirements",
  "# Generation Metadata",
] as const;

/**
 * Validate generated REQUIREMENTS.md against Engineering Model source of truth.
 */
export function validateRequirementsDocument(
  output: DocumentGeneratorOutput,
  context: DocumentationContext,
  source: RequirementsDocumentSource,
): RequirementsDocumentValidationResult {
  const issues: string[] = [];

  if (output.documentType !== "REQUIREMENTS") {
    issues.push(
      `Expected documentType REQUIREMENTS, received ${output.documentType}.`,
    );
  }

  if (output.fileName !== "REQUIREMENTS.md") {
    issues.push(`Expected fileName REQUIREMENTS.md, received ${output.fileName}.`);
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

  if (source.functionalRequirements.length === 0) {
    issues.push("Engineering Model features (functional requirements) are empty.");
  } else {
    for (const requirement of source.functionalRequirements) {
      if (!output.markdown.includes(requirement.id)) {
        issues.push(`Generated markdown is missing feature id: ${requirement.id}`);
      }
      if (!output.markdown.includes(requirement.title)) {
        issues.push(
          `Generated markdown is missing feature title: ${requirement.title}`,
        );
      }
    }
  }

  if (source.nonFunctionalRequirements.length === 0) {
    issues.push("Engineering Model non-functional requirements are empty.");
  } else {
    for (const requirement of source.nonFunctionalRequirements) {
      if (!output.markdown.includes(requirement.id)) {
        issues.push(`Generated markdown is missing NFR id: ${requirement.id}`);
      }
    }
  }

  for (const requirement of source.securityRequirements) {
    if (!output.markdown.includes(requirement.id)) {
      issues.push(
        `Generated markdown is missing security requirement id: ${requirement.id}`,
      );
    }
  }

  if (output.sections.length === 0) {
    issues.push("Output sections list is empty.");
  }

  const forbiddenMarkers = [
    "# PROJECT.md",
    "# BUSINESS_RULES.md",
    "# MODULES.md",
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
