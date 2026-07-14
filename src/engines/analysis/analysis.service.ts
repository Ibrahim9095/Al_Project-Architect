import type { NormalizedDiscovery } from "@/engines/contracts";
import type { EngineContext, EngineResult } from "../types";
import { assertEngineContext } from "../shared";
import { buildEngineeringModel } from "./build-engineering-model";
import type {
  AnalysisValidationResult,
  EngineeringModel,
  IAnalysisService,
} from "./types";
import { validateAnalysisInput } from "./validate-input";

/**
 * Analysis Service.
 * Validates NormalizedDiscovery and builds the internal Engineering Model.
 */
export class AnalysisService implements IAnalysisService {
  readonly serviceId = "analysis.service" as const;
  readonly engineId = "analysis" as const;

  validateInput(discovery: unknown): AnalysisValidationResult {
    return validateAnalysisInput(discovery);
  }

  async analyze(
    discovery: NormalizedDiscovery,
    context: EngineContext,
  ): Promise<EngineResult<EngineeringModel>> {
    assertEngineContext(context);

    const validation = this.validateInput(discovery);
    if (!validation.valid) {
      return {
        status: "blocked",
        engineId: this.engineId,
        missingInformation: validation.errors,
        message: "Normalized Discovery Schema validation failed.",
      };
    }

    const model = buildEngineeringModel(discovery);

    return {
      status: "complete",
      engineId: this.engineId,
      data: model,
      message: "Engineering Model built successfully.",
    };
  }
}

export const analysisService: IAnalysisService = new AnalysisService();
