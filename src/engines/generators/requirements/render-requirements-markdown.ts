import type { RequirementsDocumentSource } from "./types";

function bulletList(items: string[], emptyLabel: string): string {
  if (items.length === 0) {
    return `- ${emptyLabel}`;
  }
  return items.map((item) => `- ${item}`).join("\n");
}

/**
 * Render REQUIREMENTS.md markdown from extracted Engineering Model source.
 * Deterministic: same source always produces the same markdown.
 * Aligns with templates/REQUIREMENTS.md and DOCUMENT_CATALOG.REQUIREMENTS.
 */
export function renderRequirementsMarkdown(
  source: RequirementsDocumentSource,
  modelFingerprint: string,
): { markdown: string; sections: string[] } {
  const sections = [
    "Document Purpose",
    "Project Context",
    "Business Goals",
    "User Roles",
    "Functional Requirements",
    "Non-Functional Requirements",
    "Security Requirements",
    "Traceability",
    "Related Documents",
    "Generation Metadata",
  ];

  const functionalBlocks =
    source.functionalRequirements.length === 0
      ? "_No functional requirements recorded in Engineering Model._"
      : source.functionalRequirements
          .map((requirement) => {
            const modules =
              requirement.relatedModuleIds.length > 0
                ? requirement.relatedModuleIds
                    .map((id) => `\`${id}\``)
                    .join(", ")
                : "None recorded";
            return `### ${requirement.id} — ${requirement.title}

- Priority: \`${requirement.priority}\`
- Category: Functional
- Description: ${requirement.description}
- Related Modules: ${modules}`;
          })
          .join("\n\n");

  const nfrBlocks =
    source.nonFunctionalRequirements.length === 0
      ? "_No non-functional requirements recorded in Engineering Model._"
      : source.nonFunctionalRequirements
          .map(
            (requirement) => `### ${requirement.id} — ${requirement.category}

- Priority: \`${requirement.priority}\`
- Category: Non-Functional / ${requirement.category}
- Description: ${requirement.description}`,
          )
          .join("\n\n");

  const securityBlocks =
    source.securityRequirements.length === 0
      ? "_No security requirements recorded in Engineering Model._"
      : source.securityRequirements
          .map(
            (requirement) => `### ${requirement.id} — ${requirement.category}

- Priority: \`${requirement.priority}\`
- Category: Security / ${requirement.category}
- Description: ${requirement.description}
- Rationale: ${requirement.rationale}`,
          )
          .join("\n\n");

  const roleList =
    source.userRoles.length === 0
      ? "- None recorded in Engineering Model"
      : source.userRoles
          .map((role) => {
            const responsibilities =
              role.responsibilities.length > 0
                ? role.responsibilities.join("; ")
                : "No responsibilities recorded";
            return `- ${role.name} (\`${role.id}\`) — ${responsibilities}`;
          })
          .join("\n");

  const moduleList =
    source.modules.length === 0
      ? "- None recorded in Engineering Model"
      : source.modules
          .map((projectModule) => `- ${projectModule.name} (\`${projectModule.id}\`)`)
          .join("\n");

  const markdown = `# REQUIREMENTS.md

Version: 1.0.0

Status: Generated

Source Of Truth: Engineering Model

Model Fingerprint: ${modelFingerprint}

Engineering Model Schema Version: ${source.modelSchemaVersion}

---

# Document Purpose

This document defines the Software Requirements Specification derived from the validated Engineering Model for **${source.projectName || "Unnamed project"}**.

Requirements describe what the system must do. They do not prescribe implementation details.

---

# Project Context

- Project ID: \`${source.projectId || "unknown"}\`
- Project Name: ${source.projectName || "Unnamed project"}
- Project Type: ${source.projectTypeLabel || source.projectType || "Unspecified"}
- Complexity Level: \`${source.complexityLevel}\`
- Business Goal: ${source.businessGoal || "No business goal recorded in Engineering Model."}

---

# Business Goals

${bulletList(source.businessGoals, "No business goals recorded in Engineering Model.")}

---

# User Roles

${roleList}

---

# Functional Requirements

Functional requirements are derived from Engineering Model features.

${functionalBlocks}

---

# Non-Functional Requirements

Non-functional requirements are derived from Engineering Model non-functional requirement candidates.

${nfrBlocks}

---

# Security Requirements

Security requirements are derived from Engineering Model security requirement candidates.

${securityBlocks}

---

# Traceability

## Modules Referenced

${moduleList}

## Requirement Counts

- Functional Requirements: ${source.functionalRequirements.length}
- Non-Functional Requirements: ${source.nonFunctionalRequirements.length}
- Security Requirements: ${source.securityRequirements.length}

---

# Related Documents

- PROJECT.md
- BUSINESS_RULES.md
- MODULES.md
- DATABASE.md
- API.md
- TASKS.md
- README.md
- AGENTS.md

---

# Generation Metadata

Generated By

AI Project Architect — Phase 4.2.2 REQUIREMENTS.md Generator

Generation Date

${source.modelCreatedAt}

Analysis Confidence

${source.analysisConfidence}

Model Warnings

${bulletList(source.warnings, "None")}

Status

Generated from Engineering Model
`;

  return { markdown, sections };
}
