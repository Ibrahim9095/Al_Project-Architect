import { describe, expect, it } from "vitest";
import {
  createDocumentationCore,
  DOCUMENT_CATALOG,
} from "@/engines/documentation";
import {
  createBusinessRulesDocumentGenerator,
  extractBusinessRulesSource,
  generateBusinessRulesDocument,
  renderBusinessRulesMarkdown,
  validateBusinessRulesDocument,
} from "@/engines/generators/business-rules";
import { createCompleteEngineeringModel } from "../../documentation/fixtures";

describe("BusinessRulesDocumentGenerator (Phase 4.2.3)", () => {
  const model = createCompleteEngineeringModel();

  it("implements the Documentation Core DocumentGenerator contract for BUSINESS_RULES only", () => {
    const generator = createBusinessRulesDocumentGenerator();

    expect(generator.id).toBe("BUSINESS_RULES");
    expect(generator.descriptor.id).toBe("BUSINESS_RULES");
    expect(generator.descriptor.outputFileName).toBe("BUSINESS_RULES.md");
    expect(generator.descriptor.templateName).toBe(
      DOCUMENT_CATALOG.BUSINESS_RULES.templateName,
    );
    expect(generator.descriptor.generatorRegistered).toBe(true);
  });

  it("registers with Documentation Core without modifying core internals", () => {
    const core = createDocumentationCore();
    const generator = createBusinessRulesDocumentGenerator();

    core.registerGenerator(generator);

    expect(core.getGeneratorRegistry().has("BUSINESS_RULES")).toBe(true);
    expect(core.getGeneratorRegistry().get("BUSINESS_RULES")).toBe(generator);
    expect(core.getGeneratorRegistry().registeredIds).toEqual(["BUSINESS_RULES"]);
  });

  it("generates BUSINESS_RULES.md from the Engineering Model via Documentation Core", () => {
    const result = generateBusinessRulesDocument(model);

    expect(result.validation.passed).toBe(true);
    expect(result.output.documentType).toBe("BUSINESS_RULES");
    expect(result.output.fileName).toBe("BUSINESS_RULES.md");
    expect(result.output.markdown).toContain("# BUSINESS_RULES.md");
    expect(result.output.markdown).toContain(model.projectSummary.projectName);
    expect(result.output.markdown).toContain(result.modelFingerprint);
  });

  it("includes all business rules from the Engineering Model", () => {
    const result = generateBusinessRulesDocument(model);

    for (const rule of model.businessRules) {
      expect(result.output.markdown).toContain(rule.id);
      expect(result.output.markdown).toContain(rule.description);
      expect(result.output.markdown).toContain(rule.status);
    }
  });

  it("is deterministic for the same Engineering Model", () => {
    const first = generateBusinessRulesDocument(model);
    const second = generateBusinessRulesDocument(model);

    expect(first.output.markdown).toBe(second.output.markdown);
    expect(first.modelFingerprint).toBe(second.modelFingerprint);
    expect(first.output.sections).toEqual(second.output.sections);
  });

  it("does not generate other document types", () => {
    const result = generateBusinessRulesDocument(model);

    expect(result.output.markdown).not.toContain("# PROJECT.md");
    expect(result.output.markdown).not.toContain("# REQUIREMENTS.md");
    expect(result.output.markdown).not.toContain("# MODULES.md");
    expect(result.output.markdown).not.toContain("# DATABASE.md");
    expect(result.output.markdown).not.toContain("# API.md");
    expect(result.output.markdown).not.toContain("# TASKS.md");
    expect(result.output.documentType).toBe("BUSINESS_RULES");
  });

  it("extracts source only from Engineering Model fields", () => {
    const source = extractBusinessRulesSource(model);

    expect(source.projectName).toBe(model.projectSummary.projectName);
    expect(source.businessRules.map((rule) => rule.id)).toEqual(
      [...model.businessRules.map((rule) => rule.id)].sort(),
    );
  });

  it("validates generated markdown against DocumentationContext fingerprint", () => {
    const core = createDocumentationCore();
    const generator = createBusinessRulesDocumentGenerator();
    core.registerGenerator(generator);

    const prepared = core.prepare(model);
    expect(prepared.context).toBeTruthy();

    const source = extractBusinessRulesSource(model);
    const rendered = renderBusinessRulesMarkdown(
      source,
      prepared.context!.modelFingerprint,
    );
    const output = {
      documentType: "BUSINESS_RULES" as const,
      fileName: "BUSINESS_RULES.md",
      markdown: rendered.markdown,
      sections: rendered.sections,
      modelFingerprint: prepared.context!.modelFingerprint,
    };

    const validation = validateBusinessRulesDocument(
      output,
      prepared.context!,
      source,
    );
    expect(validation.passed).toBe(true);
    expect(validation.issues).toEqual([]);
  });

  it("fails readiness when required Engineering Model sections are empty", () => {
    const core = createDocumentationCore();
    const generator = createBusinessRulesDocumentGenerator();
    const prepared = core.prepare(model);
    expect(prepared.context).toBeTruthy();

    const brokenContext = {
      ...prepared.context!,
      engineeringModel: {
        ...prepared.context!.engineeringModel,
        businessRules: [],
      },
    };

    const readiness = generator.canGenerate(brokenContext);
    expect(readiness.passed).toBe(false);
    expect(
      readiness.issues.some((issue) => issue.includes("businessRules")),
    ).toBe(true);
  });
});
