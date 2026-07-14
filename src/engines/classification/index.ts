import type { EngineResult, PlatformEngine } from "../types";
import { createNotImplementedResult } from "../types";

/**
 * Classification Engine remains a minimal foundation placeholder.
 * Full architecture expansion was not requested in this phase.
 */
export const classificationEngine: PlatformEngine = {
  id: "classification",
  name: "Classification Engine",
  async run(): Promise<EngineResult> {
    return createNotImplementedResult("classification", "run");
  },
};
