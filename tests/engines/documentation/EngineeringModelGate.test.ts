import { describe, expect, it } from "vitest";
import { createAnalysisEngine } from "../../../src/engines/analysis/index.js";
import { validateEngineeringModelForDocumentation } from "../../../src/engines/documentation/index.js";
import { createCompleteDiscovery } from "../analysis/fixtures.js";

describe("validateEngineeringModelForDocumentation", () => {
  it("passes a complete Engineering Model", () => {
    const model = createAnalysisEngine().analyze(
      createCompleteDiscovery(),
    ).engineeringModel;

    const result = validateEngineeringModelForDocumentation(model);
    expect(result.passed).toBe(true);
    expect(result.issues).toEqual([]);
    expect(result.checkedSections.length).toBe(12);
  });

  it("fails when model is missing", () => {
    const result = validateEngineeringModelForDocumentation(undefined);
    expect(result.passed).toBe(false);
    expect(result.issues[0]?.code).toBe("DOC_MODEL_MISSING");
  });
});
