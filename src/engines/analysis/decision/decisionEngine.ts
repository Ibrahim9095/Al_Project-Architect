import type {
  AnalysisStatus,
  ArchitectureReadinessReport,
  DecisionConfidence,
  QualityGateResult,
  ReadinessAssessment,
  ValidationResult,
} from "../types.js";

/**
 * Decision Engine & Quality Gates — Part 7.
 */
export function evaluateQualityGates(input: {
  discoveryHasBusiness: boolean;
  requirementsPassed: boolean;
  businessRulesPassed: boolean;
  analysisComplete: boolean;
  engineeringReady: boolean;
  architectureReady: boolean;
}): QualityGateResult[] {
  return [
    { name: "Business Complete", passed: input.discoveryHasBusiness },
    { name: "Requirements Complete", passed: input.requirementsPassed },
    { name: "Business Rules Complete", passed: input.businessRulesPassed },
    { name: "Analysis Complete", passed: input.analysisComplete },
    { name: "Engineering Ready", passed: input.engineeringReady },
    { name: "Architecture Approved", passed: input.architectureReady },
  ];
}

export function decideAnalysisOutcome(input: {
  validation: ValidationResult;
  readiness: ReadinessAssessment;
  architectureReadiness: ArchitectureReadinessReport;
  confidence: DecisionConfidence;
  qualityGates: QualityGateResult[];
}): {
  status: AnalysisStatus;
  approvedForArchitecture: boolean;
} {
  const gatesPassed = input.qualityGates.every((gate) => gate.passed);
  const approved =
    input.validation.passed &&
    input.architectureReadiness.ready &&
    (input.confidence === "High" || input.confidence === "Very High") &&
    gatesPassed;

  if (approved) {
    return {
      status: "approved",
      approvedForArchitecture: true,
    };
  }

  // Reject only when foundational discovery knowledge is absent.
  const foundationalFailure = input.validation.failures.some((failure) =>
    /Business summary is empty|Project vision is empty|No requirements discovered|No Business Rules discovered|User personas missing|Scope included list is empty/i.test(
      failure.reason ?? "",
    ),
  );

  if (input.readiness.score === "Not Ready" && foundationalFailure) {
    return {
      status: "rejected",
      approvedForArchitecture: false,
    };
  }

  return {
    status: "needs_clarification",
    approvedForArchitecture: false,
  };
}
