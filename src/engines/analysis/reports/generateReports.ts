import type {
  AnalysisReports,
  ArchitectureReadinessReport,
  ConsistencyAnalysisResult,
  DecisionConfidence,
  DependencyAnalysisResult,
  DiscoveryOutput,
  EngineeringGap,
  EngineeringRecommendation,
  EngineeringSummaryReport,
  GapAnalysisResult,
  ReadinessAssessment,
  RequirementAnalysisResult,
  RiskAnalysisResult,
  ValidationResult,
} from "../types.js";

export function buildRecommendations(input: {
  gaps: GapAnalysisResult;
  risks: RiskAnalysisResult;
  consistency: ConsistencyAnalysisResult;
  requirements: RequirementAnalysisResult;
}): EngineeringRecommendation[] {
  const recommendations: EngineeringRecommendation[] = [];
  let counter = 1;
  const nextId = (): string => `REC-${String(counter++).padStart(4, "0")}`;

  for (const gap of input.gaps.gaps) {
    recommendations.push({
      id: nextId(),
      problem: gap.description,
      analysis: `Gap detected in ${gap.area}.`,
      recommendedSolution: gap.recommendedAction,
      benefits: ["Improves engineering completeness", "Reduces architecture risk"],
      risks: ["Delay to Architecture Planning if unresolved"],
      alternatives: ["Proceed with explicit Project Owner acceptance of residual risk"],
      priority:
        gap.severity === "Critical"
          ? "Critical"
          : gap.severity === "High"
            ? "High"
            : "Medium",
      impact: gap.severity,
    });
  }

  for (const risk of input.risks.risks.filter((item) => item.status === "Open")) {
    recommendations.push({
      id: nextId(),
      problem: risk.description,
      analysis: `${risk.category} with severity ${risk.severity}.`,
      recommendedSolution: risk.mitigationStrategy,
      benefits: ["Controlled risk before Architecture Planning"],
      risks: ["Unresolved risk may propagate into design defects"],
      alternatives: [risk.recommendation],
      priority: risk.severity === "Critical" ? "Critical" : "High",
      impact: risk.severity,
    });
  }

  for (const conflict of input.consistency.conflicts) {
    recommendations.push({
      id: nextId(),
      problem: conflict.description,
      analysis: `Consistency conflict type: ${conflict.type}.`,
      recommendedSolution: conflict.recommendation,
      benefits: ["Restores engineering integrity"],
      risks: ["Conflicting artifacts produce incorrect architecture"],
      alternatives: ["Escalate to Project Owner for resolution"],
      priority: conflict.impact === "Critical" ? "Critical" : "High",
      impact: conflict.impact,
    });
  }

  for (const item of input.requirements.items.filter((entry) => !entry.approved)) {
    recommendations.push({
      id: nextId(),
      problem: `Requirement ${item.requirementId} failed analysis.`,
      analysis: [
        ...item.completenessIssues,
        ...item.feasibilityIssues,
      ].join(" "),
      recommendedSolution:
        "Return the requirement to Discovery for clarification and completion.",
      benefits: ["Ensures only verified requirements enter Architecture"],
      risks: ["Incomplete requirements create implementation ambiguity"],
      alternatives: ["Split the requirement into smaller verified units"],
      priority: "High",
      impact: "High",
    });
  }

  return recommendations;
}

export function buildArchitectureReadiness(input: {
  discovery: DiscoveryOutput;
  requirements: RequirementAnalysisResult;
  dependencies: DependencyAnalysisResult;
  risks: RiskAnalysisResult;
  gaps: GapAnalysisResult;
  validation: ValidationResult;
  confidence: DecisionConfidence;
}): ArchitectureReadinessReport {
  const blockers: string[] = [];

  const businessAnalysisComplete = input.validation.business.every(
    (check) => check.passed,
  );
  const requirementsComplete = input.requirements.passed;
  const businessRulesComplete = input.validation.businessRules.every(
    (check) => check.passed,
  );
  const dependenciesIdentified =
    input.dependencies.links.length > 0 || input.discovery.requirements.length <= 1;
  const risksEvaluated = input.risks.risks.length >= 0 && input.risks.passed;
  const classificationCompleted = Boolean(input.discovery.classification?.level);
  const documentationReady = input.validation.documentation.every(
    (check) => check.passed,
  );
  const engineeringConfidenceHigh =
    input.confidence === "High" || input.confidence === "Very High";

  if (!businessAnalysisComplete) blockers.push("Business analysis incomplete.");
  if (!requirementsComplete) blockers.push("Requirements incomplete.");
  if (!businessRulesComplete) blockers.push("Business Rules incomplete.");
  if (!dependenciesIdentified) blockers.push("Dependencies not identified.");
  if (!risksEvaluated) blockers.push("Risks not adequately evaluated/mitigated.");
  if (!classificationCompleted) blockers.push("Project classification missing.");
  if (!documentationReady) blockers.push("Documentation not ready.");
  if (!engineeringConfidenceHigh) blockers.push("Engineering confidence below High.");
  if (!input.gaps.passed) {
    blockers.push(
      ...input.gaps.gaps
        .filter((gap: EngineeringGap) => gap.severity === "Critical" || gap.severity === "High")
        .map((gap) => gap.description),
    );
  }

  const ready =
    businessAnalysisComplete &&
    requirementsComplete &&
    businessRulesComplete &&
    dependenciesIdentified &&
    risksEvaluated &&
    classificationCompleted &&
    documentationReady &&
    engineeringConfidenceHigh &&
    input.gaps.passed &&
    input.validation.passed;

  return {
    businessAnalysisComplete,
    requirementsComplete,
    businessRulesComplete,
    dependenciesIdentified,
    risksEvaluated,
    classificationCompleted,
    documentationReady,
    engineeringConfidenceHigh,
    ready,
    blockers,
  };
}

