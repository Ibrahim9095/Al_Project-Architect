import type {
  ConsistencyAnalysisResult,
  DiscoveryOutput,
  EngineeringConflict,
} from "../types.js";

function collectRequirementIds(discovery: DiscoveryOutput): Set<string> {
  return new Set(discovery.requirements.map((requirement) => requirement.id));
}

function collectPersonaRoles(discovery: DiscoveryOutput): Set<string> {
  return new Set(
    discovery.personas.map((persona) => persona.role.toLowerCase()),
  );
}

/**
 * Consistency, Conflict & Dependency cross-checks — Part 3.
 */
export function analyzeConsistency(
  discovery: DiscoveryOutput,
): ConsistencyAnalysisResult {
  const conflicts: EngineeringConflict[] = [];
  const crossDocumentIssues: string[] = [];
  const requirementIds = collectRequirementIds(discovery);
  const personaRoles = collectPersonaRoles(discovery);
  let conflictCounter = 1;

  const nextId = (): string =>
    `CONF-${String(conflictCounter++).padStart(4, "0")}`;

  for (const requirement of discovery.requirements) {
    for (const role of requirement.userRoles ?? []) {
      if (!personaRoles.has(role.toLowerCase())) {
        conflicts.push({
          id: nextId(),
          type: "Permission",
          description: `Requirement ${requirement.id} references user role "${role}" that is not defined in personas.`,
          artifactIds: [requirement.id],
          impact: "High",
          recommendation:
            "Add the missing persona or correct the requirement user role reference.",
          resolved: false,
        });
      }
    }

    for (const ruleId of requirement.relatedBusinessRules ?? []) {
      const exists = discovery.businessRules.some((rule) => rule.id === ruleId);
      if (!exists) {
        conflicts.push({
          id: nextId(),
          type: "Business Rule",
          description: `Requirement ${requirement.id} references missing Business Rule ${ruleId}.`,
          artifactIds: [requirement.id, ruleId],
          impact: "High",
          recommendation:
            "Create the missing Business Rule or remove the invalid reference.",
          resolved: false,
        });
      }
    }

    for (const dependencyId of requirement.dependencies ?? []) {
      if (!requirementIds.has(dependencyId)) {
        conflicts.push({
          id: nextId(),
          type: "Requirement",
          description: `Requirement ${requirement.id} depends on unknown requirement ${dependencyId}.`,
          artifactIds: [requirement.id, dependencyId],
          impact: "Medium",
          recommendation:
            "Define the missing dependency requirement or remove the invalid dependency.",
          resolved: false,
        });
      }
    }
  }

  for (const rule of discovery.businessRules) {
    for (const requirementId of rule.relatedRequirements ?? []) {
      if (!requirementIds.has(requirementId)) {
        conflicts.push({
          id: nextId(),
          type: "Business Rule",
          description: `Business Rule ${rule.id} references unknown requirement ${requirementId}.`,
          artifactIds: [rule.id, requirementId],
          impact: "Medium",
          recommendation:
            "Align Business Rule references with existing requirements.",
          resolved: false,
        });
      }
    }
  }

  const titles = new Map<string, string[]>();
  for (const requirement of discovery.requirements) {
    const key = requirement.title.trim().toLowerCase();
    const ids = titles.get(key) ?? [];
    ids.push(requirement.id);
    titles.set(key, ids);
  }
  for (const [title, ids] of titles) {
    if (ids.length > 1) {
      conflicts.push({
        id: nextId(),
        type: "Requirement",
        description: `Duplicate requirement title "${title}" found on ${ids.join(", ")}.`,
        artifactIds: ids,
        impact: "Medium",
        recommendation: "Merge duplicate requirements or rename them uniquely.",
        resolved: false,
      });
    }
  }

  if (discovery.scope.included.length === 0) {
    crossDocumentIssues.push("Project scope included features are empty.");
  }

  if (!discovery.vision.trim()) {
    crossDocumentIssues.push("Project vision is empty.");
  }

  if (!discovery.businessSummary.trim()) {
    crossDocumentIssues.push("Business summary is empty.");
  }

  const includedLower = discovery.scope.included.map((item) =>
    item.toLowerCase(),
  );
  for (const excluded of discovery.scope.excluded ?? []) {
    if (includedLower.includes(excluded.toLowerCase())) {
      conflicts.push({
        id: nextId(),
        type: "Project Scope",
        description: `Scope conflict: "${excluded}" appears in both included and excluded lists.`,
        artifactIds: ["scope"],
        impact: "High",
        recommendation: "Resolve whether the feature is in or out of scope.",
        resolved: false,
      });
    }
  }

  return {
    conflicts,
    crossDocumentIssues,
    passed: conflicts.length === 0 && crossDocumentIssues.length === 0,
  };
}
