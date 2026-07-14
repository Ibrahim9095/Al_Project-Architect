import type { EngineContext, EngineResult } from "../types";
import { assertEngineContext, blockedCapability } from "../shared";
import type {
  AnalysisInput,
  AnalysisJob,
  AnalysisOutput,
  IAnalysisService,
} from "./types";

/**
 * Analysis service boundary — placeholder implementation.
 */
export class AnalysisService implements IAnalysisService {
  readonly serviceId = "analysis.service" as const;
  readonly engineId = "analysis" as const;

  async startAnalysis(
    input: AnalysisInput,
    context: EngineContext,
  ): Promise<EngineResult<AnalysisJob>> {
    assertEngineContext(context);

    return {
      status: "blocked",
      engineId: this.engineId,
      data: {
        jobId: `analysis-${context.requestId}`,
        projectId: context.projectId,
        stage: input.stage,
        status: "blocked",
      },
      message:
        "Analysis Service architecture is ready. Analysis logic is not implemented.",
    };
  }

  async getAnalysisStatus(
    _jobId: string,
    context: EngineContext,
  ): Promise<EngineResult<AnalysisJob>> {
    assertEngineContext(context);
    return blockedCapability("analysis", "getAnalysisStatus");
  }

  async summarizeAnalysis(
    _jobId: string,
    context: EngineContext,
  ): Promise<EngineResult<AnalysisOutput>> {
    assertEngineContext(context);
    return blockedCapability("analysis", "summarizeAnalysis");
  }
}

export const analysisService: IAnalysisService = new AnalysisService();
