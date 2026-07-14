import type { EngineContext, EngineResult, PlatformEngine } from "../types";
import { assertEngineContext, blockedCapability } from "../shared";
import { documentationService } from "./documentation.service";
import type {
  DocumentationEngineInput,
  DocumentationEngineOutput,
  IDocumentationService,
} from "./types";

/**
 * Documentation Engine orchestrator.
 * Coordinates documentation services; contains no generation logic.
 */
export class DocumentationEngine
  implements
    PlatformEngine<DocumentationEngineInput, DocumentationEngineOutput>
{
  readonly id = "documentation" as const;
  readonly name = "Documentation Engine";

  constructor(
    private readonly service: IDocumentationService = documentationService,
  ) {}

  async run(
    input: DocumentationEngineInput,
    context: EngineContext,
  ): Promise<EngineResult<DocumentationEngineOutput>> {
    assertEngineContext(context);

    switch (input.action) {
      case "plan": {
        if (!input.input?.artifacts?.length) {
          return {
            status: "blocked",
            engineId: this.id,
            missingInformation: ["input.artifacts"],
            message: "artifacts are required for plan action.",
          };
        }

        const result = await this.service.planArtifacts(input.input, context);
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
            job: result.data,
            pendingCapabilities: [
              "generateArtifacts",
              "getDocumentationStatus",
              "templateBinding",
            ],
          },
          message:
            "Documentation Engine architecture is ready. Business logic is not implemented.",
        };
      }
      case "generate": {
        if (!input.input?.jobId) {
          return {
            status: "blocked",
            engineId: this.id,
            missingInformation: ["input.jobId"],
            message: "jobId is required for generate action.",
          };
        }
        return this.service.generateArtifacts(input.input.jobId, context);
      }
      case "status": {
        if (!input.input?.jobId) {
          return {
            status: "blocked",
            engineId: this.id,
            missingInformation: ["input.jobId"],
            message: "jobId is required for status action.",
          };
        }
        const result = await this.service.getDocumentationStatus(
          input.input.jobId,
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
            job: result.data,
            pendingCapabilities: ["generateArtifacts"],
          },
          message: result.message,
        };
      }
      default:
        return blockedCapability("documentation", String(input.action));
    }
  }
}

export const documentationEngine = new DocumentationEngine();
