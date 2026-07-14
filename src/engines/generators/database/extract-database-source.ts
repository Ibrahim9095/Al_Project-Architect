import type { EngineeringModel } from "@/engines/analysis";
import type { DatabaseDocumentSource } from "./types";

/**
 * Extract DATABASE.md source data from the Engineering Model only.
 * Indexes and constraints are derived deterministically from entity/relationship
 * candidates already present in the model — no invented business columns.
 */
export function extractDatabaseSource(
  model: EngineeringModel,
): DatabaseDocumentSource {
  const modules = model.modules
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((projectModule) => ({
      id: projectModule.id,
      name: projectModule.name,
    }));

  const sortedCandidates = model.databaseCandidates
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id));

  const entities = sortedCandidates.map((candidate) => ({
    id: candidate.id,
    name: candidate.name,
    entityType: candidate.entityType,
    description: candidate.description,
    status: candidate.status,
    relatedModuleIds: [...candidate.relatedModuleIds].sort((a, b) =>
      a.localeCompare(b),
    ),
  }));

  const entityIds = new Set(entities.map((entity) => entity.id));
  const userEntityId = entityIds.has("entity-user") ? "entity-user" : null;

  const relationships = entities
    .filter((entity) => entity.entityType === "relationship")
    .map((entity) => {
      const relatedEntityIds = [
        ...entity.relatedModuleIds
          .map((moduleId) => {
            const moduleEntity = entities.find(
              (candidate) =>
                candidate.entityType === "module" &&
                (candidate.id === `${moduleId}-entity` ||
                  candidate.relatedModuleIds.includes(moduleId)),
            );
            return moduleEntity?.id;
          })
          .filter((id): id is string => Boolean(id)),
        ...(userEntityId ? [userEntityId] : []),
      ].sort((a, b) => a.localeCompare(b));

      return {
        id: entity.id,
        name: entity.name,
        description: entity.description,
        status: entity.status,
        relatedModuleIds: [...entity.relatedModuleIds],
        relatedEntityIds: [...new Set(relatedEntityIds)].sort((a, b) =>
          a.localeCompare(b),
        ),
      };
    });

  const indexes = entities
    .flatMap((entity) => {
      const primary = {
        id: `idx-pk-${entity.id}`,
        name: `pk_${entity.name}`,
        entityId: entity.id,
        purpose: `Primary identity index for entity ${entity.name}.`,
        source: "derived-from-entity-identity",
      };

      if (entity.entityType !== "relationship") {
        return [primary];
      }

      const relationshipIndexes = entity.relatedModuleIds.map((moduleId) => ({
        id: `idx-rel-${entity.id}-${moduleId}`,
        name: `idx_${entity.name}_${moduleId}`,
        entityId: entity.id,
        purpose: `Lookup index for relationship ${entity.name} by module ${moduleId}.`,
        source: "derived-from-relationship-candidate",
      }));

      return [primary, ...relationshipIndexes];
    })
    .sort((a, b) => a.id.localeCompare(b.id));

  const constraints = entities
    .flatMap((entity) => {
      const primaryKey = {
        id: `cst-pk-${entity.id}`,
        name: `pk_${entity.name}`,
        entityId: entity.id,
        constraintType: "primary_key",
        description: `Primary key constraint on ${entity.name} identity.`,
        source: "derived-from-entity-identity",
      };

      if (entity.entityType !== "relationship") {
        return [primaryKey];
      }

      const relationship = relationships.find(
        (candidate) => candidate.id === entity.id,
      );
      const foreignKeys = (relationship?.relatedEntityIds ?? []).map(
        (relatedEntityId) => ({
          id: `cst-fk-${entity.id}-${relatedEntityId}`,
          name: `fk_${entity.name}_${relatedEntityId}`,
          entityId: entity.id,
          constraintType: "foreign_key",
          description: `Referential integrity candidate from ${entity.name} to ${relatedEntityId}.`,
          source: "derived-from-relationship-candidate",
        }),
      );

      return [primaryKey, ...foreignKeys];
    })
    .sort((a, b) => a.id.localeCompare(b.id));

  return {
    projectId: model.projectSummary.projectId,
    projectName: model.projectSummary.projectName,
    projectType: model.projectSummary.projectType,
    projectTypeLabel: model.projectSummary.projectTypeLabel,
    businessGoal: model.projectSummary.businessGoal,
    complexityLevel: model.complexityLevel,
    businessGoals: [...model.businessGoals],
    modules,
    entities,
    relationships,
    indexes,
    constraints,
    modelSchemaVersion: model.schemaVersion,
    modelCreatedAt: model.metadata.createdAt,
    analysisConfidence: model.metadata.analysisConfidence,
    warnings: [...model.metadata.warnings],
  };
}
