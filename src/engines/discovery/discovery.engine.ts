import type { EngineContext, EngineResult, PlatformEngine } from "../types";
import { assertEngineContext, blockedCapability } from "../shared";
import { discoveryService } from "./discovery.service";
import type {
  DiscoveryEngineInput,
  DiscoveryEngineOutput,
  DiscoverySession,
  IDiscoveryService,
} from "./types";

/**
 * Discovery Engine orchestrator.
 * Coordinates discovery workflow services.
 */
export class DiscoveryEngine
  implements PlatformEngine<DiscoveryEngineInput, DiscoveryEngineOutput>
{
  readonly id = "discovery" as const;
  readonly name = "Discovery Engine";

  constructor(private readonly service: IDiscoveryService = discoveryService) {}

  async run(
    input: DiscoveryEngineInput,
    context: EngineContext,
  ): Promise<EngineResult<DiscoveryEngineOutput>> {
    assertEngineContext(context);

    switch (input.action) {
      case "initialize": {
        const session = await this.service.initializeSession(context);
        const stepsResult = await this.service.getSteps(session.answers, context);

        return {
          status: "complete",
          engineId: this.id,
          data: {
            session,
            steps: stepsResult.data?.steps ?? [],
            pendingCapabilities: [],
          },
          message: "Discovery session initialized.",
        };
      }

      case "get_steps": {
        const answers = input.input?.answers ?? {};
        const stepsResult = await this.service.getSteps(answers, context);
        const session = this.createTransientSession(context, answers, input);

        return {
          status: "complete",
          engineId: this.id,
          data: {
            session,
            steps: stepsResult.data?.steps ?? [],
            pendingCapabilities: [],
          },
        };
      }

      case "save_answers": {
        const answers = input.input?.answers ?? {};
        const baseSession = this.createTransientSession(context, answers, input);
        const saved = await this.service.saveAnswers(baseSession, answers, context);
        const stepsResult = await this.service.getSteps(
          saved.data?.answers ?? answers,
          context,
        );

        return {
          status: saved.status,
          engineId: this.id,
          data: {
            session: saved.data ?? baseSession,
            steps: stepsResult.data?.steps ?? [],
            pendingCapabilities: [],
          },
          message: saved.message,
        };
      }

      case "validate_step": {
        if (!input.input?.stepId) {
          return {
            status: "blocked",
            engineId: this.id,
            missingInformation: ["input.stepId"],
            message: "stepId is required for validate_step.",
          };
        }

        const answers = input.input.answers ?? {};
        const validation = await this.service.validateStep(
          input.input.stepId,
          answers,
          context,
        );
        const stepsResult = await this.service.getSteps(answers, context);

        return {
          status: validation.status,
          engineId: this.id,
          data: {
            session: this.createTransientSession(context, answers, input),
            steps: stepsResult.data?.steps ?? [],
            validation: validation.data,
            pendingCapabilities: [],
          },
          message: validation.message,
          missingInformation: validation.missingInformation,
        };
      }

      case "complete": {
        const answers = input.input?.answers ?? {};
        const completed = await this.service.completeDiscovery(answers, context);
        const stepsResult = await this.service.getSteps(answers, context);

        if (completed.status !== "complete" || !completed.data) {
          return {
            status: "blocked",
            engineId: this.id,
            message: completed.message,
            missingInformation: completed.missingInformation,
            data: {
              session: this.createTransientSession(
                context,
                answers,
                input,
                "validating",
              ),
              steps: stepsResult.data?.steps ?? [],
              discoveryJson: completed.data?.discoveryJson,
              normalizedDiscovery: completed.data?.normalizedDiscovery,
              normalizationErrors: completed.data?.normalization.errors,
              pendingCapabilities: [],
            },
          };
        }

        return {
          status: "complete",
          engineId: this.id,
          data: {
            session: this.createTransientSession(
              context,
              answers,
              input,
              "completed",
            ),
            steps: stepsResult.data?.steps ?? [],
            discoveryJson: completed.data.discoveryJson,
            normalizedDiscovery: completed.data.normalizedDiscovery,
            pendingCapabilities: [],
          },
          message: "Normalized Discovery Schema generated.",
        };
      }

      case "process":
        return this.run(
          { action: "save_answers", input: input.input },
          context,
        );

      case "status": {
        if (!input.input?.sessionId) {
          return {
            status: "blocked",
            engineId: this.id,
            missingInformation: ["input.sessionId"],
            message: "sessionId is required for status action.",
          };
        }

        const result = await this.service.getSessionStatus(
          input.input.sessionId,
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

        const stepsResult = await this.service.getSteps(
          result.data.answers,
          context,
        );

        return {
          status: "complete",
          engineId: this.id,
          data: {
            session: result.data,
            steps: stepsResult.data?.steps ?? [],
            pendingCapabilities: [],
          },
        };
      }

      default:
        return blockedCapability("discovery", String(input.action));
    }
  }

  private createTransientSession(
    context: EngineContext,
    answers: DiscoverySession["answers"],
    input: DiscoveryEngineInput,
    status: DiscoverySession["status"] = "collecting",
  ): DiscoverySession {
    return {
      sessionId: input.input?.sessionId ?? `discovery-${context.requestId}`,
      projectId: context.projectId,
      status,
      answers,
      currentStepIndex: input.input?.currentStepIndex ?? 0,
    };
  }
}

export const discoveryEngine = new DiscoveryEngine();
