import type { NormalizedDiscovery } from "@/engines/contracts";
import type { AnalyzedModule, DatabaseCandidate } from "../types";

export function buildDatabaseCandidates(
  discovery: NormalizedDiscovery,
  modules: AnalyzedModule[],
): DatabaseCandidate[] {
  const candidates: DatabaseCandidate[] = [
    {
      id: "entity-user",
      name: "User",
      entityType: "core",
      description: "Authenticated identity and profile attributes.",
      status: "inferred",
      relatedModuleIds: [],
    },
    {
      id: "entity-role",
      name: "Role",
      entityType: "core",
      description: "Role definitions used for authorization.",
      status: "inferred",
      relatedModuleIds: [],
    },
    {
      id: "entity-session",
      name: "Session",
      entityType: "core",
      description: "Active authentication sessions.",
      status: "inferred",
      relatedModuleIds: [],
    },
    {
      id: "entity-audit-log",
      name: "AuditLog",
      entityType: "audit",
      description: "Immutable record of sensitive actions.",
      status: "inferred",
      relatedModuleIds: modules.map((module) => module.id),
    },
  ];

  for (const entity of discovery.database.entities) {
    const relatedModuleId = entity.id.replace(/-entity$/, "");
    candidates.push({
      id: entity.id,
      name: entity.name,
      entityType: "module",
      description: `Primary data entity candidate derived from module "${relatedModuleId}".`,
      status: entity.status === "planned" ? "confirmed" : "placeholder",
      relatedModuleIds: modules.some((module) => module.id === relatedModuleId)
        ? [relatedModuleId]
        : [],
    });
  }

  for (const analyzedModule of modules) {
    candidates.push({
      id: `rel-${analyzedModule.id}-user`,
      name: `${analyzedModule.name}UserLink`,
      entityType: "relationship",
      description: `Associates users with ${analyzedModule.name} records where ownership applies.`,
      status: "inferred",
      relatedModuleIds: [analyzedModule.id],
    });
  }

  return candidates;
}