export function buildEngineeringSummary(input: {
  discovery: DiscoveryOutput;
  readiness: ReadinessAssessment;
  risks: RiskAnalysisResult;
  architectureReady: boolean;
}): EngineeringSummaryReport {
  return {
    projectOverview: input.discovery.businessSummary,
    businessObjectives: input.discovery.vision,
    engineeringComplexity:
      input.discovery.classification.level +
      (input.discovery.classification.engineeringComplexityScore != null
        ? ` (ECS ${input.discovery.classification.engineeringComplexityScore})`
        : ""),
    majorRequirements: input.discovery.requirements
      .slice(0, 8)
      .map((requirement) => `${requirement.id}: ${requirement.title}`),
    majorBusinessRules: input.discovery.businessRules
      .slice(0, 8)
      .map((rule) => `${rule.id}: ${rule.name}`),
    projectRisks: input.risks.risks
      .slice(0, 8)
      .map((risk) => `${risk.id}: ${risk.description}`),
    projectClassification: input.discovery.classification.level,
    engineeringReadiness: input.readiness.score,
    recommendedNextPhase: input.architectureReady
      ? "Architecture Planning"
      : input.readiness.score === "Not Ready"
        ? "Return to Discovery"
        : "Clarification Required",
  };
}

export function generateReports(input: {
  discovery: DiscoveryOutput;
  requirements: RequirementAnalysisResult;
  consistency: ConsistencyAnalysisResult;
  dependencies: DependencyAnalysisResult;
  risks: RiskAnalysisResult;
  gaps: GapAnalysisResult;
  validation: ValidationResult;
  readiness: ReadinessAssessment;
  confidence: DecisionConfidence;
  architectureReadiness: ArchitectureReadinessReport;
}): AnalysisReports {
  const engineeringSummary = buildEngineeringSummary({
    discovery: input.discovery,
    readiness: input.readiness,
    risks: input.risks,
    architectureReady: input.architectureReadiness.ready,
  });

  return {
    businessAnalysis: [
      `Business Summary: ${input.discovery.businessSummary}`,
      `Vision: ${input.discovery.vision}`,
      `Personas: ${input.discovery.personas.length}`,
      `Scope Included: ${input.discovery.scope.included.join(", ") || "None"}`,
      `Business Validation Passed: ${input.validation.business.every((c) => c.passed)}`,
    ].join("\n"),
    requirementAnalysis: [
      `Total Requirements: ${input.requirements.total}`,
      `Approved: ${input.requirements.approved}`,
      `Rejected: ${input.requirements.rejected}`,
      `Functional: ${input.requirements.functionalCount}`,
      `Non-Functional: ${input.requirements.nonFunctionalCount}`,
    ].join("\n"),
    consistency: [
      `Conflicts: ${input.consistency.conflicts.length}`,
      `Cross-document Issues: ${input.consistency.crossDocumentIssues.length}`,
      `Passed: ${input.consistency.passed}`,
      ...input.consistency.conflicts.map(
        (conflict) => `${conflict.id}: ${conflict.description}`,
      ),
    ].join("\n"),
    dependency: [
      `Links: ${input.dependencies.links.length}`,
      `Circular Dependencies: ${input.dependencies.circularDependencies.length}`,
      `Blocking Requirements: ${input.dependencies.blockingRequirements.join(", ") || "None"}`,
      `Passed: ${input.dependencies.passed}`,
    ].join("\n"),
    riskAssessment: [
      `Risk Count: ${input.risks.risks.length}`,
      `Critical/High Count: ${input.risks.criticalCount}`,
      `Passed: ${input.risks.passed}`,
      ...input.risks.risks.map(
        (risk) => `${risk.id} [${risk.severity}] ${risk.description}`,
      ),
    ].join("\n"),
    gapAnalysis: [
      `Gap Count: ${input.gaps.gaps.length}`,
      `Critical/High Count: ${input.gaps.criticalCount}`,
      `Passed: ${input.gaps.passed}`,
      ...input.gaps.gaps.map((gap) => `${gap.id} [${gap.area}] ${gap.description}`),
    ].join("\n"),
    architectureReadiness: input.architectureReadiness,
    engineeringSummary,
    impact: input.architectureReadiness.blockers.length
      ? `Architecture blocked by: ${input.architectureReadiness.blockers.join(" | ")}`
      : "No blocking impact issues identified.",
  };
}
