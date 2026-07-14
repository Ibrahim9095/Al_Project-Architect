import type { EngineResult, PlatformEngine } from "../types";

/**
 * Classification Engine placeholder.
 * Responsibility: project complexity scoring and repository selection.
 */
export const classificationEngine: PlatformEngine = {
  id: "classification",
  name: "Classification Engine",
  async run(): Promise<EngineResult> {
    return {
      status: "blocked",
      message: "Classification Engine foundation is ready. Implementation pending approval.",
    };
  },
};
