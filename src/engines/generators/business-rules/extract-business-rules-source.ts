import type { EngineeringModel } from "@/engines/analysis";
import type { BusinessRulesDocumentSource } from "./types";

/**
 * Extract BUSINESS_RULES.md source data from the Engineering Model only.
 * Does not invent facts outside the model.
 */
export function extractBusinessRulesSource(
  model: EngineeringModel,
): BusinessRulesDocumentSource {
  return {
    projectId: model.projectSummary.projectId,
    projectName: model.projectSummary.projectName,
    projectType: model.projectSummary.projectType,
    projectTypeLabel: model.projectSummary.projectTypeLabel,
    businessGoal: model.projectSummary.businessGoal,
    complexityLevel: model.complexityLevel,
    businessGoals: [...model.businessGoals],
    businessRules: model.businessRules
      .slice()
      .sort((a, b) => a.id.localeCompare(b.id))
      .map((rule) => ({
        id: rule.id,
        description: rule.description,
        status: rule.status,
        relatedModuleIds: [...rule.relatedModuleIds].sort((a, b) =>
          a.localeCompare(b),
        ),
        source: rule.source,
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
