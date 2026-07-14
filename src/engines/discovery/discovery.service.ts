import type { EngineContext, EngineResult } from "../types";
import { assertEngineContext } from "../shared";
import {
  buildDiscoveryJson,
  buildDiscoverySteps,
  validateCompleteDiscovery,
  validateDiscoveryStep,
} from "./catalog";
import {
  normalizeDiscoveryAnswers,
  validateNormalizedDiscovery,
} from "./normalization";
import type {
  DiscoveryAnswers,
  DiscoveryCompletionResult,
  DiscoverySession,
  DiscoveryValidationResult,
  IDiscoveryService,
} from "./types";
import type { DiscoveryStepDefinition } from "./catalog";

/**
 * In-memory session store for the Discovery Engine foundation.
 * Replace with persistent storage in a later phase.
 */
const sessions = new Map<string, DiscoverySession>();

export class DiscoveryService implements IDiscoveryService {
  readonly serviceId = "discovery.service" as const;
  readonly engineId = "discovery" as const;

  async initializeSession(context: EngineContext): Promise<DiscoverySession> {
    assertEngineContext(context);

    const session: DiscoverySession = {
      sessionId: `discovery-${context.requestId}`,
      projectId: context.projectId,
      status: "collecting",
      answers: {},
      currentStepIndex: 0,
    };

    sessions.set(session.sessionId, session);
    return session;
  }

  async getSteps(
    answers: DiscoveryAnswers,
    context: EngineContext,
  ): Promise<EngineResult<{ steps: DiscoveryStepDefinition[] }>> {
    assertEngineContext(context);

    return {
      status: "complete",
      engineId: this.engineId,
      data: {
        steps: buildDiscoverySteps(answers),
      },
    };
  }

  async saveAnswers(
    session: DiscoverySession,
    answers: DiscoveryAnswers,
    context: EngineContext,
  ): Promise<EngineResult<DiscoverySession>> {
    assertEngineContext(context);

    const nextSession: DiscoverySession = {
      ...session,
      answers: {
        ...session.answers,
        ...answers,
      },
      status: "collecting",
    };

    sessions.set(nextSession.sessionId, nextSession);

    return {
      status: "complete",
      engineId: this.engineId,
      data: nextSession,
    };
  }

  async validateStep(
    stepId: string,
    answers: DiscoveryAnswers,
    context: EngineContext,
  ): Promise<EngineResult<DiscoveryValidationResult>> {
    assertEngineContext(context);

    const steps = buildDiscoverySteps(answers);
    const step = steps.find((item) => item.id === stepId);

    if (!step) {
      return {
        status: "blocked",
        engineId: this.engineId,
        missingInformation: ["stepId"],
        message: `Unknown discovery step: ${stepId}`,
      };
    }

    return {
      status: "complete",
      engineId: this.engineId,
      data: validateDiscoveryStep(step, answers),
    };
  }

  async completeDiscovery(
    answers: DiscoveryAnswers,
    context: EngineContext,
  ): Promise<EngineResult<DiscoveryCompletionResult>> {
    assertEngineContext(context);

    const validation = validateCompleteDiscovery(answers);
    if (!validation.valid) {
      return {
        status: "blocked",
        engineId: this.engineId,
        missingInformation: Object.keys(validation.errors),
        message: "Discovery answers are incomplete.",
        data: undefined,
      };
    }

    const discoveryJson = buildDiscoveryJson(answers);
    const normalizedDiscovery = normalizeDiscoveryAnswers(answers);
    const normalization = validateNormalizedDiscovery(normalizedDiscovery);

    if (!normalization.valid) {
      return {
        status: "blocked",
        engineId: this.engineId,
        missingInformation: normalization.errors,
        message: "Normalized Discovery Schema validation failed.",
        data: {
          discoveryJson,
          normalizedDiscovery,
          normalization,
        },
      };
    }

    return {
      status: "complete",
      engineId: this.engineId,
      data: {
        discoveryJson,
        normalizedDiscovery,
        normalization,
      },
      message: "Discovery normalized successfully.",
    };
  }

  async getSessionStatus(
    sessionId: string,
    context: EngineContext,
  ): Promise<EngineResult<DiscoverySession>> {
    assertEngineContext(context);

    const session = sessions.get(sessionId);
    if (!session) {
      return {
        status: "blocked",
        engineId: this.engineId,
        missingInformation: ["sessionId"],
        message: "Discovery session not found.",
      };
    }

    return {
      status: "complete",
      engineId: this.engineId,
      data: session,
    };
  }
}

export const discoveryService: IDiscoveryService = new DiscoveryService();

/** Pure helpers for client-side Discovery Wizard usage. */
export const discoveryWorkflow = {
  buildSteps: buildDiscoverySteps,
  validateStep: validateDiscoveryStep,
  validateComplete: validateCompleteDiscovery,
  buildJson: buildDiscoveryJson,
  normalizeAnswers: normalizeDiscoveryAnswers,
  validateNormalized: validateNormalizedDiscovery,
};
