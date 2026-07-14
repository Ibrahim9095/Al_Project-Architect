import type { DatabaseDocumentSource } from "./types";

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
 * Render DATABASE.md markdown from extracted Engineering Model source.
 * Deterministic: same source always produces the same markdown.
 * Aligns with templates/DATABASE.md intent and DOCUMENT_CATALOG.DATABASE.
 */
export function renderDatabaseMarkdown(
  source: DatabaseDocumentSource,
  modelFingerprint: string,
): { markdown: string; sections: string[] } {
  const sections = [
    "Document Purpose",
    "Project Context",
    "Business Goals",
    "Database Structure",
    "Entities",
    "Relationships",
    "Indexes",
    "Constraints",
    "Traceability",
    "Related Documents",
    "Generation Metadata",
  ];

  const entityBlocks =
    source.entities.length === 0
      ? "_No database entity candidates recorded in Engineering Model._"
      : source.entities
          .map((entity) => {
            return `### ${entity.id} — ${entity.name}

- Entity Type: \`${entity.entityType}\`
- Status: \`${entity.status}\`
- Description: ${entity.description}
- Related Modules: ${idList(entity.relatedModuleIds, "None recorded")}`;
          })
          .join("\n\n");

  const entityTypes = ["core", "module", "relationship", "audit"] as const;
  const entityTypeBlocks = entityTypes
    .map((entityType) => {
      const entities = source.entities.filter(
        (entity) => entity.entityType === entityType,
      );
      const list =
        entities.length === 0
          ? "- None"
          : entities
              .map((entity) => `- \`${entity.id}\` — ${entity.name}`)
              .join("\n");
      return `### ${entityType}

${list}`;
    })
    .join("\n\n");

  const relationshipBlocks =
    source.relationships.length === 0
      ? "_No relationship candidates recorded in Engineering Model._"
      : source.relationships
          .map((relationship) => {
            return `### ${relationship.id} — ${relationship.name}

- Status: \`${relationship.status}\`
- Description: ${relationship.description}
- Related Modules: ${idList(relationship.relatedModuleIds, "None recorded")}
- Related Entities: ${idList(relationship.relatedEntityIds, "None recorded")}`;
          })
          .join("\n\n");

  const indexBlocks =
    source.indexes.length === 0
      ? "_No index candidates derived from Engineering Model._"
      : source.indexes
          .map((index) => {
            return `### ${index.id} — ${index.name}

- Entity: \`${index.entityId}\`
- Purpose: ${index.purpose}
- Source: \`${index.source}\``;
          })
          .join("\n\n");

  const constraintBlocks =
    source.constraints.length === 0
      ? "_No constraint candidates derived from Engineering Model._"
      : source.constraints
          .map((constraint) => {
            return `### ${constraint.id} — ${constraint.name}

- Entity: \`${constraint.entityId}\`
- Type: \`${constraint.constraintType}\`
- Description: ${constraint.description}
- Source: \`${constraint.source}\``;
          })
          .join("\n\n");

  const moduleCoverage =
    source.modules.length === 0
      ? "- None recorded in Engineering Model"
      : source.modules
          .map((projectModule) => {
            const relatedEntities = source.entities.filter((entity) =>
              entity.relatedModuleIds.includes(projectModule.id),
            );
            const entityList =
              relatedEntities.length > 0
                ? relatedEntities
                    .map((entity) => `\`${entity.id}\``)
                    .join(", ")
                : "None recorded";
            return `- ${projectModule.name} (\`${projectModule.id}\`) → ${entityList}`;
          })
          .join("\n");

  const markdown = `# DATABASE.md

Version: 1.0.0

Status: Generated

Source Of Truth: Engineering Model

Model Fingerprint: ${modelFingerprint}

Engineering Model Schema Version: ${source.modelSchemaVersion}

---

# Document Purpose

This document defines the Database Architecture Specification derived from the validated Engineering Model for **${source.projectName || "Unnamed project"}**.

Database structure is described as engineering candidates. Implementation details are not invented beyond deterministic derivation from Engineering Model database candidates.

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

# Database Structure

Database objects are derived from Engineering Model \`databaseCandidates\` and related \`modules\`.

## Structure Summary

- Entities: ${source.entities.length}
- Relationships: ${source.relationships.length}
- Indexes: ${source.indexes.length}
- Constraints: ${source.constraints.length}
- Modules Referenced: ${source.modules.length}

---

# Entities

${entityBlocks}

---

# Entities By Type

${entityTypeBlocks}

---

# Relationships

${relationshipBlocks}

---

# Indexes

Index candidates are derived deterministically from entity identity and relationship candidates.

${indexBlocks}

---

# Constraints

Constraint candidates are derived deterministically from entity identity and relationship candidates.

${constraintBlocks}

---

# Traceability

## Module Coverage

${moduleCoverage}

## Database Counts

- Total Entities: ${source.entities.length}
- Core: ${source.entities.filter((entity) => entity.entityType === "core").length}
- Module: ${source.entities.filter((entity) => entity.entityType === "module").length}
- Relationship: ${source.entities.filter((entity) => entity.entityType === "relationship").length}
- Audit: ${source.entities.filter((entity) => entity.entityType === "audit").length}
- Indexes: ${source.indexes.length}
- Constraints: ${source.constraints.length}

---

# Related Documents

- PROJECT.md
- REQUIREMENTS.md
- BUSINESS_RULES.md
- MODULES.md
- API.md
- TASKS.md
- README.md
- AGENTS.md

---

# Generation Metadata

Generated By

AI Project Architect — Phase 4.2.5 DATABASE.md Generator

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
