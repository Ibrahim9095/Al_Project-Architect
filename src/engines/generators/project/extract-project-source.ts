import type { EngineeringModel } from "@/engines/analysis";
import type { ProjectDocumentSource } from "./types";

function sortedStrings(values: string[]): string[] {
  return [...values].sort((a, b) => a.localeCompare(b));
}

/**
 * Extract PROJECT.md source data from the Engineering Model only.
 * Does not invent facts outside the model.
 */
export function extractProjectSource(
  model: EngineeringModel,
): ProjectDocumentSource {
  return {
    projectId: model.projectSummary.projectId,
    projectName: model.projectSummary.projectName,
    projectType: model.projectSummary.projectType,
    projectTypeLabel: model.projectSummary.projectTypeLabel,
    businessGoal: model.projectSummary.businessGoal,
    languages: sortedStrings(model.projectSummary.languages),
    uiPlatforms: sortedStrings(model.projectSummary.uiPlatforms),
    deploymentStrategy: model.projectSummary.deploymentStrategy,
    deploymentEnvironments: sortedStrings(
      model.projectSummary.deploymentEnvironments,
    ),
    complexityLevel: model.complexityLevel,
    classificationDomain: model.projectClassification.domain,
    classificationCategory: model.projectClassification.category,
    engineeringComplexityScore:
      model.projectClassification.engineeringComplexityScore,
    classificationRationale: [...model.projectClassification.rationale],
    businessGoals: [...model.businessGoals],
    userRoles: model.userRoles
      .slice()
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((role) => ({
        id: role.id,
        name: role.name,
        responsibilities: [...role.responsibilities],
        accessScope: role.accessScope,
      })),
    modules: model.modules
      .slice()
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((module) => ({
        id: module.id,
        name: module.name,
        purpose: module.purpose,
        priority: module.priority,
      })),
    features: model.features
      .slice()
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((feature) => ({
        id: feature.id,
        name: feature.name,
        description: feature.description,
        priority: feature.priority,
      })),
    externalIntegrations: model.externalIntegrations
      .slice()
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((integration) => ({
        id: integration.id,
        name: integration.name,
        purpose: integration.purpose,
        status: integration.status,
      })),
    technologyStack: {
      frontend: sortedStrings(model.recommendedTechnologyStack.frontend),
      backend: sortedStrings(model.recommendedTechnologyStack.backend),
      database: sortedStrings(model.recommendedTechnologyStack.database),
      infrastructure: sortedStrings(
        model.recommendedTechnologyStack.infrastructure,
      ),
      aiServices: sortedStrings(model.recommendedTechnologyStack.aiServices),
    },
    risks: model.risks
      .slice()
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((risk) => ({
        id: risk.id,
        title: risk.title,
        description: risk.description,
        severity: risk.severity,
        mitigation: risk.mitigation,
      })),
    modelSchemaVersion: model.schemaVersion,
    modelCreatedAt: model.metadata.createdAt,
    analysisConfidence: model.metadata.analysisConfidence,
    warnings: [...model.metadata.warnings],
  };
}
