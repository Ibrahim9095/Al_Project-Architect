import type { EngineeringModel } from "../../analysis/types";
import type { TraceabilityLink, TraceabilityMap } from "../types";

/**
 * Maps Engineering Model sections to planned document types.
 * Supports future generators with a shared traceability contract.
 */
export function buildTraceabilityMap(model: EngineeringModel): TraceabilityMap {
  const links: TraceabilityLink[] = [
    {
      modelSection: "projectClassification",
      documentType: "PROJECT",
      artifactIds: [model.projectClassification.complexityLevel],
    },
    {
      modelSection: "businessGoals",
      documentType: "VISION",
      artifactIds: model.businessGoals.map((_, index) => `GOAL-${index + 1}`),
    },
    {
      modelSection: "businessGoals",
      documentType: "PROJECT",
      artifactIds: model.businessGoals.map((_, index) => `GOAL-${index + 1}`),
    },
    {
      modelSection: "userRoles",
      documentType: "PERSONAS",
      artifactIds: model.userRoles.map((role) => role.id),
    },
    {
      modelSection: "features",
      documentType: "REQUIREMENTS",
      artifactIds: model.features.map((feature) => feature.id),
    },
    {
      modelSection: "nonFunctionalRequirements",
      documentType: "REQUIREMENTS",
      artifactIds: model.nonFunctionalRequirements.map((item) => item.id),
    },
    {
      modelSection: "businessRules",
      documentType: "BUSINESS_RULES",
      artifactIds: model.businessRules.map((rule) => rule.id),
    },
    {
      modelSection: "modules",
      documentType: "MODULES",
      artifactIds: model.modules.map((module) => module.id),
    },
    {
      modelSection: "features",
      documentType: "MODULES",
      artifactIds: model.features.map((feature) => feature.id),
    },
    {
      modelSection: "databaseCandidates",
      documentType: "DATABASE",
      artifactIds: model.databaseCandidates.map((item) => item.id),
    },
    {
      modelSection: "apiCandidates",
      documentType: "API",
      artifactIds: model.apiCandidates.map((item) => item.id),
    },
    {
      modelSection: "features",
      documentType: "TASKS",
      artifactIds: model.features.map((feature) => feature.id),
    },
    {
      modelSection: "modules",
      documentType: "TASKS",
      artifactIds: model.modules.map((module) => module.id),
    },
    {
      modelSection: "securityRequirements",
      documentType: "REQUIREMENTS",
      artifactIds: model.securityRequirements.map((item) => item.id),
    },
    {
      modelSection: "complexityLevel",
      documentType: "PROJECT",
      artifactIds: [model.complexityLevel],
    },
    {
      modelSection: "externalIntegrations",
      documentType: "API",
      artifactIds: model.externalIntegrations.map((item) => item.id),
    },
  ];

  const mappedSections = new Set(links.map((link) => link.modelSection));
  const allSections = [
    "projectClassification",
    "businessGoals",
    "userRoles",
    "modules",
    "features",
    "businessRules",
    "databaseCandidates",
    "apiCandidates",
    "externalIntegrations",
    "securityRequirements",
    "nonFunctionalRequirements",
    "complexityLevel",
  ];

  return {
    links,
    unmappedModelSections: allSections.filter((section) => !mappedSections.has(section)),
  };
}
