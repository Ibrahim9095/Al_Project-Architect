import type { EngineContext, EngineResult } from "../types";

/**
 * Export Engine contracts.
 * Boundary: validated artifact packaging and distribution orchestration.
 * No ZIP generation or file IO at this layer.
 */

export type ExportFormat = "zip" | "markdown_bundle" | "ai_context";

export type ExportJobStatus =
  | "queued"
  | "packaging"
  | "completed"
  | "blocked";

export interface ExportManifest {
  exportId: string;
  projectId: string;
  format: ExportFormat;
  artifactPaths: string[];
  status: ExportJobStatus;
}

export interface ExportInput {
  format: ExportFormat;
  artifactPaths?: string[];
  /** Opaque packaging options; interpretation deferred. */
  options?: Record<string, unknown>;
}

export interface ExportOutput {
  manifest: ExportManifest;
  pendingCapabilities: string[];
}

export interface ExportEngineInput {
  action: "prepare" | "package" | "validate" | "status";
  input?: ExportInput & { exportId?: string };
}

export type ExportEngineOutput = ExportOutput;

export interface IExportService {
  readonly serviceId: "export.service";
  readonly engineId: "export";

  prepareExport(
    input: ExportInput,
    context: EngineContext,
  ): Promise<EngineResult<ExportManifest>>;
  packageExport(
    exportId: string,
    context: EngineContext,
  ): Promise<EngineResult<ExportOutput>>;
  validateExport(
    exportId: string,
    context: EngineContext,
  ): Promise<EngineResult<ExportManifest>>;
  getExportStatus(
    exportId: string,
    context: EngineContext,
  ): Promise<EngineResult<ExportManifest>>;
}
