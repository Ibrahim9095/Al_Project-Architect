import type { EngineContext, EngineResult } from "../types";
import { assertEngineContext, blockedCapability } from "../shared";
import type {
  DocumentationInput,
  DocumentationJob,
  DocumentationOutput,
  IDocumentationService,
} from "./types";

/**
 * Documentation service boundary — placeholder implementation.
 */
export class DocumentationService implements IDocumentationService {
  readonly serviceId = "documentation.service" as const;
  readonly engineId = "documentation" as const;

  async planArtifacts(
    input: DocumentationInput,
    context: EngineContext,
  ): Promise<EngineResult<DocumentationJob>> {
    assertEngineContext(context);

    return {
      status: "blocked",
      engineId: this.engineId,
      data: {
        jobId: `documentation-${context.requestId}`,
        projectId: context.projectId,
        artifacts: input.artifacts.map((kind) => ({ kind })),
        status: "blocked",
      },
      message:
        "Documentation Service architecture is ready. Generation logic is not implemented.",
    };
  }

  async generateArtifacts(
    _jobId: string,
    context: EngineContext,
  ): Promise<EngineResult<DocumentationOutput>> {
    assertEngineContext(context);
    return blockedCapability("documentation", "generateArtifacts");
  }

  async getDocumentationStatus(
    _jobId: string,
    context: EngineContext,
  ): Promise<EngineResult<DocumentationJob>> {
    assertEngineContext(context);
    return blockedCapability("documentation", "getDocumentationStatus");
  }
}

export const documentationService: IDocumentationService =
  new DocumentationService();
