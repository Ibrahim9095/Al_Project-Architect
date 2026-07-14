import type { NormalizedDiscovery } from "@/engines/contracts";
import type { ProjectSummary } from "../types";

export function buildProjectSummary(
  discovery: NormalizedDiscovery,
): ProjectSummary {
  return {
    projectId: discovery.project.id,
    projectName: discovery.project.name,
    projectType: discovery.project.type,
    projectTypeLabel: discovery.project.typeLabel,
    businessGoal: discovery.project.businessGoal,
    languages: [...discovery.project.languages],
    moduleCount: discovery.modules.length,
    featureCount: discovery.features.length,
    roleCount: discovery.roles.length,
    integrationCount: discovery.integrations.length,
    uiPlatforms: [...discovery.ui.platforms],
    deploymentStrategy: discovery.deployment.strategy,
    deploymentEnvironments: [...discovery.deployment.environments],
  };
}
