import {
  analyzeConsistency,
  analyzeDependencies,
  analyzeRequirements,
  analyzeRisks,
  assessReadiness,
  deriveConfidence,
  detectGaps,
  validateEngineering,
} from "./analyzers/index.js";
import {
  decideAnalysisOutcome,
  evaluateQualityGates,
} from "./decision/decisionEngine.js";
import {
  buildArchitectureReadiness,
  buildRecommendations,
  generateReports,
} from "./reports/generateReports.js";
import {
  buildEngineeringModel,
  validateEngineeringModel,
} from "./engineeringModel.js";
import type { AnalysisResult, DiscoveryOutput } from "./types.js";

/**
 * Analysis Engine
 *
 * Quality gate between Discovery and Architecture Planning.
 * Transforms Discovery Output into verified engineering knowledge.
 *
 * Lifecycle:
 * Discovery Output
 * → Business / Requirement Analysis
 * → Consistency Analysis
 * → Dependency Analysis
 * → Risk Analysis
 * → Gap Detection
 * → Engineering Validation
 * → Engineering Reports
 * → Engineering Approval
 * → Architecture Engine (only when approved)
 */
export class AnalysisEngine {
  /**
   * Execute the full Analysis lifecycle for a Discovery Output payload.
   */
  analyze(discovery: DiscoveryOutput): AnalysisResult {
    if (!discovery) {
      throw new Error("Analysis Engine requires Discovery Output.");
    }

    const requirementAnalysis = analyzeRequirements(discovery);
    const consistencyAnalysis = analyzeConsistency(discovery);
    const dependencyAnalysis = analyzeDependencies(discovery);
    const riskAnalysis = analyzeRisks(discovery);
    const gapAnalysis = detectGaps(discovery);

    const validation = validateEngineering({
      discovery,
      requirements: requirementAnalysis,
      consistency: consistencyAnalysis,
      dependencies: dependencyAnalysis,
      risks: riskAnalysis,
      gaps: gapAnalysis,
    });

    const readiness = assessReadiness({
      requirements: requirementAnalysis,
      validation,
      risks: riskAnalysis,
      gaps: gapAnalysis,
      hasModules: (discovery.modules?.length ?? 0) > 0,
      hasClassification: Boolean(discovery.classification?.level),
    });

    const confidence = deriveConfidence({
      validationPassed: validation.passed,
      readinessScore: readiness.score,
      openCriticalGaps: gapAnalysis.gaps.filter(
        (gap) =>
          (gap.severity === "Critical" || gap.severity === "High") &&
          gap.status === "Open",
      ).length,
      openCriticalRisks: riskAnalysis.risks.filter(
        (risk) =>
          (risk.severity === "Critical" || risk.severity === "High") &&
          risk.status === "Open",
      ).length,
    });

    const architectureReadiness = buildArchitectureReadiness({
      discovery,
      requirements: requirementAnalysis,
      dependencies: dependencyAnalysis,
      risks: riskAnalysis,
      gaps: gapAnalysis,
      validation,
      confidence,
    });

    const qualityGates = evaluateQualityGates({
      discoveryHasBusiness:
        Boolean(discovery.businessSummary.trim()) &&
        Boolean(discovery.vision.trim()),
      requirementsPassed: requirementAnalysis.passed,
      businessRulesPassed: validation.businessRules.every((check) => check.passed),
      analysisComplete:
        requirementAnalysis.items.length > 0 ||
        gapAnalysis.gaps.some((gap) => gap.area === "Requirements"),
      engineeringReady:
        readiness.score === "Engineering Ready" ||
        readiness.score === "Architecture Ready",
      architectureReady: architectureReadiness.ready,
    });

    const engineeringModel = buildEngineeringModel(discovery);
    const engineeringModelGaps = validateEngineeringModel(engineeringModel);

    let recommendations = buildRecommendations({
      gaps: gapAnalysis,
      risks: riskAnalysis,
      consistency: consistencyAnalysis,
      requirements: requirementAnalysis,
    });

    if (engineeringModelGaps.length > 0) {
      recommendations = [
        ...recommendations,
        ...engineeringModelGaps.map((section, index) => ({
          id: `REC-MODEL-${String(index + 1).padStart(3, "0")}`,
          problem: `Engineering Model missing required section: ${section}.`,
          analysis:
            "Analysis Engine could not assemble a complete Engineering Model from Discovery Output.",
          recommendedSolution:
            "Return to Discovery and supply the missing engineering information.",
          benefits: ["Complete Architecture handoff model"],
          risks: ["Architecture Planning would proceed with incomplete context"],
          alternatives: ["Explicitly accept residual gap with Project Owner approval"],
          priority: "High" as const,
          impact: "High" as const,
        })),
      ];
    }

    const reports = generateReports({
      discovery,
      requirements: requirementAnalysis,
      consistency: consistencyAnalysis,
      dependencies: dependencyAnalysis,
      risks: riskAnalysis,
      gaps: gapAnalysis,
      validation,
      readiness,
      confidence,
      architectureReadiness,
    });

    const decision = decideAnalysisOutcome({
      validation,
      readiness,
      architectureReadiness,
      confidence,
      qualityGates,
    });

    return {
      status: decision.status,
      readinessScore: readiness.score,
      confidence,
      requirementAnalysis,
      consistencyAnalysis,
      dependencyAnalysis,
      riskAnalysis,
      gapAnalysis,
      validation,
      readiness,
      qualityGates,
      recommendations,
      reports,
      engineeringModel,
      approvedForArchitecture: decision.approvedForArchitecture,
      analyzedAt: new Date().toISOString(),
    };
  }
}

export function createAnalysisEngine(): AnalysisEngine {
  return new AnalysisEngine();
}
