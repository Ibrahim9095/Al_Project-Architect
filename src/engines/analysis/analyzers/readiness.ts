import type {
  DecisionConfidence,
  GapAnalysisResult,
  ReadinessAssessment,
  ReadinessScore,
  RequirementAnalysisResult,
  RiskAnalysisResult,
  ValidationResult,
} from "../types.js";

function scoreFromFlags(flags: boolean[]): ReadinessScore {
  const passed = flags.filter(Boolean).length;
  const ratio = passed / flags.length;

  if (ratio === 1) return "Architecture Ready";
  if (ratio >= 0.85) return "Engineering Ready";
  if (ratio >= 0.7) return "Mostly Ready";
  if (ratio >= 0.4) return "Partially Ready";
  return "Not Ready";
}

/**
 * Engineering Readiness Assessment — Part 5.
 */
export function assessReadiness(input: {
  requirements: RequirementAnalysisResult;
  validation: ValidationResult;
  risks: RiskAnalysisResult;
  gaps: GapAnalysisResult;
  hasModules: boolean;
  hasClassification: boolean;
}): ReadinessAssessment {
  const businessReady = input.validation.business.every((check) => check.passed);
  const requirementsReady = input.requirements.passed;
  const documentationReady = input.validation.documentation.every(
    (check) => check.passed,
  );
  const architectureReady =
    businessReady &&
    requirementsReady &&
    input.gaps.passed &&
    input.risks.passed &&
    input.hasClassification;
  const databaseReady = architectureReady && input.hasModules;
  const apiReady = architectureReady && input.hasModules;
  const testingReady = requirementsReady && documentationReady;
  const implementationReady = false;
  const releaseReady = false;

  const score = scoreFromFlags([
    businessReady,
    requirementsReady,
    architectureReady,
    databaseReady,
    apiReady,
    testingReady,
    documentationReady,
  ]);

  return {
    businessReady,
    requirementsReady,
    architectureReady,
    databaseReady,
    apiReady,
    testingReady,
    documentationReady,
    implementationReady,
    releaseReady,
    score,
  };
}

export function deriveConfidence(input: {
  validationPassed: boolean;
  readinessScore: ReadinessScore;
  openCriticalGaps: number;
  openCriticalRisks: number;
}): DecisionConfidence {
  if (
    input.validationPassed &&
    input.readinessScore === "Architecture Ready" &&
    input.openCriticalGaps === 0 &&
    input.openCriticalRisks === 0
  ) {
    return "High";
  }

  if (
    input.readinessScore === "Engineering Ready" ||
    input.readinessScore === "Mostly Ready"
  ) {
    return "Medium";
  }

  if (input.readinessScore === "Not Ready") {
    return "Low";
  }

  return "Unknown";
}
