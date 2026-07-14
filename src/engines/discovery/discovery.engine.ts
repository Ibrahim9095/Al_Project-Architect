import type { EngineContext, EngineResult, PlatformEngine } from "../types";
import { assertEngineContext, blockedCapability } from "../shared";
import { discoveryService } from "./discovery.service";
import type {
  DiscoveryEngineInput,
  DiscoveryEngineOutput,
  IDiscoveryService,
} from "./types";

/**
 * Discovery Engine orchestrator.
 * Coordinates discovery services; contains no discovery business logic.
 */
export class DiscoveryEngine
  implements PlatformEngine<DiscoveryEngineInput, DiscoveryEngineOutput>
{
  readonly id = "discovery" as const;
  readonly name = "Discovery Engine";

  constructor(private readonly service: IDiscoveryService = discoveryService) {}

  async run(
    input: DiscoveryEngineInput,
    context: EngineContext,
  ): Promise<EngineResult<DiscoveryEngineOutput>> {
    assertEngineContext(context);

    switch (input.action) {
      case "initialize": {
        const session = await this.service.initializeSession(context);
        return {
          status: "blocked",
          engineId: this.id,
          data: {
            session,
            pendingCapabilities: [
              "processTurn",
              "getSessionStatus",
              "adaptiveQuestioning",
            ],
          },
          message:
            "Discovery Engine architecture is ready. Business logic is not implemented.",
        };
      }
      case "process":
        return this.service.processTurn(input.input ?? {}, context);
      case "status": {
        if (!input.input?.sessionId) {
          return {
            status: "blocked",
            engineId: this.id,
            missingInformation: ["input.sessionId"],
            message: "sessionId is required for status action.",
          };
        }
        const result = await this.service.getSessionStatus(
          input.input.sessionId,
          context,
        );
        if (result.status !== "complete" || !result.data) {
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
            session: result.data,
            pendingCapabilities: ["processTurn"],
          },
          message: result.message,
        };
      }
      default:
        return blockedCapability("discovery", String(input.action));
    }
  }
}

export const discoveryEngine = new DiscoveryEngine();
