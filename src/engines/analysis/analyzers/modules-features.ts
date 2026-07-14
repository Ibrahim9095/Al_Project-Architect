import type { NormalizedDiscovery } from "@/engines/contracts";
import type { AnalyzedFeature, AnalyzedModule, RequirementPriority } from "../types";

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function relatedFeatureIds(
  moduleId: string,
  moduleName: string,
  features: NormalizedDiscovery["features"],
): string[] {
  const moduleTokens = new Set([...tokenize(moduleId), ...tokenize(moduleName)]);
  return features
    .filter((feature) => {
      const featureTokens = [...tokenize(feature.id), ...tokenize(feature.name)];
      return featureTokens.some((token) => moduleTokens.has(token));
    })
    .map((feature) => feature.id);
}

function modulePriority(
  index: number,
  total: number,
): RequirementPriority {
  if (index < Math.ceil(total * 0.5)) return "must";
  if (index < Math.ceil(total * 0.8)) return "should";
  return "could";
}

export function buildModules(discovery: NormalizedDiscovery): AnalyzedModule[] {
  return discovery.modules.map((module, index) => {
    const related = relatedFeatureIds(
      module.id,
      module.name,
      discovery.features,
    );
    return {
      id: module.id,
      name: module.name,
      purpose: `Deliver ${module.name} capabilities for ${discovery.project.name}.`,
      relatedFeatureIds: related,
      priority: modulePriority(index, discovery.modules.length),
      source: "discovery",
    };
  });
}

export function buildFeatures(
  discovery: NormalizedDiscovery,
  modules: AnalyzedModule[],
): AnalyzedFeature[] {
  return discovery.features.map((feature, index) => {
    const relatedModuleIds = modules
      .filter((module) => module.relatedFeatureIds.includes(feature.id))
      .map((module) => module.id);

    return {
      id: feature.id,
      name: feature.name,
      description: `Provide ${feature.name} as part of the ${discovery.project.typeLabel} solution.`,
      relatedModuleIds:
        relatedModuleIds.length > 0
          ? relatedModuleIds
          : modules.slice(0, 1).map((module) => module.id),
      priority: modulePriority(index, discovery.features.length),
      source: "discovery",
    };
  });
}
