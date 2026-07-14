import type { NormalizedDiscovery } from "@/engines/contracts";
import type { ComplexityLevel, EngineeringRisk } from "../types";

export function buildRisks(
  discovery: NormalizedDiscovery,
  complexityLevel: ComplexityLevel,
): EngineeringRisk[] {
  const risks: EngineeringRisk[] = [];

  const draftRules = discovery.businessRules.filter(
    (rule) => rule.status === "draft" || rule.status === "inferred",
  );
  if (draftRules.length > 0 || discovery.businessRules.length === 0) {
    risks.push({
      id: "risk-business-rules",
      title: "Incomplete business rule confirmation",
      description:
        "Business rules are still draft, inferred, or missing confirmation from stakeholders.",
      severity: "high",
      mitigation:
        "Confirm critical policies with the Project Owner before Documentation Engine work.",
    });
  }

  const placeholderEntities = discovery.database.entities.filter(
    (entity) => entity.status === "placeholder",
  );
  if (placeholderEntities.length > 0) {
    risks.push({
      id: "risk-data-model",
      title: "Placeholder data model",
      description: `${placeholderEntities.length} database entities remain placeholders.`,
      severity: "medium",
      mitigation:
        "Refine entity relationships during architecture planning before repository generation.",
    });
  }

  const placeholderApis = discovery.api.resources.filter(
    (resource) => resource.status === "placeholder",
  );
  if (placeholderApis.length > 0) {
    risks.push({
      id: "risk-api-surface",
      title: "Placeholder API surface",
      description: `${placeholderApis.length} API resources remain placeholders.`,
      severity: "medium",
      mitigation:
        "Define request/response contracts before any implementation phase.",
    });
  }

  if (discovery.integrations.length === 0) {
    risks.push({
      id: "risk-integrations",
      title: "No integrations selected",
      description:
        "Discovery recorded no external integrations; notification or payment needs may be under-specified.",
      severity: "low",
      mitigation:
        "Revisit integration needs if onboarding, payments, or messaging are required.",
    });
  } else {
    risks.push({
      id: "risk-integration-coupling",
      title: "External integration coupling",
      description: `${discovery.integrations.length} integrations introduce vendor and operational dependency.`,
      severity: "medium",
      mitigation:
        "Isolate integration adapters and define failure fallbacks for each provider.",
    });
  }

  if (!discovery.project.businessGoal.trim()) {
    risks.push({
      id: "risk-goal-clarity",
      title: "Weak business goal signal",
      description: "Project business goal is empty or underspecified.",
      severity: "high",
      mitigation: "Capture a clear measurable business goal before expanding scope.",
    });
  }

  if (
    complexityLevel === "large" ||
    complexityLevel === "enterprise"
  ) {
    risks.push({
      id: "risk-complexity",
      title: "Elevated engineering complexity",
      description: `Classified as ${complexityLevel}; documentation and architecture depth must scale accordingly.`,
      severity: "high",
      mitigation:
        "Keep module boundaries strict and avoid premature implementation.",
    });
  }

  if (discovery.project.type === "clinic") {
    risks.push({
      id: "risk-healthcare-compliance",
      title: "Healthcare compliance exposure",
      description:
        "Clinic systems may process sensitive patient data subject to regulatory controls.",
      severity: "critical",
      mitigation:
        "Confirm compliance obligations and access policies before architecture lock-in.",
    });
  }

  return risks;
}
