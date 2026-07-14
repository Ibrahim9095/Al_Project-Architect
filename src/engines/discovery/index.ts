import type { EngineResult, PlatformEngine } from "../types";

/**
 * Discovery Engine placeholder.
 * Responsibility: adaptive project discovery and question generation.
 */
export const discoveryEngine: PlatformEngine = {
  id: "discovery",
  name: "Discovery Engine",
  async run(): Promise<EngineResult> {
    return {
      status: "blocked",
      message: "Discovery Engine foundation is ready. Implementation pending approval.",
    };
  },
};
