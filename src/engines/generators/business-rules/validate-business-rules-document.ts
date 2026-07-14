import type {
  DocumentationContext,
  DocumentGeneratorOutput,
} from "@/engines/documentation";
import type {
  BusinessRulesDocumentSource,
  BusinessRulesDocumentValidationResult,
} from "./types";

const REQUIRED_HEADINGS = [
  "# BUSINESS_RULES.md",
  "# Document Purpose",
  "# Project Context",
  "# Business Rules",
  "# Rules By Status",
  "# Generation Metadata",
] as const;

/**
 * Validate generated BUSINESS_RULES.md against Engineering Model source of truth.
 */
export function validateBusinessRulesDocument(
  output: DocumentGeneratorOutput,
  context: DocumentationContext,
  source: BusinessRulesDocumentSource,
): BusinessRulesDocumentValidationResult {
  const issues: string[] = [];

  if (output.documentType !== "BUSINESS_RULES") {
    issues.push(
      `Expected documentType BUSINESS_RULES, received ${output.documentType}.`,
    );
  }

  if (output.fileName !== "BUSINESS_RULES.md") {
    issues.push(
      `Expected fileName BUSINESS_RULES.md, received ${output.fileName}.`,
    );
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

  if (source.businessRules.length === 0) {
    issues.push("Engineering Model business rules are empty.");
  } else {
    for (const rule of source.businessRules) {
      if (!output.markdown.includes(rule.id)) {
        issues.push(`Generated markdown is missing business rule id: ${rule.id}`);
      }
      if (!output.markdown.includes(rule.description)) {
        issues.push(
          `Generated markdown is missing business rule description: ${rule.description}`,
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
