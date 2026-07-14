import type { EngineContext, EngineResult } from "../types";
import { assertEngineContext, blockedCapability } from "../shared";
import type {
  DiscoveryInput,
  DiscoveryOutput,
  DiscoverySession,
  IDiscoveryService,
} from "./types";

/**
 * Discovery service boundary — placeholder implementation.
 */
export class DiscoveryService implements IDiscoveryService {
  readonly serviceId = "discovery.service" as const;
  readonly engineId = "discovery" as const;

  async initializeSession(context: EngineContext): Promise<DiscoverySession> {
    assertEngineContext(context);

    return {
      sessionId: `discovery-${context.requestId}`,
      projectId: context.projectId,
      status: "blocked",
    };
  }

  async processTurn(
    _input: DiscoveryInput,
    context: EngineContext,
  ): Promise<EngineResult<DiscoveryOutput>> {
    assertEngineContext(context);
    return blockedCapability("discovery", "processTurn");
  }

  async getSessionStatus(
    _sessionId: string,
    context: EngineContext,
  ): Promise<EngineResult<DiscoverySession>> {
    assertEngineContext(context);
    return blockedCapability("discovery", "getSessionStatus");
  }
}

export const discoveryService: IDiscoveryService = new DiscoveryService();
