import type { EngineContext, EngineResult } from "../types";

/**
 * Documentation Engine contracts.
 * Boundary: engineering documentation generation orchestration.
 * No template rendering or prompt execution at this layer.
 */

export type DocumentationArtifactKind =
  | "vision"
  | "scope"
  | "requirements"
  | "business_rules"
  | "modules"
  | "database"
  | "api"
  | "tasks"
  | "testing"
  | "roadmap";

export type DocumentationJobStatus =
  | "queued"
  | "generating"
  | "completed"
  | "blocked";

export interface DocumentationArtifactRef {
  kind: DocumentationArtifactKind;
  path?: string;
}

export interface DocumentationJob {
  jobId: string;
  projectId: string;
  artifacts: DocumentationArtifactRef[];
  status: DocumentationJobStatus;
}

export interface DocumentationInput {
  artifacts: DocumentationArtifactKind[];
  /** Opaque generation options; interpretation deferred. */
  options?: Record<string, unknown>;
}

export interface DocumentationOutput {
  job: DocumentationJob;
  pendingCapabilities: string[];
}

export interface DocumentationEngineInput {
  action: "plan" | "generate" | "status";
  input?: DocumentationInput & { jobId?: string };
}

export type DocumentationEngineOutput = DocumentationOutput;

export interface IDocumentationService {
  readonly serviceId: "documentation.service";
  readonly engineId: "documentation";

  planArtifacts(
    input: DocumentationInput,
    context: EngineContext,
  ): Promise<EngineResult<DocumentationJob>>;
  generateArtifacts(
    jobId: string,
    context: EngineContext,
  ): Promise<EngineResult<DocumentationOutput>>;
  getDocumentationStatus(
    jobId: string,
    context: EngineContext,
  ): Promise<EngineResult<DocumentationJob>>;
}
