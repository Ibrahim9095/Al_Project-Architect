import { describe, expect, it } from "vitest";
import {
  createDocumentationCore,
  DOCUMENT_CATALOG,
} from "@/engines/documentation";
import {
  createProjectDocumentGenerator,
  extractProjectSource,
  generateProjectDocument,
  renderProjectMarkdown,
  validateProjectDocument,
} from "@/engines/generators/project";
import { createCompleteEngineeringModel } from "../../documentation/fixtures";

describe("ProjectDocumentGenerator (Phase 4.2.1)", () => {
  const model = createCompleteEngineeringModel();

  it("implements the Documentation Core DocumentGenerator contract for PROJECT only", () => {
    const generator = createProjectDocumentGenerator();

    expect(generator.id).toBe("PROJECT");
    expect(generator.descriptor.id).toBe("PROJECT");
    expect(generator.descriptor.outputFileName).toBe("PROJECT.md");
    expect(generator.descriptor.templateName).toBe(
      DOCUMENT_CATALOG.PROJECT.templateName,
    );
    expect(generator.descriptor.generatorRegistered).toBe(true);
  });

  it("registers with Documentation Core without modifying core internals", () => {
    const core = createDocumentationCore();
    const generator = createProjectDocumentGenerator();

    core.registerGenerator(generator);

    expect(core.getGeneratorRegistry().has("PROJECT")).toBe(true);
    expect(core.getGeneratorRegistry().get("PROJECT")).toBe(generator);
    expect(core.getGeneratorRegistry().registeredIds).toEqual(["PROJECT"]);
  });

  it("generates PROJECT.md from the Engineering Model via Documentation Core", () => {
    const result = generateProjectDocument(model);

    expect(result.validation.passed).toBe(true);
    expect(result.output.documentType).toBe("PROJECT");
    expect(result.output.fileName).toBe("PROJECT.md");
    expect(result.output.markdown).toContain("# PROJECT.md");
    expect(result.output.markdown).toContain(model.projectSummary.projectName);
    expect(result.output.markdown).toContain(model.complexityLevel);
    expect(result.output.markdown).toContain(result.modelFingerprint);
    expect(result.output.modelFingerprint).toBe(result.modelFingerprint);
  });

  it("includes Engineering Model goals, roles, modules, and features", () => {
    const result = generateProjectDocument(model);

    for (const goal of model.businessGoals) {
      expect(result.output.markdown).toContain(goal);
    }
    for (const role of model.userRoles) {
      expect(result.output.markdown).toContain(role.name);
    }
    for (const projectModule of model.modules) {
      expect(result.output.markdown).toContain(projectModule.name);
    }
    for (const feature of model.features) {
      expect(result.output.markdown).toContain(feature.name);
    }
  });

  it("is deterministic for the same Engineering Model", () => {
    const first = generateProjectDocument(model);
    const second = generateProjectDocument(model);

    expect(first.output.markdown).toBe(second.output.markdown);
    expect(first.modelFingerprint).toBe(second.modelFingerprint);
    expect(first.output.sections).toEqual(second.output.sections);
  });

  it("does not generate other document types", () => {
    const result = generateProjectDocument(model);

    expect(result.output.markdown).not.toContain("# REQUIREMENTS.md");
    expect(result.output.markdown).not.toContain("# BUSINESS_RULES.md");
    expect(result.output.markdown).not.toContain("# MODULES.md");
    expect(result.output.markdown).not.toContain("# DATABASE.md");
    expect(result.output.markdown).not.toContain("# API.md");
    expect(result.output.markdown).not.toContain("# TASKS.md");
    expect(result.output.documentType).toBe("PROJECT");
  });

  it("extracts source only from Engineering Model fields", () => {
    const source = extractProjectSource(model);

    expect(source.projectName).toBe(model.projectSummary.projectName);
    expect(source.complexityLevel).toBe(model.complexityLevel);
    expect(source.businessGoals).toEqual(model.businessGoals);
    expect(source.userRoles.map((role) => role.id).sort()).toEqual(
      model.userRoles.map((role) => role.id).sort(),
    );
  });

  it("validates generated markdown against DocumentationContext fingerprint", () => {
    const core = createDocumentationCore();
    const generator = createProjectDocumentGenerator();
    core.registerGenerator(generator);

    const prepared = core.prepare(model);
    expect(prepared.context).toBeTruthy();

    const source = extractProjectSource(model);
    const rendered = renderProjectMarkdown(
      source,
      prepared.context!.modelFingerprint,
    );
    const output = {
      documentType: "PROJECT" as const,
      fileName: "PROJECT.md",
      markdown: rendered.markdown,
      sections: rendered.sections,
      modelFingerprint: prepared.context!.modelFingerprint,
    };

    const validation = validateProjectDocument(
      output,
      prepared.context!,
      source,
    );
    expect(validation.passed).toBe(true);
    expect(validation.issues).toEqual([]);
  });

  it("fails readiness when required Engineering Model sections are empty", () => {
    const core = createDocumentationCore();
    const generator = createProjectDocumentGenerator();
    const prepared = core.prepare(model);
    expect(prepared.context).toBeTruthy();

    const brokenContext = {
      ...prepared.context!,
      engineeringModel: {
        ...prepared.context!.engineeringModel,
        businessGoals: [],
      },
    };

    const readiness = generator.canGenerate(brokenContext);
    expect(readiness.passed).toBe(false);
    expect(readiness.issues.some((issue) => issue.includes("businessGoals"))).toBe(
      true,
    );
  });
});
