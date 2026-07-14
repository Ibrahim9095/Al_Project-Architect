import type { EngineeringModel } from "@/engines/analysis";
import type { ModulesDocumentSource } from "./types";

/**
 * Extract MODULES.md source data from the Engineering Model only.
 * Does not invent facts outside the model.
 */
export function extractModulesSource(
  model: EngineeringModel,
): ModulesDocumentSource {
  const features = model.features
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((feature) => ({
      id: feature.id,
      name: feature.name,
      relatedModuleIds: [...feature.relatedModuleIds].sort((a, b) =>
        a.localeCompare(b),
      ),
    }));

  const businessRules = model.businessRules
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((rule) => ({
      id: rule.id,
      description: rule.description,
      relatedModuleIds: [...rule.relatedModuleIds].sort((a, b) =>
        a.localeCompare(b),
      ),
    }));

  const databaseCandidates = model.databaseCandidates
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((candidate) => ({
      id: candidate.id,
      name: candidate.name,
      relatedModuleIds: [...candidate.relatedModuleIds].sort((a, b) =>
        a.localeCompare(b),
      ),
    }));

  const apiCandidates = model.apiCandidates
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((candidate) => ({
      id: candidate.id,
      name: candidate.name,
      relatedModuleIds: [...candidate.relatedModuleIds].sort((a, b) =>
        a.localeCompare(b),
      ),
    }));

  const modules = model.modules
    .slice()
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((projectModule) => {
      const relatedFeatureIds = [
        ...new Set([
          ...projectModule.relatedFeatureIds,
          ...features
            .filter((feature) =>
              feature.relatedModuleIds.includes(projectModule.id),
            )
            .map((feature) => feature.id),
        ]),
      ].sort((a, b) => a.localeCompare(b));

      const relatedBusinessRuleIds = businessRules
        .filter((rule) => rule.relatedModuleIds.includes(projectModule.id))
        .map((rule) => rule.id);

      const relatedDatabaseCandidateIds = databaseCandidates
        .filter((candidate) =>
          candidate.relatedModuleIds.includes(projectModule.id),
        )
        .map((candidate) => candidate.id);

      const relatedApiCandidateIds = apiCandidates
        .filter((candidate) =>
          candidate.relatedModuleIds.includes(projectModule.id),
        )
        .map((candidate) => candidate.id);

      return {
        id: projectModule.id,
        name: projectModule.name,
        purpose: projectModule.purpose,
        priority: projectModule.priority,
        source: projectModule.source,
        relatedFeatureIds,
        relatedBusinessRuleIds,
        relatedDatabaseCandidateIds,
        relatedApiCandidateIds,
      };
    });

  return {
    projectId: model.projectSummary.projectId,
    projectName: model.projectSummary.projectName,
    projectType: model.projectSummary.projectType,
    projectTypeLabel: model.projectSummary.projectTypeLabel,
    businessGoal: model.projectSummary.businessGoal,
    complexityLevel: model.complexityLevel,
    businessGoals: [...model.businessGoals],
    modules,
    features,
    businessRules,
    databaseCandidates,
    apiCandidates,
    modelSchemaVersion: model.schemaVersion,
    modelCreatedAt: model.metadata.createdAt,
    analysisConfidence: model.metadata.analysisConfidence,
    warnings: [...model.metadata.warnings],
  };
}
