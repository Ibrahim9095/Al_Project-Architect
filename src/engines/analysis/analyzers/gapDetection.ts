import type {
  DiscoveryOutput,
  EngineeringGap,
  GapAnalysisResult,
} from "../types.js";

/**
 * Gap Detection — Part 4.
 */
export function detectGaps(discovery: DiscoveryOutput): GapAnalysisResult {
  const gaps: EngineeringGap[] = [];
  let counter = 1;
  const nextId = (): string => `GAP-${String(counter++).padStart(4, "0")}`;

  const push = (
    area: EngineeringGap["area"],
    description: string,
    severity: EngineeringGap["severity"],
    requiredInformation: string,
  ): void => {
    gaps.push({
      id: nextId(),
      area,
      description,
      severity,
      businessImpact:
        severity === "Critical" || severity === "High"
          ? "Blocks reliable business understanding."
          : "May reduce engineering confidence.",
      engineeringImpact:
        severity === "Critical" || severity === "High"
          ? "Blocks Architecture Planning approval."
          : "May require clarification during Architecture Planning.",
      recommendedAction: "Return to Discovery and collect the missing information.",
      requiredInformation,
      status: "Open",
    });
  };

  if (!discovery.businessSummary.trim()) {
    push(
      "Business Objectives",
      "Business summary is missing.",
      "Critical",
      "Clear business summary and objectives.",
    );
  }

  if (!discovery.vision.trim()) {
    push(
      "Documentation",
      "Project vision is missing.",
      "High",
      "Approved project vision statement.",
    );
  }

  if (discovery.requirements.length === 0) {
    push(
      "Requirements",
      "No requirements were provided by Discovery.",
      "Critical",
      "Complete functional and non-functional requirements.",
    );
  }

  if (discovery.businessRules.length === 0) {
    push(
      "Business Rules",
      "No Business Rules were extracted.",
      "High",
      "Validated Business Rules linked to requirements.",
    );
  }

  if (discovery.personas.length === 0) {
    push(
      "User Roles",
      "No user roles or personas were identified.",
      "Critical",
      "Documented user personas with responsibilities.",
    );
  }

  if (!discovery.workflows || discovery.workflows.length === 0) {
    push(
      "Workflows",
      "No business workflows were documented.",
      "Medium",
      "Primary user and business workflows.",
    );
  }

  if (!discovery.modules || discovery.modules.length === 0) {
    push(
      "Modules",
      "No module hints were identified.",
      "Medium",
      "Initial module candidates derived from business capabilities.",
    );
  }

  if (!discovery.technicalConstraints || discovery.technicalConstraints.length === 0) {
    push(
      "Technical Constraints",
      "Technical constraints are undocumented.",
      "Medium",
      "Known technical, infrastructure, and compliance constraints.",
    );
  }

  const hasFunctional = discovery.requirements.some(
    (requirement) => requirement.type === "functional",
  );
  const hasNonFunctional = discovery.requirements.some(
    (requirement) => requirement.type === "non-functional",
  );
  if (hasFunctional && !hasNonFunctional) {
    push(
      "Requirements",
      "Functional requirements exist without non-functional requirements.",
      "High",
      "Security, performance, and reliability non-functional requirements.",
    );
  }

  if (!discovery.classification?.level) {
    push(
      "Documentation",
      "Project classification is missing.",
      "High",
      "Validated project classification and engineering profile.",
    );
  }

  const criticalCount = gaps.filter(
    (gap) => gap.severity === "Critical" || gap.severity === "High",
  ).length;

  return {
    gaps,
    criticalCount,
    passed: criticalCount === 0,
  };
}
