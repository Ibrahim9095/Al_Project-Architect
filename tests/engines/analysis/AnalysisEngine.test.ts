import { describe, expect, it } from "vitest";
import { AnalysisEngine } from "../../../src/engines/analysis/AnalysisEngine.js";
import {
  createCompleteDiscovery,
  createIncompleteDiscovery,
} from "./fixtures.js";

describe("AnalysisEngine", () => {
  const engine = new AnalysisEngine();

  it("approves complete Discovery Output for Architecture Planning", () => {
    const result = engine.analyze(createCompleteDiscovery());

    expect(result.status).toBe("approved");
    expect(result.approvedForArchitecture).toBe(true);
    expect(result.confidence).toBe("High");
    expect(result.readinessScore).toBe("Architecture Ready");
    expect(result.requirementAnalysis.passed).toBe(true);
    expect(result.consistencyAnalysis.passed).toBe(true);
    expect(result.dependencyAnalysis.passed).toBe(true);
    expect(result.gapAnalysis.passed).toBe(true);
    expect(result.validation.passed).toBe(true);
    expect(result.reports.architectureReadiness.ready).toBe(true);
    expect(result.reports.engineeringSummary.recommendedNextPhase).toBe(
      "Architecture Planning",
    );
    expect(result.qualityGates.every((gate) => gate.passed)).toBe(true);
  });

  it("rejects incomplete Discovery Output", () => {
    const result = engine.analyze(createIncompleteDiscovery());

    expect(result.approvedForArchitecture).toBe(false);
    expect(["rejected", "needs_clarification"]).toContain(result.status);
    expect(result.gapAnalysis.gaps.length).toBeGreaterThan(0);
    expect(result.validation.passed).toBe(false);
    expect(result.reports.architectureReadiness.ready).toBe(false);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it("detects requirement conflicts against missing personas", () => {
    const discovery = createCompleteDiscovery();
    discovery.requirements[1].userRoles = ["Unknown Role"];

    const result = engine.analyze(discovery);

    expect(result.consistencyAnalysis.passed).toBe(false);
    expect(
      result.consistencyAnalysis.conflicts.some((conflict) =>
        conflict.description.includes("Unknown Role"),
      ),
    ).toBe(true);
    expect(result.approvedForArchitecture).toBe(false);
  });

  it("detects circular requirement dependencies", () => {
    const discovery = createCompleteDiscovery();
    discovery.requirements[0].dependencies = ["REQ-002"];
    discovery.requirements[1].dependencies = ["REQ-001"];

    const result = engine.analyze(discovery);

    expect(result.dependencyAnalysis.passed).toBe(false);
    expect(result.dependencyAnalysis.circularDependencies.length).toBeGreaterThan(
      0,
    );
    expect(result.approvedForArchitecture).toBe(false);
  });

  it("flags incomplete requirements and asks for clarification", () => {
    const discovery = createCompleteDiscovery();
    discovery.requirements.push({
      id: "REQ-999",
      title: "Maybe notifications",
      description: "TBD notification behavior",
      type: "functional",
    });

    const result = engine.analyze(discovery);
    const analyzed = result.requirementAnalysis.items.find(
      (item) => item.requirementId === "REQ-999",
    );

    expect(analyzed?.approved).toBe(false);
    expect(result.requirementAnalysis.passed).toBe(false);
    expect(result.approvedForArchitecture).toBe(false);
    expect(result.status).toBe("needs_clarification");
  });

  it("produces engineering reports for every analysis run", () => {
    const result = engine.analyze(createCompleteDiscovery());

    expect(result.reports.businessAnalysis).toContain("Business Summary");
    expect(result.reports.requirementAnalysis).toContain("Total Requirements");
    expect(result.reports.riskAssessment).toContain("Risk Count");
    expect(result.reports.gapAnalysis).toContain("Gap Count");
    expect(result.reports.engineeringSummary.projectClassification).toBe("Small");
    expect(result.analyzedAt).toBeTruthy();
  });

  it("throws when Discovery Output is missing", () => {
    expect(() => engine.analyze(undefined as never)).toThrow(
      /requires Discovery Output/,
    );
  });
});
