import type { EngineContext, EngineResult } from "../types";
import { assertEngineContext, blockedCapability } from "../shared";
import type {
  IRepositoryService,
  RepositoryInput,
  RepositoryOutput,
  RepositoryPlan,
} from "./types";

/**
 * Repository service boundary — placeholder implementation.
 */
export class RepositoryService implements IRepositoryService {
  readonly serviceId = "repository.service" as const;
  readonly engineId = "repository" as const;

  async planRepository(
    input: RepositoryInput,
    context: EngineContext,
  ): Promise<EngineResult<RepositoryPlan>> {
    assertEngineContext(context);

    return {
      status: "blocked",
      engineId: this.engineId,
      data: {
        planId: `repository-${context.requestId}`,
        projectId: context.projectId,
        complexity: input.complexity,
        includePaths: input.includePaths ?? [],
        status: "blocked",
      },
      message:
        "Repository Service architecture is ready. Assembly logic is not implemented.",
    };
  }

  async assembleRepository(
    _planId: string,
    context: EngineContext,
  ): Promise<EngineResult<RepositoryOutput>> {
    assertEngineContext(context);
    return blockedCapability("repository", "assembleRepository");
  }

  async validateRepository(
    _planId: string,
    context: EngineContext,
  ): Promise<EngineResult<RepositoryPlan>> {
    assertEngineContext(context);
    return blockedCapability("repository", "validateRepository");
  }

  async getRepositoryStatus(
    _planId: string,
    context: EngineContext,
  ): Promise<EngineResult<RepositoryPlan>> {
    assertEngineContext(context);
    return blockedCapability("repository", "getRepositoryStatus");
  }
}

export const repositoryService: IRepositoryService = new RepositoryService();
