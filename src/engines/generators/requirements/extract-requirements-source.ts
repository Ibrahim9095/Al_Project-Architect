import type { EngineeringModel } from "@/engines/analysis";
import type { RequirementsDocumentSource } from "./types";

/**
 * Extract REQUIREMENTS.md source data from the Engineering Model only.
 * Does not invent facts outside the model.
 */
export function extractRequirementsSource(
  model: EngineeringModel,
): RequirementsDocumentSource {
  return {
    projectId: model.projectSummary.projectId,
    projectName: model.projectSummary.projectName,
    projectType: model.projectSummary.projectType,
    projectTypeLabel: model.projectSummary.projectTypeLabel,
    businessGoal: model.projectSummary.businessGoal,
    complexityLevel: model.complexityLevel,
    businessGoals: [...model.businessGoals],
    functionalRequirements: model.features
      .slice()
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((feature) => ({
        id: feature.id,
        title: feature.name,
        description: feature.description,
        priority: feature.priority,
        relatedModuleIds: [...feature.relatedModuleIds].sort((a, b) =>
          a.localeCompare(b),
        ),
      })),
    nonFunctionalRequirements: model.nonFunctionalRequirements
      .slice()
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((requirement) => ({
        id: requirement.id,
        category: requirement.category,
        description: requirement.description,
        priority: requirement.priority,
      })),
    securityRequirements: model.securityRequirements
      .slice()
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((requirement) => ({
        id: requirement.id,
        category: requirement.category,
        description: requirement.description,
        priority: requirement.priority,
        rationale: requirement.rationale,
      })),
    userRoles: model.userRoles
      .slice()
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((role) => ({
        id: role.id,
        name: role.name,
        responsibilities: [...role.responsibilities],
      })),
    modules: model.modules
      .slice()
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((projectModule) => ({
        id: projectModule.id,
        name: projectModule.name,
      })),
    modelSchemaVersion: model.schemaVersion,
    modelCreatedAt: model.metadata.createdAt,
    analysisConfidence: model.metadata.analysisConfidence,
    warnings: [...model.metadata.warnings],
  };
}
