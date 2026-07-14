import type { ModulesDocumentSource } from "./types";

function bulletList(items: string[], emptyLabel: string): string {
  if (items.length === 0) {
    return `- ${emptyLabel}`;
  }
  return items.map((item) => `- ${item}`).join("\n");
}

function idList(ids: string[], emptyLabel: string): string {
  if (ids.length === 0) {
    return emptyLabel;
  }
  return ids.map((id) => `\`${id}\``).join(", ");
}

/**
 * Render MODULES.md markdown from extracted Engineering Model source.
 * Deterministic: same source always produces the same markdown.
 * Aligns with templates/MODULES.md intent and DOCUMENT_CATALOG.MODULES.
 */
export function renderModulesMarkdown(
  source: ModulesDocumentSource,
  modelFingerprint: string,
): { markdown: string; sections: string[] } {
  const sections = [
    "Document Purpose",
    "Project Context",
    "Business Goals",
    "Module Catalog",
    "Modules By Priority",
    "Traceability",
    "Related Documents",
    "Generation Metadata",
  ];

  const moduleBlocks =
    source.modules.length === 0
      ? "_No modules recorded in Engineering Model._"
      : source.modules
          .map((projectModule) => {
            return `### ${projectModule.id} — ${projectModule.name}

- Purpose: ${projectModule.purpose}
- Priority: \`${projectModule.priority}\`
- Source: \`${projectModule.source}\`
- Related Features: ${idList(projectModule.relatedFeatureIds, "None recorded")}
- Related Business Rules: ${idList(projectModule.relatedBusinessRuleIds, "None recorded")}
- Related Database Candidates: ${idList(projectModule.relatedDatabaseCandidateIds, "None recorded")}
- Related API Candidates: ${idList(projectModule.relatedApiCandidateIds, "None recorded")}`;
          })
          .join("\n\n");

  const priorities = ["must", "should", "could", "won't"] as const;
  const priorityBlocks = priorities
    .map((priority) => {
      const modules = source.modules.filter(
        (projectModule) => projectModule.priority === priority,
      );
      const list =
        modules.length === 0
          ? "- None"
          : modules
              .map(
                (projectModule) =>
                  `- \`${projectModule.id}\` — ${projectModule.name}`,
              )
              .join("\n");
      return `### ${priority}

${list}`;
    })
    .join("\n\n");

  const featureCoverage =
    source.features.length === 0
      ? "- None recorded in Engineering Model"
      : source.features
          .map((feature) => {
            const modules =
              feature.relatedModuleIds.length > 0
                ? feature.relatedModuleIds.map((id) => `\`${id}\``).join(", ")
                : "None recorded";
            return `- ${feature.name} (\`${feature.id}\`) → ${modules}`;
          })
          .join("\n");

  const ruleCoverage =
    source.businessRules.length === 0
      ? "- None recorded in Engineering Model"
      : source.businessRules
          .map((rule) => {
            const modules =
              rule.relatedModuleIds.length > 0
                ? rule.relatedModuleIds.map((id) => `\`${id}\``).join(", ")
                : "None recorded";
            return `- \`${rule.id}\` — ${rule.description} → ${modules}`;
          })
          .join("\n");

  const markdown = `# MODULES.md

Version: 1.0.0

Status: Generated

Source Of Truth: Engineering Model

Model Fingerprint: ${modelFingerprint}

Engineering Model Schema Version: ${source.modelSchemaVersion}

---

# Document Purpose

This document defines the Module Architecture Specification derived from the validated Engineering Model for **${source.projectName || "Unnamed project"}**.

Modules divide the software into logical business components. Each module has a single responsibility and represents one business capability.

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

# Module Catalog

Modules are derived from Engineering Model module candidates.

${moduleBlocks}

---

# Modules By Priority

${priorityBlocks}

---

# Traceability

## Feature Coverage

${featureCoverage}

## Business Rule Coverage

${ruleCoverage}

## Module Counts

- Total Modules: ${source.modules.length}
- Must: ${source.modules.filter((projectModule) => projectModule.priority === "must").length}
- Should: ${source.modules.filter((projectModule) => projectModule.priority === "should").length}
- Could: ${source.modules.filter((projectModule) => projectModule.priority === "could").length}
- Won't: ${source.modules.filter((projectModule) => projectModule.priority === "won't").length}
- Features Referenced: ${source.features.length}
- Business Rules Referenced: ${source.businessRules.length}
- Database Candidates Referenced: ${source.databaseCandidates.length}
- API Candidates Referenced: ${source.apiCandidates.length}

---

# Related Documents

- PROJECT.md
- REQUIREMENTS.md
- BUSINESS_RULES.md
- DATABASE.md
- API.md
- TASKS.md
- README.md
- AGENTS.md

---

# Generation Metadata

Generated By

AI Project Architect — Phase 4.2.4 MODULES.md Generator

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
