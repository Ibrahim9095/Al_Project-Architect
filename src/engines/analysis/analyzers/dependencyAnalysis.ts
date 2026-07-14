import type {
  DependencyAnalysisResult,
  DependencyLink,
  DiscoveryOutput,
} from "../types.js";

function detectCycles(links: DependencyLink[]): string[][] {
  const graph = new Map<string, string[]>();
  for (const link of links) {
    const targets = graph.get(link.fromId) ?? [];
    targets.push(link.toId);
    graph.set(link.fromId, targets);
  }

  const cycles: string[][] = [];
  const visiting = new Set<string>();
  const visited = new Set<string>();

  function dfs(node: string, path: string[]): void {
    if (visiting.has(node)) {
      const start = path.indexOf(node);
      if (start >= 0) {
        cycles.push(path.slice(start).concat(node));
      }
      return;
    }
    if (visited.has(node)) {
      return;
    }

    visiting.add(node);
    for (const next of graph.get(node) ?? []) {
      dfs(next, path.concat(next));
    }
    visiting.delete(node);
    visited.add(node);
  }

  for (const node of graph.keys()) {
    dfs(node, [node]);
  }

  return cycles;
}

/**
 * Dependency Analysis — Part 3.
 */
export function analyzeDependencies(
  discovery: DiscoveryOutput,
): DependencyAnalysisResult {
  const links: DependencyLink[] = [];

  for (const requirement of discovery.requirements) {
    for (const dependencyId of requirement.dependencies ?? []) {
      links.push({
        fromId: requirement.id,
        toId: dependencyId,
        kind: "requirement",
      });
    }

    for (const ruleId of requirement.relatedBusinessRules ?? []) {
      links.push({
        fromId: requirement.id,
        toId: ruleId,
        kind: "business-rule",
      });
    }
  }

  for (const rule of discovery.businessRules) {
    for (const requirementId of rule.relatedRequirements ?? []) {
      links.push({
        fromId: rule.id,
        toId: requirementId,
        kind: "business-rule",
      });
    }
  }

  for (const module of discovery.modules ?? []) {
    for (const requirementId of module.relatedRequirements ?? []) {
      links.push({
        fromId: module.id,
        toId: requirementId,
        kind: "module",
      });
    }
  }

  for (const workflow of discovery.workflows ?? []) {
    for (const requirementId of workflow.relatedRequirements ?? []) {
      links.push({
        fromId: workflow.id,
        toId: requirementId,
        kind: "workflow",
      });
    }
  }

  for (const integration of discovery.integrations ?? []) {
    for (const requirementId of integration.relatedRequirements ?? []) {
      links.push({
        fromId: integration.id,
        toId: requirementId,
        kind: "integration",
      });
    }
  }

  const requirementLinks = links.filter((link) => link.kind === "requirement");
  const circularDependencies = detectCycles(requirementLinks);

  const referenced = new Set(requirementLinks.map((link) => link.toId));
  const blockers = discovery.requirements
    .filter((requirement) => referenced.has(requirement.id))
    .filter((requirement) =>
      /auth|security|foundation|core/i.test(
        `${requirement.title} ${requirement.description}`,
      ),
    )
    .map((requirement) => requirement.id);

  return {
    links,
    circularDependencies,
    blockingRequirements: blockers,
    passed: circularDependencies.length === 0,
  };
}
