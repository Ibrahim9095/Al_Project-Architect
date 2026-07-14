import type { EngineContext, EngineResult } from "../types";

/**
 * Repository Engine contracts.
 * Boundary: repository assembly orchestration.
 * No file generation or template materialization at this layer.
 */

export type RepositoryComplexity =
  | "tiny"
  | "small"
  | "medium"
  | "large"
  | "enterprise";

export type RepositoryJobStatus =
  | "queued"
  | "assembling"
  | "completed"
  | "blocked";

export interface RepositoryPlan {
  planId: string;
  projectId: string;
  complexity: RepositoryComplexity;
  includePaths: string[];
  status: RepositoryJobStatus;
}

export interface RepositoryInput {
  complexity: RepositoryComplexity;
  includePaths?: string[];
  /** Opaque assembly options; interpretation deferred. */
  options?: Record<string, unknown>;
}

export interface RepositoryOutput {
  plan: RepositoryPlan;
  pendingCapabilities: string[];
}

export interface RepositoryEngineInput {
  action: "plan" | "assemble" | "validate" | "status";
  input?: RepositoryInput & { planId?: string };
}

export type RepositoryEngineOutput = RepositoryOutput;

export interface IRepositoryService {
  readonly serviceId: "repository.service";
  readonly engineId: "repository";

  planRepository(
    input: RepositoryInput,
    context: EngineContext,
  ): Promise<EngineResult<RepositoryPlan>>;
  assembleRepository(
    planId: string,
    context: EngineContext,
  ): Promise<EngineResult<RepositoryOutput>>;
  validateRepository(
    planId: string,
    context: EngineContext,
  ): Promise<EngineResult<RepositoryPlan>>;
  getRepositoryStatus(
    planId: string,
    context: EngineContext,
  ): Promise<EngineResult<RepositoryPlan>>;
}
