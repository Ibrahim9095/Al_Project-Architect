import type { NormalizedDiscovery } from "@/engines/contracts";
import {
  buildApiCandidates,
  buildBusinessGoals,
  buildBusinessRules,
  buildDatabaseCandidates,
  buildExternalIntegrations,
  buildFeatures,
  buildModules,
  buildNonFunctionalRequirements,
  buildProjectClassification,
  buildProjectSummary,
  buildRecommendedTechnologyStack,
  buildRisks,
  buildSecurityRequirements,
  buildUserRoles,
} from "./analyzers";
import { ENGINEERING_MODEL_SCHEMA_VERSION } from "./schema";
import type {
  AnalysisConfidence,
  EngineeringModel,
} from "./types";

function resolveConfidence(discovery: NormalizedDiscovery): {
  confidence: AnalysisConfidence;
  warnings: string[];
} {
  const warnings: string[] = [];

  if (!discovery.project.businessGoal.trim()) {
    warnings.push("Business goal is empty.");
  }
  if (discovery.businessRules.every((rule) => rule.status !== "confirmed")) {
    warnings.push("No confirmed business rules in Discovery input.");
  }
  if (discovery.database.entities.some((entity) => entity.status === "placeholder")) {
    warnings.push("Database entities include placeholders.");
  }
  if (discovery.api.resources.some((resource) => resource.status === "placeholder")) {
    warnings.push("API resources include placeholders.");
  }

  if (warnings.length === 0) {
    return { confidence: "high", warnings };
  }
  if (warnings.length <= 2) {
    return { confidence: "medium", warnings };
  }
  return { confidence: "low", warnings };
}

/**
 * Builds the internal Engineering Model from validated NormalizedDiscovery.
 * Deterministic. No AI provider calls. No Markdown. No repository generation.
 */
export function buildEngineeringModel(
  discovery: NormalizedDiscovery,
  options?: { createdAt?: string },
): EngineeringModel {
  const createdAt = options?.createdAt ?? new Date().toISOString();
  const projectSummary = buildProjectSummary(discovery);
  const projectClassification = buildProjectClassification(discovery);
  const modules = buildModules(discovery);
  const features = buildFeatures(discovery, modules);
  const { confidence, warnings } = resolveConfidence(discovery);

  return {
    schemaVersion: ENGINEERING_MODEL_SCHEMA_VERSION,
    projectSummary,
    projectClassification,
    businessGoals: buildBusinessGoals(discovery),
    userRoles: buildUserRoles(discovery),
    modules,
    features,
    businessRules: buildBusinessRules(discovery, modules),
    databaseCandidates: buildDatabaseCandidates(discovery, modules),
    apiCandidates: buildApiCandidates(discovery, modules),
    externalIntegrations: buildExternalIntegrations(discovery),
    securityRequirements: buildSecurityRequirements(discovery),
    nonFunctionalRequirements: buildNonFunctionalRequirements(
      discovery,
      projectClassification.complexityLevel,
    ),
    risks: buildRisks(discovery, projectClassification.complexityLevel),
    complexityLevel: projectClassification.complexityLevel,
    recommendedTechnologyStack: buildRecommendedTechnologyStack(
      discovery,
      projectClassification.complexityLevel,
    ),
    metadata: {
      createdAt,
      sourceEngine: "analysis",
      schemaVersion: ENGINEERING_MODEL_SCHEMA_VERSION,
      discoverySchemaVersion: discovery.schemaVersion,
      analysisConfidence: confidence,
      inputProjectId: discovery.project.id,
      warnings,
    },
  };
}
