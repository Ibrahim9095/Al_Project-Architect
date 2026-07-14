import { describe, expect, it } from "vitest";
import {
  createDocumentationCore,
  DOCUMENTATION_PIPELINE_CONTRACT,
  isDocumentGenerator,
  type DocumentGenerator,
  type DocumentationContext,
  type DocumentGeneratorInput,
} from "@/engines/documentation";
import { createCompleteEngineeringModel } from "./fixtures";

describe("DocumentationCore", () => {
  const model = createCompleteEngineeringModel();

  it("accepts and validates an Engineering Model without generating documents", () => {
    const core = createDocumentationCore();
    const result = core.prepare(model);

    expect(result.accepted).toBe(true);
    expect(result.validated).toBe(true);
    expect(result.context?.sourceOfTruth).toBe("EngineeringModel");
    expect(result.context?.engineeringModel).toEqual(model);
    expect(result.generatedDocuments).toEqual([]);
    expect(result.pipeline.readyForGenerators).toBe(false);
    expect(
      result.pipeline.stages.every(
        (stage) => stage.status === "completed" || stage.status === "skipped",
      ),
    ).toBe(true);
  });

  it("binds Engineering Model as immutable source of truth", () => {
    const core = createDocumentationCore();
    const result = core.prepare(model);

    expect(result.context).toBeTruthy();
    expect(result.context!.modelFingerprint).toMatch(/^[a-f0-9]{64}$/);

    const bound = result.context!.engineeringModel as {
      businessGoals: string[];
    };
    expect(() => {
      bound.businessGoals.push("injected");
    }).toThrow();
  });

  it("creates a document plan without implementing generators", () => {
    const core = createDocumentationCore();
    const result = core.prepare(model);

    expect(result.plan).toBeTruthy();
    expect(result.plan!.documents.length).toBeGreaterThan(0);
    expect(result.plan!.deferredGeneratorIds.length).toBe(
      result.plan!.documents.length,
    );
    expect(
      result.plan!.documents.every(
        (document) => document.generatorRegistered === false,
      ),
    ).toBe(true);
  });

  it("builds traceability from Engineering Model sections", () => {
    const core = createDocumentationCore();
    const result = core.prepare(model);

    expect(result.traceability).toBeTruthy();
    expect(result.traceability!.links.length).toBeGreaterThan(0);
    expect(result.traceability!.unmappedModelSections).toEqual([]);
  });

  it("blocks when Engineering Model is invalid", () => {
    const core = createDocumentationCore();
    const invalid = {
      ...model,
      businessGoals: [],
      userRoles: [],
      complexityLevel: "small" as const,
      projectClassification: {
        ...model.projectClassification,
        complexityLevel: "medium" as const,
      },
    };

    const result = core.prepare(invalid);
    expect(result.accepted).toBe(true);
    expect(result.validated).toBe(false);
    expect(result.context).toBeNull();
    expect(result.generatedDocuments).toEqual([]);
    expect(result.pipeline.blockedReasons.length).toBeGreaterThan(0);
  });

  it("exposes reusable generator contract registration without generating output", () => {
    const core = createDocumentationCore();

    const stub: DocumentGenerator = {
      id: "PROJECT",
      descriptor: {
        id: "PROJECT",
        title: "Project Overview",
        responsibility: "stub",
        requiredModelSections: ["businessGoals"],
        outputFileName: "PROJECT.md",
        generatorRegistered: true,
      },
      canGenerate: (_context: DocumentationContext) => {
        void _context;
        return {
          passed: true,
          issues: [],
        };
      },
      extractSource: (engineeringModel) => engineeringModel.businessGoals,
      generate: (input: DocumentGeneratorInput) => ({
        documentType: "PROJECT",
        fileName: "PROJECT.md",
        markdown: "# should never be produced by core",
        sections: ["overview"],
        modelFingerprint: input.context.modelFingerprint,
      }),
    };

    expect(isDocumentGenerator(stub)).toBe(true);
    core.registerGenerator(stub);

    const result = core.prepare(model);
    expect(result.generatedDocuments).toEqual([]);
    expect(
      result.plan?.documents.find((doc) => doc.id === "PROJECT")
        ?.generatorRegistered,
    ).toBe(true);
    expect(result.pipeline.readyForGenerators).toBe(false);
  });

  it("publishes pipeline contract that forbids content generation", () => {
    const core = createDocumentationCore();
    const contract = core.getPipelineContract();

    expect(contract).toBe(DOCUMENTATION_PIPELINE_CONTRACT);
    expect(contract.forbidsContentGeneration).toBe(true);
    expect(contract.sourceOfTruth).toBe("EngineeringModel");
    expect(contract.stages.map((stage) => stage.id)).toContain(
      "approve_pipeline_readiness",
    );
    expect(contract.stages.map((stage) => stage.id)).not.toContain(
      "generate_markdown",
    );
  });
});
