import { describe, expect, it } from "vitest";
import {
  createDocumentationCore,
  DOCUMENT_CATALOG,
} from "@/engines/documentation";
import {
  createModulesDocumentGenerator,
  extractModulesSource,
  generateModulesDocument,
  renderModulesMarkdown,
  validateModulesDocument,
} from "@/engines/generators/modules";
import { createCompleteEngineeringModel } from "../../documentation/fixtures";

describe("ModulesDocumentGenerator (Phase 4.2.4)", () => {
  const model = createCompleteEngineeringModel();

  it("implements the Documentation Core DocumentGenerator contract for MODULES only", () => {
    const generator = createModulesDocumentGenerator();

    expect(generator.id).toBe("MODULES");
    expect(generator.descriptor.id).toBe("MODULES");
    expect(generator.descriptor.outputFileName).toBe("MODULES.md");
    expect(generator.descriptor.templateName).toBe(
      DOCUMENT_CATALOG.MODULES.templateName,
    );
    expect(generator.descriptor.requiredModelSections).toEqual(
      DOCUMENT_CATALOG.MODULES.requiredModelSections,
    );
    expect(generator.descriptor.generatorRegistered).toBe(true);
  });

  it("registers with Documentation Core without modifying core internals", () => {
    const core = createDocumentationCore();
    const generator = createModulesDocumentGenerator();

    core.registerGenerator(generator);

    expect(core.getGeneratorRegistry().has("MODULES")).toBe(true);
    expect(core.getGeneratorRegistry().get("MODULES")).toBe(generator);
    expect(core.getGeneratorRegistry().registeredIds).toEqual(["MODULES"]);
  });

  it("generates MODULES.md from the Engineering Model via Documentation Core", () => {
    const result = generateModulesDocument(model);

    expect(result.validation.passed).toBe(true);
    expect(result.output.documentType).toBe("MODULES");
    expect(result.output.fileName).toBe("MODULES.md");
    expect(result.output.markdown).toContain("# MODULES.md");
    expect(result.output.markdown).toContain(model.projectSummary.projectName);
    expect(result.output.markdown).toContain(result.modelFingerprint);
  });

  it("includes all modules and related features from the Engineering Model", () => {
    const result = generateModulesDocument(model);

    for (const projectModule of model.modules) {
      expect(result.output.markdown).toContain(projectModule.id);
      expect(result.output.markdown).toContain(projectModule.name);
      expect(result.output.markdown).toContain(projectModule.purpose);
      expect(result.output.markdown).toContain(projectModule.priority);
    }

    for (const feature of model.features) {
      expect(result.output.markdown).toContain(feature.id);
      expect(result.output.markdown).toContain(feature.name);
    }
  });

  it("is deterministic for the same Engineering Model", () => {
    const first = generateModulesDocument(model);
    const second = generateModulesDocument(model);

    expect(first.output.markdown).toBe(second.output.markdown);
    expect(first.modelFingerprint).toBe(second.modelFingerprint);
    expect(first.output.sections).toEqual(second.output.sections);
  });

  it("does not generate other document types", () => {
    const result = generateModulesDocument(model);

    expect(result.output.markdown).not.toContain("# PROJECT.md");
    expect(result.output.markdown).not.toContain("# REQUIREMENTS.md");
    expect(result.output.markdown).not.toContain("# BUSINESS_RULES.md");
    expect(result.output.markdown).not.toContain("# DATABASE.md");
    expect(result.output.markdown).not.toContain("# API.md");
    expect(result.output.markdown).not.toContain("# TASKS.md");
    expect(result.output.documentType).toBe("MODULES");
  });

  it("extracts source only from Engineering Model fields", () => {
    const source = extractModulesSource(model);

    expect(source.projectName).toBe(model.projectSummary.projectName);
    expect(source.modules.map((projectModule) => projectModule.id)).toEqual(
      [...model.modules.map((projectModule) => projectModule.id)].sort(),
    );
    expect(source.features.map((feature) => feature.id)).toEqual(
      [...model.features.map((feature) => feature.id)].sort(),
    );

    for (const projectModule of source.modules) {
      const original = model.modules.find(
        (candidate) => candidate.id === projectModule.id,
      );
      expect(original).toBeTruthy();
      expect(projectModule.purpose).toBe(original!.purpose);
      expect(projectModule.priority).toBe(original!.priority);
    }
  });

  it("keeps module traceability links aligned with Engineering Model relations", () => {
    const source = extractModulesSource(model);
    const auth = source.modules.find(
      (projectModule) => projectModule.id === "auth",
    );

    expect(auth).toBeTruthy();
    expect(auth!.relatedFeatureIds.length).toBeGreaterThan(0);

    for (const featureId of auth!.relatedFeatureIds) {
      const feature = model.features.find((candidate) => candidate.id === featureId);
      expect(feature).toBeTruthy();
      const linked =
        feature!.relatedModuleIds.includes("auth") ||
        model.modules
          .find((candidate) => candidate.id === "auth")
          ?.relatedFeatureIds.includes(featureId);
      expect(linked).toBe(true);
    }

    for (const feature of source.features) {
      const original = model.features.find(
        (candidate) => candidate.id === feature.id,
      );
      expect(original).toBeTruthy();
      expect(feature.relatedModuleIds).toEqual(
        [...original!.relatedModuleIds].sort((a, b) => a.localeCompare(b)),
      );
    }
  });

  it("validates generated markdown against DocumentationContext fingerprint", () => {
    const core = createDocumentationCore();
    const generator = createModulesDocumentGenerator();
    core.registerGenerator(generator);

    const prepared = core.prepare(model);
    expect(prepared.context).toBeTruthy();

    const source = extractModulesSource(model);
    const rendered = renderModulesMarkdown(
      source,
      prepared.context!.modelFingerprint,
    );
    const output = {
      documentType: "MODULES" as const,
      fileName: "MODULES.md",
      markdown: rendered.markdown,
      sections: rendered.sections,
      modelFingerprint: prepared.context!.modelFingerprint,
    };

    const validation = validateModulesDocument(
      output,
      prepared.context!,
      source,
    );
    expect(validation.passed).toBe(true);
    expect(validation.issues).toEqual([]);
  });

  it("fails readiness when required Engineering Model sections are empty", () => {
    const core = createDocumentationCore();
    const generator = createModulesDocumentGenerator();
    const prepared = core.prepare(model);
    expect(prepared.context).toBeTruthy();

    const brokenModulesContext = {
      ...prepared.context!,
      engineeringModel: {
        ...prepared.context!.engineeringModel,
        modules: [],
      },
    };

    const modulesReadiness = generator.canGenerate(brokenModulesContext);
    expect(modulesReadiness.passed).toBe(false);
    expect(
      modulesReadiness.issues.some((issue) => issue.includes("modules")),
    ).toBe(true);

    const brokenFeaturesContext = {
      ...prepared.context!,
      engineeringModel: {
        ...prepared.context!.engineeringModel,
        features: [],
      },
    };

    const featuresReadiness = generator.canGenerate(brokenFeaturesContext);
    expect(featuresReadiness.passed).toBe(false);
    expect(
      featuresReadiness.issues.some((issue) => issue.includes("features")),
    ).toBe(true);
  });
});
