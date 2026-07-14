import type {
  DiscoveryOutput,
  Priority,
  Requirement,
  RequirementAnalysisItem,
  RequirementAnalysisResult,
  RequirementQualityFlags,
} from "../types.js";

function hasText(value: string | undefined | null): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

function assessQuality(requirement: Requirement): RequirementQualityFlags {
  const hasAcceptance =
    Array.isArray(requirement.acceptanceCriteria) &&
    requirement.acceptanceCriteria.length > 0;

  return {
    specific: hasText(requirement.title) && hasText(requirement.description),
    measurable: hasAcceptance,
    complete:
      hasText(requirement.description) &&
      hasAcceptance &&
      (requirement.type !== "functional" ||
        (Array.isArray(requirement.userRoles) &&
          requirement.userRoles.length > 0)),
    consistent: true,
    unambiguous:
      hasText(requirement.description) &&
      !/tbd|todo|unclear|maybe/i.test(requirement.description),
    traceable:
      hasText(requirement.businessObjective) ||
      (Array.isArray(requirement.relatedBusinessRules) &&
        requirement.relatedBusinessRules.length > 0),
    testable: hasAcceptance,
    implementable:
      hasText(requirement.description) &&
      !/impossible|unknown technology/i.test(requirement.description),
    maintainable: hasText(requirement.id) && hasText(requirement.title),
  };
}

function completenessIssues(requirement: Requirement): string[] {
  const issues: string[] = [];

  if (!hasText(requirement.businessObjective)) {
    issues.push("Business objective not defined.");
  }
  if (
    requirement.type === "functional" &&
    (!requirement.userRoles || requirement.userRoles.length === 0)
  ) {
    issues.push("User role not identified.");
  }
  if (!hasText(requirement.businessValue)) {
    issues.push("Business value not established.");
  }
  if (
    !requirement.acceptanceCriteria ||
    requirement.acceptanceCriteria.length === 0
  ) {
    issues.push("Acceptance criteria not documented.");
  }
  if (!requirement.dependencies) {
    issues.push("Dependencies not identified.");
  }
  if (
    !requirement.relatedBusinessRules ||
    requirement.relatedBusinessRules.length === 0
  ) {
    issues.push("Related Business Rules missing.");
  }

  return issues;
}

function feasibilityIssues(requirement: Requirement): string[] {
  const issues: string[] = [];
  const text = `${requirement.title} ${requirement.description}`.toLowerCase();

  if (/not feasible|impossible|cannot be implemented/.test(text)) {
    issues.push("Requirement marked as technically infeasible.");
  }
  if (/unlimited users|infinite scale|zero latency/.test(text)) {
    issues.push("Requirement may be operationally or technically unrealistic.");
  }

  return issues;
}

function suggestPriority(requirement: Requirement): Priority {
  if (requirement.priority) {
    return requirement.priority;
  }

  const text = `${requirement.title} ${requirement.description}`.toLowerCase();
  if (/security|auth|payment|compliance|legal/.test(text)) {
    return "Critical";
  }
  if (/core|must|required|primary/.test(text)) {
    return "High";
  }
  if (/optional|nice to have|future/.test(text)) {
    return "Low";
  }
  return "Medium";
}

function estimateComplexity(
  requirement: Requirement,
): RequirementAnalysisItem["engineeringComplexity"] {
  const deps = requirement.dependencies?.length ?? 0;
  const criteria = requirement.acceptanceCriteria?.length ?? 0;
  const score = deps * 2 + criteria;

  if (score <= 1) return "XS";
  if (score <= 3) return "S";
  if (score <= 6) return "M";
  if (score <= 10) return "L";
  return "XL";
}

function analyzeRequirement(requirement: Requirement): RequirementAnalysisItem {
  const quality = assessQuality(requirement);
  const completeness = completenessIssues(requirement);
  const feasibility = feasibilityIssues(requirement);

  const qualityPassed = Object.values(quality).every(Boolean);
  const approved =
    qualityPassed && completeness.length === 0 && feasibility.length === 0;

  return {
    requirementId: requirement.id,
    approved,
    quality,
    completenessIssues: completeness,
    feasibilityIssues: feasibility,
    suggestedPriority: suggestPriority(requirement),
    engineeringComplexity: estimateComplexity(requirement),
  };
}

/**
 * Requirement Analysis — Part 2 of Analysis Engine.
 */
export function analyzeRequirements(
  discovery: DiscoveryOutput,
): RequirementAnalysisResult {
  const items = discovery.requirements.map(analyzeRequirement);
  const approved = items.filter((item) => item.approved).length;
  const functionalCount = discovery.requirements.filter(
    (requirement) => requirement.type === "functional",
  ).length;
  const nonFunctionalCount = discovery.requirements.filter(
    (requirement) => requirement.type === "non-functional",
  ).length;

  return {
    total: items.length,
    approved,
    rejected: items.length - approved,
    items,
    functionalCount,
    nonFunctionalCount,
    passed: items.length > 0 && approved === items.length,
  };
}
