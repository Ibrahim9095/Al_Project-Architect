import type {
  DocumentationContext,
  DocumentGeneratorOutput,
} from "@/engines/documentation";
import type { ProjectDocumentSource, ProjectDocumentValidationResult } from "./types";

const REQUIRED_HEADINGS = [
  "# PROJECT.md",
  "# Project Overview",
  "# Classification",
  "# Goals",
  "# User Roles",
  "# Project Scope",
  "# Technology Stack",
  "# Generation Metadata",
] as const;

/**
 * Validate generated PROJECT.md against Engineering Model source of truth.
 */
export function validateProjectDocument(
  output: DocumentGeneratorOutput,
  context: DocumentationContext,
  source: ProjectDocumentSource,
): ProjectDocumentValidationResult {
  const issues: string[] = [];

  if (output.documentType !== "PROJECT") {
    issues.push(`Expected documentType PROJECT, received ${output.documentType}.`);
  }

  if (output.fileName !== "PROJECT.md") {
    issues.push(`Expected fileName PROJECT.md, received ${output.fileName}.`);
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

  if (!source.projectName.trim()) {
    issues.push("Engineering Model project name is empty.");
  } else if (!output.markdown.includes(source.projectName)) {
    issues.push("Generated markdown does not include the project name.");
  }

  if (!source.complexityLevel) {
    issues.push("Engineering Model complexity level is missing.");
  } else if (!output.markdown.includes(source.complexityLevel)) {
    issues.push("Generated markdown does not include the complexity level.");
  }

  if (source.businessGoals.length === 0) {
    issues.push("Engineering Model business goals are empty.");
  } else {
    for (const goal of source.businessGoals) {
      if (!output.markdown.includes(goal)) {
        issues.push(`Generated markdown is missing business goal: ${goal}`);
      }
    }
  }

  if (source.userRoles.length === 0) {
    issues.push("Engineering Model user roles are empty.");
  } else {
    for (const role of source.userRoles) {
      if (!output.markdown.includes(role.name)) {
        issues.push(`Generated markdown is missing user role: ${role.name}`);
      }
    }
  }

  if (output.sections.length === 0) {
    issues.push("Output sections list is empty.");
  }

  // PROJECT generator must not emit other document bodies.
  const forbiddenMarkers = [
    "# REQUIREMENTS.md",
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
