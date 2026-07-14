import type { ProjectDocumentSource } from "./types";

function bulletList(items: string[], emptyLabel: string): string {
  if (items.length === 0) {
    return `- ${emptyLabel}`;
  }
  return items.map((item) => `- ${item}`).join("\n");
}

function joinOrNone(items: string[]): string {
  return items.length > 0 ? items.join(", ") : "None recorded in Engineering Model";
}

/**
 * Render PROJECT.md markdown from extracted Engineering Model source.
 * Deterministic: same source always produces the same markdown.
 * Follows templates/PROJECT.md structure for sections that have model data.
 */
export function renderProjectMarkdown(
  source: ProjectDocumentSource,
  modelFingerprint: string,
): { markdown: string; sections: string[] } {
  const sections = [
    "Project Overview",
    "Classification",
    "Goals",
    "User Roles",
    "Project Scope",
    "Supported Platforms",
    "Languages",
    "Technology Stack",
    "External Integrations",
    "Project Modules",
    "Risks",
    "Related Documents",
    "Generation Metadata",
  ];

  const roleRows =
    source.userRoles.length === 0
      ? "| None recorded | None recorded |"
      : source.userRoles
          .map((role) => {
            const description =
              role.responsibilities.length > 0
                ? role.responsibilities.join("; ")
                : role.accessScope || "No responsibilities recorded";
            return `| ${role.name} | ${description} |`;
          })
          .join("\n");

  const moduleList =
    source.modules.length === 0
      ? "- None recorded in Engineering Model"
      : source.modules
          .map(
            (module) =>
              `- ${module.name} (\`${module.id}\`) — ${module.purpose} [priority: ${module.priority}]`,
          )
          .join("\n");

  const featureList =
    source.features.length === 0
      ? "- None recorded in Engineering Model"
      : source.features
          .map(
            (feature) =>
              `- ${feature.name} (\`${feature.id}\`) — ${feature.description} [priority: ${feature.priority}]`,
          )
          .join("\n");

  const integrationList =
    source.externalIntegrations.length === 0
      ? "- None recorded in Engineering Model"
      : source.externalIntegrations
          .map(
            (integration) =>
              `- ${integration.name} (\`${integration.id}\`) — ${integration.purpose} [status: ${integration.status}]`,
          )
          .join("\n");

  const riskList =
    source.risks.length === 0
      ? "- None recorded in Engineering Model"
      : source.risks
          .map(
            (risk) =>
              `- **${risk.title}** (\`${risk.id}\`) — severity: ${risk.severity}\n  - ${risk.description}\n  - Mitigation: ${risk.mitigation}`,
          )
          .join("\n");

  const markdown = `# PROJECT.md

Version: 1.0.0

Status: Generated

Source Of Truth: Engineering Model

Model Fingerprint: ${modelFingerprint}

Engineering Model Schema Version: ${source.modelSchemaVersion}

---

# Project Overview

## Project Name

${source.projectName || "Unnamed project"}

---

## Project Type

${source.projectTypeLabel || source.projectType || "Unspecified"}

---

## Project Description

${source.businessGoal || "No business goal recorded in Engineering Model."}

---

## Project Identity

- Project ID: \`${source.projectId || "unknown"}\`
- Project Type ID: \`${source.projectType || "unknown"}\`

---

# Classification

- Complexity Level: \`${source.complexityLevel}\`
- Domain: ${source.classificationDomain}
- Category: ${source.classificationCategory}
- Engineering Complexity Score: ${source.engineeringComplexityScore}

## Classification Rationale

${bulletList(source.classificationRationale, "No classification rationale recorded.")}

---

# Goals

## Primary Goals

${bulletList(source.businessGoals, "No business goals recorded in Engineering Model.")}

---

# User Roles

| Role | Description |
|------|-------------|
${roleRows}

---

# Project Scope

## Included Features

${featureList}

## Project Modules

${moduleList}

---

# Supported Platforms

${bulletList(source.uiPlatforms, "No platforms recorded in Engineering Model.")}

---

# Languages

${bulletList(source.languages, "No languages recorded in Engineering Model.")}

---

# Technology Stack

## Frontend

${joinOrNone(source.technologyStack.frontend)}

## Backend

${joinOrNone(source.technologyStack.backend)}

## Database

${joinOrNone(source.technologyStack.database)}

## Infrastructure

${joinOrNone(source.technologyStack.infrastructure)}

## AI Services

${joinOrNone(source.technologyStack.aiServices)}

## Deployment

- Strategy: ${source.deploymentStrategy || "undetermined"}
- Environments: ${joinOrNone(source.deploymentEnvironments)}

---

# External Integrations

${integrationList}

---

# Project Modules

${moduleList}

---

# Risks

${riskList}

---

# Related Documents

- REQUIREMENTS.md
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

AI Project Architect — Phase 4.2.1 PROJECT.md Generator

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
