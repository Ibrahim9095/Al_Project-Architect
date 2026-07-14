import type {
  AnalyzedRisk,
  DiscoveryOutput,
  Priority,
  RiskAnalysisResult,
  Severity,
} from "../types.js";

const PRIORITY_WEIGHT: Record<Priority, number> = {
  Critical: 4,
  High: 3,
  Medium: 2,
  Low: 1,
};

function toSeverity(probability: Priority, impact: Priority): Severity {
  const score = PRIORITY_WEIGHT[probability] * PRIORITY_WEIGHT[impact];
  if (score >= 12) return "Critical";
  if (score >= 8) return "High";
  if (score >= 4) return "Medium";
  return "Low";
}

function synthesizeRisks(discovery: DiscoveryOutput): AnalyzedRisk[] {
  const risks: AnalyzedRisk[] = [];
  let counter = 1;
  const nextId = (): string => `RISK-${String(counter++).padStart(4, "0")}`;

  for (const discovered of discovery.risks ?? []) {
    const probability = discovered.probability ?? "Medium";
    const impact = discovered.impact ?? "Medium";
    risks.push({
      id: discovered.id || nextId(),
      category: discovered.category,
      description: discovered.description,
      probability,
      impact,
      severity: toSeverity(probability, impact),
      affectedComponents: discovered.affectedComponents ?? [],
      mitigationStrategy:
        discovered.mitigation ??
        "Define an explicit mitigation strategy before Architecture Planning.",
      status: discovered.mitigation ? "Mitigated" : "Open",
      recommendation: discovered.mitigation
        ? "Validate mitigation completeness during Architecture Planning."
        : "Request mitigation details before approving Architecture Planning.",
    });
  }

  if (!discovery.successCriteria || discovery.successCriteria.length === 0) {
    risks.push({
      id: nextId(),
      category: "Business Risk",
      description: "Success criteria are undefined.",
      probability: "High",
      impact: "High",
      severity: "High",
      affectedComponents: ["business"],
      mitigationStrategy:
        "Document measurable success criteria with the Project Owner.",
      status: "Open",
      recommendation: "Return to Discovery to capture success criteria.",
    });
  }

  if (discovery.personas.length === 0) {
    risks.push({
      id: nextId(),
      category: "Business Risk",
      description: "No user personas were discovered.",
      probability: "High",
      impact: "Critical",
      severity: "Critical",
      affectedComponents: ["personas", "permissions"],
      mitigationStrategy: "Identify all user roles before Architecture Planning.",
      status: "Open",
      recommendation: "Return to Discovery for persona identification.",
    });
  }

  const hasSecurityRequirement = discovery.requirements.some(
    (requirement) =>
      requirement.type === "non-functional" &&
      (requirement.nfrCategory === "Security" ||
        /security|auth/i.test(requirement.title)),
  );
  const mentionsAuth = discovery.requirements.some((requirement) =>
    /login|auth|permission|role/i.test(
      `${requirement.title} ${requirement.description}`,
    ),
  );
  if (mentionsAuth && !hasSecurityRequirement) {
    risks.push({
      id: nextId(),
      category: "Security Risk",
      description:
        "Authentication-related requirements exist without an explicit security NFR.",
      probability: "Medium",
      impact: "High",
      severity: "High",
      affectedComponents: ["security", "api"],
      mitigationStrategy:
        "Add non-functional security requirements covering authentication and authorization.",
      status: "Open",
      recommendation: "Clarify security NFRs before Architecture Planning.",
    });
  }

  if ((discovery.integrations?.length ?? 0) > 0) {
    const incomplete = discovery.integrations!.filter(
      (integration) => !integration.purpose || !integration.provider,
    );
    if (incomplete.length > 0) {
      risks.push({
        id: nextId(),
        category: "Integration Risk",
        description: `Incomplete integration definitions: ${incomplete
          .map((item) => item.id)
          .join(", ")}.`,
        probability: "Medium",
        impact: "High",
        severity: "High",
        affectedComponents: incomplete.map((item) => item.id),
        mitigationStrategy:
          "Document provider, purpose, and failure handling for every integration.",
        status: "Open",
        recommendation: "Complete integration discovery before Architecture.",
      });
    }
  }

  return risks;
}

/**
 * Risk Analysis — Part 4.
 */
export function analyzeRisks(discovery: DiscoveryOutput): RiskAnalysisResult {
  const risks = synthesizeRisks(discovery);
  const criticalCount = risks.filter(
    (risk) => risk.severity === "Critical" || risk.severity === "High",
  ).length;

  const unmitigatedCritical = risks.filter(
    (risk) =>
      (risk.severity === "Critical" || risk.severity === "High") &&
      risk.status === "Open",
  );

  return {
    risks,
    criticalCount,
    passed: unmitigatedCritical.length === 0,
  };
}
