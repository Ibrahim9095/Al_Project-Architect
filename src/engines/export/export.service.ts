import type { EngineContext, EngineResult } from "../types";
import { assertEngineContext, blockedCapability } from "../shared";
import type {
  ExportInput,
  ExportManifest,
  ExportOutput,
  IExportService,
} from "./types";

/**
 * Export service boundary — placeholder implementation.
 */
export class ExportService implements IExportService {
  readonly serviceId = "export.service" as const;
  readonly engineId = "export" as const;

  async prepareExport(
    input: ExportInput,
    context: EngineContext,
  ): Promise<EngineResult<ExportManifest>> {
    assertEngineContext(context);

    return {
      status: "blocked",
      engineId: this.engineId,
      data: {
        exportId: `export-${context.requestId}`,
        projectId: context.projectId,
        format: input.format,
        artifactPaths: input.artifactPaths ?? [],
        status: "blocked",
      },
      message:
        "Export Service architecture is ready. Packaging logic is not implemented.",
    };
  }

  async packageExport(
    _exportId: string,
    context: EngineContext,
  ): Promise<EngineResult<ExportOutput>> {
    assertEngineContext(context);
    return blockedCapability("export", "packageExport");
  }

  async validateExport(
    _exportId: string,
    context: EngineContext,
  ): Promise<EngineResult<ExportManifest>> {
    assertEngineContext(context);
    return blockedCapability("export", "validateExport");
  }

  async getExportStatus(
    _exportId: string,
    context: EngineContext,
  ): Promise<EngineResult<ExportManifest>> {
    assertEngineContext(context);
    return blockedCapability("export", "getExportStatus");
  }
}

export const exportService: IExportService = new ExportService();
