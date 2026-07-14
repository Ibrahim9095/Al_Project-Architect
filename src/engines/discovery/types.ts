import type { EngineContext, EngineResult } from "../types";
import type {
  DiscoveryAnswers,
  DiscoveryJson,
  DiscoveryStepDefinition,
  DiscoveryValidationResult,
} from "./catalog";

export type {
  DiscoveryAnswers,
  DiscoveryJson,
  DiscoveryStepDefinition,
  DiscoveryValidationResult,
} from "./catalog";

/**
 * Discovery Engine contracts.
 * Boundary: adaptive project discovery session orchestration.
 */

export type DiscoverySessionStatus =
  | "initialized"
  | "collecting"
  | "validating"
  | "completed"
  | "blocked";

export interface DiscoverySession {
  sessionId: string;
  projectId: string;
  status: DiscoverySessionStatus;
  answers: DiscoveryAnswers;
  currentStepIndex: number;
}

export interface DiscoveryInput {
  sessionId?: string;
  action?:
    | "initialize"
    | "get_steps"
    | "save_answers"
    | "validate_step"
    | "complete";
  stepId?: string;
  answers?: DiscoveryAnswers;
  currentStepIndex?: number;
}

export interface DiscoveryOutput {
  session: DiscoverySession;
  steps: DiscoveryStepDefinition[];
  validation?: DiscoveryValidationResult;
  discoveryJson?: DiscoveryJson;
  pendingCapabilities: string[];
}

export interface DiscoveryEngineInput {
  action:
    | "initialize"
    | "get_steps"
    | "save_answers"
    | "validate_step"
    | "complete"
    | "process"
    | "status";
  input?: DiscoveryInput;
}

export type DiscoveryEngineOutput = DiscoveryOutput;

export interface IDiscoveryService {
  readonly serviceId: "discovery.service";
  readonly engineId: "discovery";

  initializeSession(context: EngineContext): Promise<DiscoverySession>;
  getSteps(
    answers: DiscoveryAnswers,
    context: EngineContext,
  ): Promise<EngineResult<{ steps: DiscoveryStepDefinition[] }>>;
  saveAnswers(
    session: DiscoverySession,
    answers: DiscoveryAnswers,
    context: EngineContext,
  ): Promise<EngineResult<DiscoverySession>>;
  validateStep(
    stepId: string,
    answers: DiscoveryAnswers,
    context: EngineContext,
  ): Promise<EngineResult<DiscoveryValidationResult>>;
  completeDiscovery(
    answers: DiscoveryAnswers,
    context: EngineContext,
  ): Promise<EngineResult<DiscoveryJson>>;
  getSessionStatus(
    sessionId: string,
    context: EngineContext,
  ): Promise<EngineResult<DiscoverySession>>;
}
