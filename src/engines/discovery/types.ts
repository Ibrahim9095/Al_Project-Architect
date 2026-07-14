import type { EngineContext, EngineResult } from "../types";

/**
 * Discovery Engine contracts.
 * Boundary: adaptive project discovery session orchestration.
 * No business logic or prompt execution at this layer.
 */

export type DiscoverySessionStatus =
  | "initialized"
  | "collecting"
  | "validating"
  | "completed"
  | "blocked";

export interface DiscoverySession {
  sessionId: string;
  projectId: string;
  status: DiscoverySessionStatus;
}

export interface DiscoveryInput {
  sessionId?: string;
  /** Opaque client payload; interpretation is deferred to implementation. */
  payload?: Record<string, unknown>;
}

export interface DiscoveryOutput {
  session: DiscoverySession;
  pendingCapabilities: string[];
}

export interface DiscoveryEngineInput {
  action: "initialize" | "process" | "status";
  input?: DiscoveryInput;
}

export type DiscoveryEngineOutput = DiscoveryOutput;

export interface IDiscoveryService {
  readonly serviceId: "discovery.service";
  readonly engineId: "discovery";

  initializeSession(context: EngineContext): Promise<DiscoverySession>;
  processTurn(
    input: DiscoveryInput,
    context: EngineContext,
  ): Promise<EngineResult<DiscoveryOutput>>;
  getSessionStatus(
    sessionId: string,
    context: EngineContext,
  ): Promise<EngineResult<DiscoverySession>>;
}
