import type { EngineContext, EngineResult, PlatformEngine } from "../types";
import { assertEngineContext, blockedCapability } from "../shared";
import { exportService } from "./export.service";
import type {
  ExportEngineInput,
  ExportEngineOutput,
  IExportService,
} from "./types";

/**
 * Export Engine orchestrator.
 * Coordinates export services; contains no packaging logic.
 */
export class ExportEngine
  implements PlatformEngine<ExportEngineInput, ExportEngineOutput>
{
  readonly id = "export" as const;
  readonly name = "Export Engine";

  constructor(private readonly service: IExportService = exportService) {}

  async run(
    input: ExportEngineInput,
    context: EngineContext,
  ): Promise<EngineResult<ExportEngineOutput>> {
    assertEngineContext(context);

    switch (input.action) {
      case "prepare": {
        if (!input.input?.format) {
          return {
            status: "blocked",
            engineId: this.id,
            missingInformation: ["input.format"],
            message: "format is required for prepare action.",
          };
        }

        const result = await this.service.prepareExport(input.input, context);
        if (!result.data) {
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
            manifest: result.data,
            pendingCapabilities: [
              "packageExport",
              "validateExport",
              "getExportStatus",
            ],
          },
          message:
            "Export Engine architecture is ready. Business logic is not implemented.",
        };
      }
      case "package": {
        if (!input.input?.exportId) {
          return {
            status: "blocked",
            engineId: this.id,
            missingInformation: ["input.exportId"],
            message: "exportId is required for package action.",
          };
        }
        return this.service.packageExport(input.input.exportId, context);
      }
      case "validate": {
        if (!input.input?.exportId) {
          return {
            status: "blocked",
            engineId: this.id,
            missingInformation: ["input.exportId"],
            message: "exportId is required for validate action.",
          };
        }
        const result = await this.service.validateExport(
          input.input.exportId,
          context,
        );
        if (!result.data) {
          return {
            status: result.status,
            engineId: this.id,
            message: result.message,
            missingInformation: result.missingInformation,
          };
        }
        return {
          status: result.status,
          engineId: this.id,
          data: {
            manifest: result.data,
            pendingCapabilities: ["packageExport"],
          },
          message: result.message,
        };
      }
      case "status": {
        if (!input.input?.exportId) {
          return {
            status: "blocked",
            engineId: this.id,
            missingInformation: ["input.exportId"],
            message: "exportId is required for status action.",
          };
        }
        const result = await this.service.getExportStatus(
          input.input.exportId,
          context,
        );
        if (!result.data) {
          return {
            status: result.status,
            engineId: this.id,
            message: result.message,
            missingInformation: result.missingInformation,
          };
        }
        return {
          status: result.status,
          engineId: this.id,
          data: {
            manifest: result.data,
            pendingCapabilities: ["packageExport", "validateExport"],
          },
          message: result.message,
        };
      }
      default:
        return blockedCapability("export", String(input.action));
    }
  }
}

export const exportEngine = new ExportEngine();
