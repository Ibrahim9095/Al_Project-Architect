import type { EngineContext, EngineResult } from "../types";

/**
 * Analysis Engine contracts.
 * Boundary: requirement and business analysis orchestration.
 * No analysis algorithms or AI execution at this layer.
 */

export type AnalysisStage =
  | "requirements"
  | "business_rules"
  | "consistency"
  | "risk";

export type AnalysisJobStatus =
  | "queued"
  | "running"
  | "completed"
  | "blocked";

export interface AnalysisJob {
  jobId: string;
  projectId: string;
  stage: AnalysisStage;
  status: AnalysisJobStatus;
}

export interface AnalysisInput {
  stage: AnalysisStage;
  /** Opaque analysis payload; interpretation deferred. */
  payload?: Record<string, unknown>;
}

export interface AnalysisOutput {
  job: AnalysisJob;
  pendingCapabilities: string[];
}

export interface AnalysisEngineInput {
  action: "start" | "status" | "summarize";
  input?: AnalysisInput & { jobId?: string };
}

export type AnalysisEngineOutput = AnalysisOutput;

export interface IAnalysisService {
  readonly serviceId: "analysis.service";
  readonly engineId: "analysis";

  startAnalysis(
    input: AnalysisInput,
    context: EngineContext,
  ): Promise<EngineResult<AnalysisJob>>;
  getAnalysisStatus(
    jobId: string,
    context: EngineContext,
  ): Promise<EngineResult<AnalysisJob>>;
  summarizeAnalysis(
    jobId: string,
    context: EngineContext,
  ): Promise<EngineResult<AnalysisOutput>>;
}
