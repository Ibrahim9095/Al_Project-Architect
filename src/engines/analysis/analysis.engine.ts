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
 * Coordinates analysis services; contains no analysis business logic.
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
      case "start": {
        if (!input.input?.stage) {
          return {
            status: "blocked",
            engineId: this.id,
            missingInformation: ["input.stage"],
            message: "stage is required for start action.",
          };
        }

        const result = await this.service.startAnalysis(input.input, context);
        if (!result.data) {
          return {
            status: result.status,
            engineId: this.id,
            message: result.message,
            missingInformation: result.missingInformation,
          };
        }

        return {
          status: "blocked",
          engineId: this.id,
          data: {
            job: result.data,
            pendingCapabilities: [
              "getAnalysisStatus",
              "summarizeAnalysis",
              "consistencyChecks",
            ],
          },
          message:
            "Analysis Engine architecture is ready. Business logic is not implemented.",
        };
      }
      case "status": {
        if (!input.input?.jobId) {
          return {
            status: "blocked",
            engineId: this.id,
            missingInformation: ["input.jobId"],
            message: "jobId is required for status action.",
          };
        }
        const result = await this.service.getAnalysisStatus(
          input.input.jobId,
          context,
        );
        if (!result.data) {
          return {
            status: result.status,
            engineId: this.id,
            message: result.message,
            missingInformation: result.missingInformation,
          };
        }
        return {
          status: result.status,
          engineId: this.id,
          data: {
            job: result.data,
            pendingCapabilities: ["summarizeAnalysis"],
          },
          message: result.message,
        };
      }
      case "summarize": {
        if (!input.input?.jobId) {
          return {
            status: "blocked",
            engineId: this.id,
            missingInformation: ["input.jobId"],
            message: "jobId is required for summarize action.",
          };
        }
        return this.service.summarizeAnalysis(input.input.jobId, context);
      }
      default:
        return blockedCapability("analysis", String(input.action));
    }
  }
}

export const analysisEngine = new AnalysisEngine();
