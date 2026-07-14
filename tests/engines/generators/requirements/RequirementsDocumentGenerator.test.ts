import { describe, expect, it } from "vitest";
import {
  createDocumentationCore,
  DOCUMENT_CATALOG,
} from "@/engines/documentation";
import {
  createRequirementsDocumentGenerator,
  extractRequirementsSource,
  generateRequirementsDocument,
  renderRequirementsMarkdown,
  validateRequirementsDocument,
} from "@/engines/generators/requirements";
import { createCompleteEngineeringModel } from "../../documentation/fixtures";

describe("RequirementsDocumentGenerator (Phase 4.2.2)", () => {
  const model = createCompleteEngineeringModel();

  it("implements the Documentation Core DocumentGenerator contract for REQUIREMENTS only", () => {
    const generator = createRequirementsDocumentGenerator();

    expect(generator.id).toBe("REQUIREMENTS");
    expect(generator.descriptor.id).toBe("REQUIREMENTS");
    expect(generator.descriptor.outputFileName).toBe("REQUIREMENTS.md");
    expect(generator.descriptor.templateName).toBe(
      DOCUMENT_CATALOG.REQUIREMENTS.templateName,
    );
    expect(generator.descriptor.generatorRegistered).toBe(true);
  });

  it("registers with Documentation Core without modifying core internals", () => {
    const core = createDocumentationCore();
    const generator = createRequirementsDocumentGenerator();

    core.registerGenerator(generator);

    expect(core.getGeneratorRegistry().has("REQUIREMENTS")).toBe(true);
    expect(core.getGeneratorRegistry().get("REQUIREMENTS")).toBe(generator);
    expect(core.getGeneratorRegistry().registeredIds).toEqual(["REQUIREMENTS"]);
  });

  it("generates REQUIREMENTS.md from the Engineering Model via Documentation Core", () => {
    const result = generateRequirementsDocument(model);

    expect(result.validation.passed).toBe(true);
    expect(result.output.documentType).toBe("REQUIREMENTS");
    expect(result.output.fileName).toBe("REQUIREMENTS.md");
    expect(result.output.markdown).toContain("# REQUIREMENTS.md");
    expect(result.output.markdown).toContain(model.projectSummary.projectName);
    expect(result.output.markdown).toContain(result.modelFingerprint);
  });

  it("includes functional, non-functional, and security requirements from the model", () => {
    const result = generateRequirementsDocument(model);

    for (const feature of model.features) {
      expect(result.output.markdown).toContain(feature.id);
      expect(result.output.markdown).toContain(feature.name);
    }
    for (const nfr of model.nonFunctionalRequirements) {
      expect(result.output.markdown).toContain(nfr.id);
    }
    for (const security of model.securityRequirements) {
      expect(result.output.markdown).toContain(security.id);
    }
  });

  it("is deterministic for the same Engineering Model", () => {
    const first = generateRequirementsDocument(model);
    const second = generateRequirementsDocument(model);

    expect(first.output.markdown).toBe(second.output.markdown);
    expect(first.modelFingerprint).toBe(second.modelFingerprint);
    expect(first.output.sections).toEqual(second.output.sections);
  });

  it("does not generate other document types", () => {
    const result = generateRequirementsDocument(model);

    expect(result.output.markdown).not.toContain("# PROJECT.md");
    expect(result.output.markdown).not.toContain("# BUSINESS_RULES.md");
    expect(result.output.markdown).not.toContain("# MODULES.md");
    expect(result.output.markdown).not.toContain("# DATABASE.md");
    expect(result.output.markdown).not.toContain("# API.md");
    expect(result.output.markdown).not.toContain("# TASKS.md");
    expect(result.output.documentType).toBe("REQUIREMENTS");
  });

  it("extracts source only from Engineering Model fields", () => {
    const source = extractRequirementsSource(model);

    expect(source.projectName).toBe(model.projectSummary.projectName);
    expect(source.functionalRequirements.map((item) => item.id)).toEqual(
      [...model.features.map((feature) => feature.id)].sort(),
    );
    expect(source.nonFunctionalRequirements.map((item) => item.id)).toEqual(
      [...model.nonFunctionalRequirements.map((item) => item.id)].sort(),
    );
  });

  it("validates generated markdown against DocumentationContext fingerprint", () => {
    const core = createDocumentationCore();
    const generator = createRequirementsDocumentGenerator();
    core.registerGenerator(generator);

    const prepared = core.prepare(model);
    expect(prepared.context).toBeTruthy();

    const source = extractRequirementsSource(model);
    const rendered = renderRequirementsMarkdown(
      source,
      prepared.context!.modelFingerprint,
    );
    const output = {
      documentType: "REQUIREMENTS" as const,
      fileName: "REQUIREMENTS.md",
      markdown: rendered.markdown,
      sections: rendered.sections,
      modelFingerprint: prepared.context!.modelFingerprint,
    };

    const validation = validateRequirementsDocument(
      output,
      prepared.context!,
      source,
    );
    expect(validation.passed).toBe(true);
    expect(validation.issues).toEqual([]);
  });

  it("fails readiness when required Engineering Model sections are empty", () => {
    const core = createDocumentationCore();
    const generator = createRequirementsDocumentGenerator();
    const prepared = core.prepare(model);
    expect(prepared.context).toBeTruthy();

    const brokenContext = {
      ...prepared.context!,
      engineeringModel: {
        ...prepared.context!.engineeringModel,
        features: [],
      },
    };

    const readiness = generator.canGenerate(brokenContext);
    expect(readiness.passed).toBe(false);
    expect(readiness.issues.some((issue) => issue.includes("features"))).toBe(
      true,
    );
  });
});
