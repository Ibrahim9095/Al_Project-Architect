import { describe, expect, it } from "vitest";
import { validateEngineeringModelForDocumentation } from "@/engines/documentation";
import { createCompleteEngineeringModel } from "./fixtures";

describe("validateEngineeringModelForDocumentation", () => {
  it("passes a complete Engineering Model", () => {
    const model = createCompleteEngineeringModel();
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
