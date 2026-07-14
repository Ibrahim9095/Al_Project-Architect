import type { NormalizedDiscovery } from "@/engines/contracts";
import type { AnalyzedModule, ApiCandidate } from "../types";

export function buildApiCandidates(
  discovery: NormalizedDiscovery,
  modules: AnalyzedModule[],
): ApiCandidate[] {
  const candidates: ApiCandidate[] = [
    {
      id: "api-auth-login",
      name: "Auth Login",
      methodHints: ["POST"],
      pathHint: "/api/auth/login",
      description: "Authenticate a user and establish a session.",
      status: "inferred",
      relatedModuleIds: [],
    },
    {
      id: "api-auth-logout",
      name: "Auth Logout",
      methodHints: ["POST"],
      pathHint: "/api/auth/logout",
      description: "Terminate the current authenticated session.",
      status: "inferred",
      relatedModuleIds: [],
    },
    {
      id: "api-me",
      name: "Current User",
      methodHints: ["GET"],
      pathHint: "/api/me",
      description: "Return the authenticated user profile and roles.",
      status: "inferred",
      relatedModuleIds: [],
    },
  ];

  for (const resource of discovery.api.resources) {
    const relatedModuleId = resource.id.replace(/-api$/, "");
    const pathBase = `/api/${relatedModuleId}`;
    candidates.push({
      id: resource.id,
      name: resource.name,
      methodHints: ["GET", "POST", "PATCH", "DELETE"],
      pathHint: pathBase,
      description: `CRUD resource surface for ${resource.name}.`,
      status: resource.status === "planned" ? "confirmed" : "placeholder",
      relatedModuleIds: modules.some((module) => module.id === relatedModuleId)
        ? [relatedModuleId]
        : [],
    });
  }

  for (const feature of discovery.features) {
    candidates.push({
      id: `api-feature-${feature.id}`,
      name: `${feature.name} Action`,
      methodHints: ["POST", "GET"],
      pathHint: `/api/features/${feature.id}`,
      description: `Capability endpoint candidate supporting ${feature.name}.`,
      status: "inferred",
      relatedModuleIds: modules
        .filter((module) => module.relatedFeatureIds.includes(feature.id))
        .map((module) => module.id),
    });
  }

  return candidates;
}
