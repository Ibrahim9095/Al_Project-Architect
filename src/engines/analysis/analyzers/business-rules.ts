import type { NormalizedDiscovery } from "@/engines/contracts";
import type { AnalyzedBusinessRule, AnalyzedModule } from "../types";

function inferredRulesForType(
  discovery: NormalizedDiscovery,
  modules: AnalyzedModule[],
): AnalyzedBusinessRule[] {
  const moduleIds = modules.map((module) => module.id);
  const rules: AnalyzedBusinessRule[] = [];

  rules.push({
    id: "br-auth-required",
    description: "Privileged actions require an authenticated user session.",
    status: "inferred",
    relatedModuleIds: moduleIds.slice(0, 2),
    source: "analysis-inference",
  });

  rules.push({
    id: "br-rbac",
    description:
      "Users may only access resources permitted by their assigned role.",
    status: "inferred",
    relatedModuleIds: moduleIds,
    source: "analysis-inference",
  });

  if (discovery.project.type === "ecommerce") {
    rules.push({
      id: "br-order-payment",
      description:
        "An order cannot be confirmed until payment authorization succeeds.",
      status: "inferred",
      relatedModuleIds: moduleIds.filter((id) =>
        ["checkout", "orders", "cart"].includes(id),
      ),
      source: "analysis-inference",
    });
    rules.push({
      id: "br-inventory-reserve",
      description:
        "Inventory must be available before an order line can be fulfilled.",
      status: "inferred",
      relatedModuleIds: moduleIds.filter((id) =>
        ["inventory", "orders", "catalog"].includes(id),
      ),
      source: "analysis-inference",
    });
  }

  if (discovery.project.type === "clinic") {
    rules.push({
      id: "br-appointment-conflict",
      description:
        "Appointments for the same provider and time slot must not overlap.",
      status: "inferred",
      relatedModuleIds: moduleIds.filter((id) =>
        id.includes("appointment") || id.includes("schedule"),
      ),
      source: "analysis-inference",
    });
    rules.push({
      id: "br-phi-access",
      description:
        "Patient health information may only be accessed by authorized clinical roles.",
      status: "inferred",
      relatedModuleIds: moduleIds,
      source: "analysis-inference",
    });
  }

  if (discovery.project.type === "crm") {
    rules.push({
      id: "br-lead-ownership",
      description:
        "A lead must have exactly one primary owner at any given time.",
      status: "inferred",
      relatedModuleIds: moduleIds.filter((id) =>
        id.includes("lead") || id.includes("sales") || id.includes("pipeline"),
      ),
      source: "analysis-inference",
    });
  }

  return rules.map((rule) => ({
    ...rule,
    relatedModuleIds:
      rule.relatedModuleIds.length > 0 ? rule.relatedModuleIds : moduleIds.slice(0, 1),
  }));
}

export function buildBusinessRules(
  discovery: NormalizedDiscovery,
  modules: AnalyzedModule[],
): AnalyzedBusinessRule[] {
  const fromDiscovery: AnalyzedBusinessRule[] = discovery.businessRules.map(
    (rule) => ({
      id: rule.id,
      description: rule.description,
      status: rule.status,
      relatedModuleIds: modules.map((module) => module.id),
      source: "discovery",
    }),
  );

  const inferred = inferredRulesForType(discovery, modules);
  const existingIds = new Set(fromDiscovery.map((rule) => rule.id));

  return [
    ...fromDiscovery,
    ...inferred.filter((rule) => !existingIds.has(rule.id)),
  ];
}
