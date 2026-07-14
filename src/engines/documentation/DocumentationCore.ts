import type { EngineeringModel } from "../analysis/types.js";
import type { DocumentGenerator } from "./contracts/DocumentGenerator.js";
import {
  approvePipeline,
  blockStage,
  buildDocumentPlan,
  buildTraceabilityMap,
  completeStage,
  createDocumentationContext,
  createDocumentRegistry,
  createInitialPipelineState,
  DOCUMENTATION_PIPELINE_CONTRACT,
  DocumentRegistry,
  validateEngineeringModelForDocumentation,
} from "./services/index.js";
import type {
  DocumentationCoreOptions,
  DocumentationCoreResult,
} from "./types.js";

/**
 * Documentation Core — Phase 4.1
 *
 * Responsibilities:
 * - Accept Engineering Model from Analysis Engine
 * - Validate Engineering Model
 * - Bind Engineering Model as single source of truth
 * - Design/prepare the internal documentation pipeline
 * - Expose reusable contracts for future document generators
 *
 * Non-responsibilities (strict):
 * - Do not generate Markdown
 * - Do not implement PROJECT/REQUIREMENTS/BUSINESS_RULES/MODULES/DATABASE/API/TASKS generators
 * - Do not modify Discovery Engine or Analysis Engine
 */
export class DocumentationCore {
  private readonly registry: DocumentRegistry;
  private readonly options: Required<DocumentationCoreOptions>;

  constructor(
    registry: DocumentRegistry = createDocumentRegistry(),
    options: DocumentationCoreOptions = {},
  ) {
    this.registry = registry;
    this.options = {
      requireRegisteredGenerators: options.requireRegisteredGenerators ?? false,
    };
  }

  /**
   * Expose the generator registry for future phases.
   * Phase 4.1 does not register concrete generators.
   */
  getGeneratorRegistry(): DocumentRegistry {
    return this.registry;
  }

  /**
   * Allow future phases to register generator contracts without changing Core API.
   */
  registerGenerator(generator: DocumentGenerator): void {
    this.registry.register(generator);
  }

  /**
   * Pipeline contract metadata for downstream tooling.
   */
  getPipelineContract() {
    return DOCUMENTATION_PIPELINE_CONTRACT;
  }

  /**
   * Prepare documentation infrastructure from an Engineering Model.
   * Never generates document contents.
   */
  prepare(model: EngineeringModel): DocumentationCoreResult {
    const preparedAt = new Date().toISOString();
    let pipeline = createInitialPipelineState();

    if (!model) {
      pipeline = blockStage(
        pipeline,
        "accept_engineering_model",
        "Engineering Model was not provided.",
      );

      return {
        accepted: false,
        validated: false,
        context: null,
        modelValidation: validateEngineeringModelForDocumentation(model),
        plan: null,
        traceability: null,
        pipeline,
        generatedDocuments: [],
        preparedAt,
      };
    }

    pipeline = completeStage(
      pipeline,
      "accept_engineering_model",
      "Engineering Model accepted from Analysis Engine.",
    );

    const modelValidation = validateEngineeringModelForDocumentation(model);
    if (!modelValidation.passed) {
      pipeline = blockStage(
        pipeline,
        "validate_engineering_model",
        modelValidation.issues.map((item) => item.message).join(" | "),
      );

      return {
        accepted: true,
        validated: false,
        context: null,
        modelValidation,
        plan: null,
        traceability: null,
        pipeline,
        generatedDocuments: [],
        preparedAt,
      };
    }

    pipeline = completeStage(
      pipeline,
      "validate_engineering_model",
      "Engineering Model passed documentation validation.",
    );

    const context = createDocumentationContext(model);
    pipeline = completeStage(
      pipeline,
      "bind_source_of_truth",
      `Source of truth bound. fingerprint=${context.modelFingerprint}`,
    );

    const plan = buildDocumentPlan(model, this.registry);
    pipeline = completeStage(
      pipeline,
      "select_document_plan",
      `Planned ${plan.documents.length} document descriptor(s); generators deferred: ${plan.deferredGeneratorIds.join(", ") || "none"}.`,
    );

    const missingContracts = plan.deferredGeneratorIds;
    if (this.options.requireRegisteredGenerators && missingContracts.length > 0) {
      pipeline = blockStage(
        pipeline,
        "verify_generator_contracts",
        `Missing generator contracts: ${missingContracts.join(", ")}`,
      );

      return {
        accepted: true,
        validated: true,
        context,
        modelValidation,
        plan,
        traceability: null,
        pipeline,
        generatedDocuments: [],
        preparedAt,
      };
    }

    pipeline = completeStage(
      pipeline,
      "verify_generator_contracts",
      this.options.requireRegisteredGenerators
        ? "All required generator contracts are registered."
        : "Generator contracts deferred by Phase 4.1 scope (Core only).",
    );

    const traceability = buildTraceabilityMap(model);
    pipeline = completeStage(
      pipeline,
      "build_traceability_map",
      `Traceability links=${traceability.links.length}; unmapped=${traceability.unmappedModelSections.length}`,
    );

    // Core readiness does not mean documents were generated.
    pipeline = approvePipeline(
      pipeline,
      false,
      "Documentation Core ready. Content generation is intentionally disabled in Phase 4.1.",
    );

    return {
      accepted: true,
      validated: true,
      context,
      modelValidation,
      plan,
      traceability,
      pipeline,
      generatedDocuments: [],
      preparedAt,
    };
  }
}

export function createDocumentationCore(
  options?: DocumentationCoreOptions,
): DocumentationCore {
  return new DocumentationCore(createDocumentRegistry(), options);
}
