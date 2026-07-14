/**
 * Shared engine contracts for the AI Project Architect orchestration layer.
 * Engines must not invent requirements; they operate on validated inputs.
 */

export type EngineId =
  | "discovery"
  | "analysis"
  | "classification"
  | "documentation"
  | "repository"
  | "export";

export type EngineResultStatus =
  | "ready"
  | "blocked"
  | "complete"
  | "not_implemented";

export interface EngineContext {
  projectId: string;
  requestId: string;
  correlationId?: string;
}

export interface EngineResult<T = unknown> {
  status: EngineResultStatus;
  data?: T;
  missingInformation?: string[];
  message?: string;
  engineId?: EngineId;
}

export interface PlatformEngine<TInput = unknown, TOutput = unknown> {
  readonly id: EngineId;
  readonly name: string;
  run(input: TInput, context: EngineContext): Promise<EngineResult<TOutput>>;
}

/**
 * Service boundary contract.
 * Services encapsulate engine capabilities; engines orchestrate services.
 */
export interface EngineService {
  readonly serviceId: string;
  readonly engineId: EngineId;
}

export function createNotImplementedResult<T = never>(
  engineId: EngineId,
  capability: string,
): EngineResult<T> {
  return {
    status: "not_implemented",
    engineId,
    message: `${engineId} capability "${capability}" is architected but not implemented.`,
  };
}
