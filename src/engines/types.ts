/**
 * Engine contracts for the AI Project Architect orchestration layer.
 * Engines must not invent requirements; they operate on validated inputs.
 */

export type EngineResultStatus = "ready" | "blocked" | "complete";

export interface EngineContext {
  projectId: string;
  requestId: string;
}

export interface EngineResult<T = unknown> {
  status: EngineResultStatus;
  data?: T;
  missingInformation?: string[];
  message?: string;
}

export interface PlatformEngine<TInput = unknown, TOutput = unknown> {
  readonly id: string;
  readonly name: string;
  run(input: TInput, context: EngineContext): Promise<EngineResult<TOutput>>;
}
