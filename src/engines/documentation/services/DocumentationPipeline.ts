import type {
  DocumentationPipelineStage,
  DocumentationPipelineStageId,
  DocumentationPipelineState,
} from "../types.js";

const STAGE_DEFINITIONS: Array<{
  id: DocumentationPipelineStageId;
  name: string;
}> = [
  {
    id: "accept_engineering_model",
    name: "Accept Engineering Model",
  },
  {
    id: "validate_engineering_model",
    name: "Validate Engineering Model",
  },
  {
    id: "bind_source_of_truth",
    name: "Bind Engineering Model as Source of Truth",
  },
  {
    id: "select_document_plan",
    name: "Select Document Plan",
  },
  {
    id: "verify_generator_contracts",
    name: "Verify Generator Contracts",
  },
  {
    id: "build_traceability_map",
    name: "Build Traceability Map",
  },
  {
    id: "approve_pipeline_readiness",
    name: "Approve Pipeline Readiness",
  },
];

export function createInitialPipelineState(): DocumentationPipelineState {
  return {
    stages: STAGE_DEFINITIONS.map((stage) => ({
      id: stage.id,
      name: stage.name,
      status: "pending",
    })),
    currentStage: "accept_engineering_model",
    readyForGenerators: false,
    blockedReasons: [],
  };
}

export function completeStage(
  state: DocumentationPipelineState,
  id: DocumentationPipelineStageId,
  detail?: string,
): DocumentationPipelineState {
  const stages = state.stages.map((stage) =>
    stage.id === id
      ? ({ ...stage, status: "completed", detail } satisfies DocumentationPipelineStage)
      : stage,
  );

  const order = STAGE_DEFINITIONS.map((stage) => stage.id);
  const index = order.indexOf(id);
  const next = order[index + 1] ?? null;

  return {
    ...state,
    stages,
    currentStage: next,
  };
}

export function blockStage(
  state: DocumentationPipelineState,
  id: DocumentationPipelineStageId,
  reason: string,
): DocumentationPipelineState {
  const stages = state.stages.map((stage) =>
    stage.id === id
      ? ({ ...stage, status: "blocked", detail: reason } satisfies DocumentationPipelineStage)
      : stage,
  );

  return {
    ...state,
    stages,
    currentStage: id,
    readyForGenerators: false,
    blockedReasons: [...state.blockedReasons, reason],
  };
}

export function approvePipeline(
  state: DocumentationPipelineState,
  readyForGenerators: boolean,
  detail?: string,
): DocumentationPipelineState {
  const withApproval = completeStage(
    state,
    "approve_pipeline_readiness",
    detail ??
      (readyForGenerators
        ? "Pipeline ready for future document generators."
        : "Core ready; concrete generators remain deferred."),
  );

  return {
    ...withApproval,
    currentStage: null,
    readyForGenerators,
  };
}

/**
 * Internal documentation pipeline contract.
 * Ends at readiness — never performs content/Markdown generation.
 */
export const DOCUMENTATION_PIPELINE_CONTRACT = {
  stages: STAGE_DEFINITIONS,
  forbidsContentGeneration: true,
  sourceOfTruth: "EngineeringModel" as const,
};
