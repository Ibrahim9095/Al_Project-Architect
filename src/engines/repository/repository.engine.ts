import type { EngineContext, EngineResult, PlatformEngine } from "../types";
import { assertEngineContext, blockedCapability } from "../shared";
import { repositoryService } from "./repository.service";
import type {
  IRepositoryService,
  RepositoryEngineInput,
  RepositoryEngineOutput,
} from "./types";

/**
 * Repository Engine orchestrator.
 * Coordinates repository services; contains no assembly logic.
 */
export class RepositoryEngine
  implements PlatformEngine<RepositoryEngineInput, RepositoryEngineOutput>
{
  readonly id = "repository" as const;
  readonly name = "Repository Engine";

  constructor(
    private readonly service: IRepositoryService = repositoryService,
  ) {}

  async run(
    input: RepositoryEngineInput,
    context: EngineContext,
  ): Promise<EngineResult<RepositoryEngineOutput>> {
    assertEngineContext(context);

    switch (input.action) {
      case "plan": {
        if (!input.input?.complexity) {
          return {
            status: "blocked",
            engineId: this.id,
            missingInformation: ["input.complexity"],
            message: "complexity is required for plan action.",
          };
        }

        const result = await this.service.planRepository(input.input, context);
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
            plan: result.data,
            pendingCapabilities: [
              "assembleRepository",
              "validateRepository",
              "getRepositoryStatus",
            ],
          },
          message:
            "Repository Engine architecture is ready. Business logic is not implemented.",
        };
      }
      case "assemble": {
        if (!input.input?.planId) {
          return {
            status: "blocked",
            engineId: this.id,
            missingInformation: ["input.planId"],
            message: "planId is required for assemble action.",
          };
        }
        return this.service.assembleRepository(input.input.planId, context);
      }
      case "validate": {
        if (!input.input?.planId) {
          return {
            status: "blocked",
            engineId: this.id,
            missingInformation: ["input.planId"],
            message: "planId is required for validate action.",
          };
        }
        const result = await this.service.validateRepository(
          input.input.planId,
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
            plan: result.data,
            pendingCapabilities: ["assembleRepository"],
          },
          message: result.message,
        };
      }
      case "status": {
        if (!input.input?.planId) {
          return {
            status: "blocked",
            engineId: this.id,
            missingInformation: ["input.planId"],
            message: "planId is required for status action.",
          };
        }
        const result = await this.service.getRepositoryStatus(
          input.input.planId,
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
            plan: result.data,
            pendingCapabilities: ["assembleRepository", "validateRepository"],
          },
          message: result.message,
        };
      }
      default:
        return blockedCapability("repository", String(input.action));
    }
  }
}

export const repositoryEngine = new RepositoryEngine();
