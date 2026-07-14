import type { NormalizedDiscovery } from "@/engines/contracts";
import type { EngineContext, EngineResult, PlatformEngine } from "../types";
import { assertEngineContext, blockedCapability } from "../shared";
import { analysisService } from "./analysis.service";
import type {
  AnalysisEngineInput,
  AnalysisEngineOutput,
  IAnalysisService,
} from "./types";

/**
 * Analysis Engine orchestrator.
 * Accepts NormalizedDiscovery, validates it, and returns the Engineering Model.
 * Does not generate Markdown, repositories, or source code.
 * Does not call AI providers.
 */
export class AnalysisEngine
  implements PlatformEngine<AnalysisEngineInput, AnalysisEngineOutput>
{
  readonly id = "analysis" as const;
  readonly name = "Analysis Engine";

  constructor(private readonly service: IAnalysisService = analysisService) {}

  async run(
    input: AnalysisEngineInput,
    context: EngineContext,
  ): Promise<EngineResult<AnalysisEngineOutput>> {
    assertEngineContext(context);

    switch (input.action) {
      case "analyze": {
        if (input.discovery === undefined) {
          return {
            status: "blocked",
            engineId: this.id,
            missingInformation: ["discovery"],
            message: "Normalized Discovery input is required.",
          };
        }

        const validation = this.service.validateInput(input.discovery);
        if (!validation.valid) {
          return {
            status: "blocked",
            engineId: this.id,
            missingInformation: validation.errors,
            message: "Normalized Discovery Schema validation failed.",
          };
        }

        return this.service.analyze(
          input.discovery as NormalizedDiscovery,
          context,
        );
      }
      default:
        return blockedCapability("analysis", String(input.action));
    }
  }
}

export const analysisEngine = new AnalysisEngine();
