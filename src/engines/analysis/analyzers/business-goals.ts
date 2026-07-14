import type { NormalizedDiscovery } from "@/engines/contracts";

function typeSpecificGoals(projectType: string): string[] {
  switch (projectType) {
    case "ecommerce":
      return [
        "Enable customers to browse, purchase, and track products online.",
        "Support reliable order fulfillment and inventory visibility.",
      ];
    case "clinic":
      return [
        "Support clinical operations with reliable patient and appointment workflows.",
        "Protect sensitive healthcare information through controlled access.",
      ];
    case "crm":
      return [
        "Centralize customer relationship data and sales pipeline visibility.",
        "Improve team coordination across customer-facing processes.",
      ];
    default:
      return [
        "Deliver a maintainable software system aligned to stated business needs.",
      ];
  }
}

export function buildBusinessGoals(discovery: NormalizedDiscovery): string[] {
  const goals: string[] = [];
  const stated = discovery.project.businessGoal.trim();

  if (stated.length > 0) {
    goals.push(stated);
  }

  for (const goal of typeSpecificGoals(discovery.project.type)) {
    if (!goals.includes(goal)) {
      goals.push(goal);
    }
  }

  goals.push(
    `Support ${discovery.roles.length} defined user roles across ${discovery.modules.length} modules.`,
  );

  return goals;
}
