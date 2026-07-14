import { describe, expect, it } from "vitest";
import { analyzeRequirements } from "../../../src/engines/analysis/analyzers/requirementAnalysis.js";
import { detectGaps } from "../../../src/engines/analysis/analyzers/gapDetection.js";
import { analyzeRisks } from "../../../src/engines/analysis/analyzers/riskAnalysis.js";
import {
  createCompleteDiscovery,
  createIncompleteDiscovery,
} from "./fixtures.js";

describe("Analysis Engine analyzers", () => {
  it("approves well-formed requirements", () => {
    const result = analyzeRequirements(createCompleteDiscovery());
    expect(result.passed).toBe(true);
    expect(result.functionalCount).toBe(3);
    expect(result.nonFunctionalCount).toBe(2);
  });

  it("detects critical gaps for empty discovery", () => {
    const result = detectGaps(createIncompleteDiscovery());
    expect(result.passed).toBe(false);
    expect(result.criticalCount).toBeGreaterThan(0);
  });

  it("keeps mitigated risks from blocking when no open high risks remain", () => {
    const discovery = createCompleteDiscovery();
    const result = analyzeRisks(discovery);
    expect(result.risks.length).toBeGreaterThan(0);
    expect(result.passed).toBe(true);
  });
});
