import type {
  ConsistencyAnalysisResult,
  DependencyAnalysisResult,
  DiscoveryOutput,
  GapAnalysisResult,
  RequirementAnalysisResult,
  RiskAnalysisResult,
  ValidationCheck,
  ValidationResult,
} from "../types.js";

function check(name: string, passed: boolean, reason?: string): ValidationCheck {
  return { name, passed, reason: passed ? undefined : reason };
}

/**
 * Engineering Validation — Part 5.
 */
export function validateEngineering(input: {
  discovery: DiscoveryOutput;
  requirements: RequirementAnalysisResult;
  consistency: ConsistencyAnalysisResult;
  dependencies: DependencyAnalysisResult;
  risks: RiskAnalysisResult;
  gaps: GapAnalysisResult;
}): ValidationResult {
  const { discovery, requirements, consistency, dependencies, risks, gaps } =
    input;

  const business: ValidationCheck[] = [
    check(
      "Business objectives defined",
      Boolean(discovery.businessSummary.trim()),
      "Business summary is empty.",
    ),
    check(
      "Project vision defined",
      Boolean(discovery.vision.trim()),
      "Project vision is empty.",
    ),
    check(
      "Stakeholders identified",
      (discovery.stakeholders?.length ?? 0) > 0 || discovery.personas.length > 0,
      "No stakeholders or personas identified.",
    ),
    check(
      "Success criteria defined",
      (discovery.successCriteria?.length ?? 0) > 0,
      "Success criteria are missing.",
    ),
  ];

  const requirementChecks: ValidationCheck[] = [
    check(
      "Requirements exist",
      discovery.requirements.length > 0,
      "No requirements discovered.",
    ),
    check(
      "All requirements approved",
      requirements.passed,
      `${requirements.rejected} requirement(s) failed analysis.`,
    ),
    check(
      "Functional requirements present",
      requirements.functionalCount > 0,
      "No functional requirements present.",
    ),
  ];

  const businessRules: ValidationCheck[] = [
    check(
      "Business Rules exist",
      discovery.businessRules.length > 0,
      "No Business Rules discovered.",
    ),
    check(
      "Business Rules linked to requirements",
      discovery.businessRules.every(
        (rule) => (rule.relatedRequirements?.length ?? 0) > 0,
      ),
      "One or more Business Rules lack requirement links.",
    ),
  ];

  const dependencyChecks: ValidationCheck[] = [
    check(
      "No circular requirement dependencies",
      dependencies.passed,
      "Circular dependencies detected.",
    ),
    check(
      "No unresolved consistency conflicts",
      consistency.passed,
      "Consistency conflicts remain unresolved.",
    ),
  ];

  const riskChecks: ValidationCheck[] = [
    check(
      "Critical risks mitigated or absent",
      risks.passed,
      "Unmitigated high/critical risks remain.",
    ),
    check(
      "Critical gaps resolved",
      gaps.passed,
      "Critical or high engineering gaps remain.",
    ),
  ];

  const documentation: ValidationCheck[] = [
    check(
      "Scope documented",
      discovery.scope.included.length > 0,
      "Scope included list is empty.",
    ),
    check(
      "Classification completed",
      Boolean(discovery.classification?.level),
      "Project classification missing.",
    ),
    check(
      "Personas documented",
      discovery.personas.length > 0,
      "User personas missing.",
    ),
  ];

  const all = [
    ...business,
    ...requirementChecks,
    ...businessRules,
    ...dependencyChecks,
    ...riskChecks,
    ...documentation,
  ];
  const failures = all.filter((item) => !item.passed);

  return {
    business,
    requirements: requirementChecks,
    businessRules,
    dependencies: dependencyChecks,
    risks: riskChecks,
    documentation,
    passed: failures.length === 0,
    failures,
  };
}
