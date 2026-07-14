import { describe, expect, it } from "vitest";
import {
  createDocumentationCore,
  DOCUMENT_CATALOG,
} from "@/engines/documentation";
import {
  createDatabaseDocumentGenerator,
  extractDatabaseSource,
  generateDatabaseDocument,
  renderDatabaseMarkdown,
  validateDatabaseDocument,
} from "@/engines/generators/database";
import { createCompleteEngineeringModel } from "../../documentation/fixtures";

describe("DatabaseDocumentGenerator (Phase 4.2.5)", () => {
  const model = createCompleteEngineeringModel();

  it("implements the Documentation Core DocumentGenerator contract for DATABASE only", () => {
    const generator = createDatabaseDocumentGenerator();

    expect(generator.id).toBe("DATABASE");
    expect(generator.descriptor.id).toBe("DATABASE");
    expect(generator.descriptor.outputFileName).toBe("DATABASE.md");
    expect(generator.descriptor.templateName).toBe(
      DOCUMENT_CATALOG.DATABASE.templateName,
    );
    expect(generator.descriptor.requiredModelSections).toEqual(
      DOCUMENT_CATALOG.DATABASE.requiredModelSections,
    );
    expect(generator.descriptor.generatorRegistered).toBe(true);
  });

  it("registers with Documentation Core without modifying core internals", () => {
    const core = createDocumentationCore();
    const generator = createDatabaseDocumentGenerator();

    core.registerGenerator(generator);

    expect(core.getGeneratorRegistry().has("DATABASE")).toBe(true);
    expect(core.getGeneratorRegistry().get("DATABASE")).toBe(generator);
    expect(core.getGeneratorRegistry().registeredIds).toEqual(["DATABASE"]);
  });

  it("generates DATABASE.md from the Engineering Model via Documentation Core", () => {
    const result = generateDatabaseDocument(model);

    expect(result.validation.passed).toBe(true);
    expect(result.output.documentType).toBe("DATABASE");
    expect(result.output.fileName).toBe("DATABASE.md");
    expect(result.output.markdown).toContain("# DATABASE.md");
    expect(result.output.markdown).toContain(model.projectSummary.projectName);
    expect(result.output.markdown).toContain(result.modelFingerprint);
  });

  it("includes entities, relationships, indexes, and constraints from the Engineering Model", () => {
    const result = generateDatabaseDocument(model);
    const source = extractDatabaseSource(model);

    expect(source.entities.length).toBeGreaterThan(0);
    expect(source.relationships.length).toBeGreaterThan(0);
    expect(source.indexes.length).toBeGreaterThan(0);
    expect(source.constraints.length).toBeGreaterThan(0);

    for (const entity of model.databaseCandidates) {
      expect(result.output.markdown).toContain(entity.id);
      expect(result.output.markdown).toContain(entity.name);
    }

    for (const relationship of source.relationships) {
      expect(result.output.markdown).toContain(relationship.id);
    }

    for (const index of source.indexes) {
      expect(result.output.markdown).toContain(index.id);
    }

    for (const constraint of source.constraints) {
      expect(result.output.markdown).toContain(constraint.id);
    }

    expect(result.output.markdown).toContain("# Entities");
    expect(result.output.markdown).toContain("# Relationships");
    expect(result.output.markdown).toContain("# Indexes");
    expect(result.output.markdown).toContain("# Constraints");
  });

  it("is deterministic for the same Engineering Model", () => {
    const first = generateDatabaseDocument(model);
    const second = generateDatabaseDocument(model);

    expect(first.output.markdown).toBe(second.output.markdown);
    expect(first.modelFingerprint).toBe(second.modelFingerprint);
    expect(first.output.sections).toEqual(second.output.sections);
  });

  it("does not generate other document types", () => {
    const result = generateDatabaseDocument(model);

    expect(result.output.markdown).not.toContain("# PROJECT.md");
    expect(result.output.markdown).not.toContain("# REQUIREMENTS.md");
    expect(result.output.markdown).not.toContain("# BUSINESS_RULES.md");
    expect(result.output.markdown).not.toContain("# MODULES.md");
    expect(result.output.markdown).not.toContain("# API.md");
    expect(result.output.markdown).not.toContain("# TASKS.md");
    expect(result.output.documentType).toBe("DATABASE");
  });

  it("extracts source only from Engineering Model fields and deterministic derivations", () => {
    const source = extractDatabaseSource(model);

    expect(source.projectName).toBe(model.projectSummary.projectName);
    expect(source.entities.map((entity) => entity.id)).toEqual(
      [...model.databaseCandidates.map((candidate) => candidate.id)].sort(),
    );
    expect(source.modules.map((projectModule) => projectModule.id)).toEqual(
      [...model.modules.map((projectModule) => projectModule.id)].sort(),
    );

    for (const entity of source.entities) {
      const original = model.databaseCandidates.find(
        (candidate) => candidate.id === entity.id,
      );
      expect(original).toBeTruthy();
      expect(entity.name).toBe(original!.name);
      expect(entity.entityType).toBe(original!.entityType);
      expect(entity.status).toBe(original!.status);
    }

    for (const index of source.indexes) {
      expect(["derived-from-entity-identity", "derived-from-relationship-candidate"]).toContain(
        index.source,
      );
      expect(source.entities.some((entity) => entity.id === index.entityId)).toBe(
        true,
      );
    }

    for (const constraint of source.constraints) {
      expect(["derived-from-entity-identity", "derived-from-relationship-candidate"]).toContain(
        constraint.source,
      );
      expect(
        source.entities.some((entity) => entity.id === constraint.entityId),
      ).toBe(true);
    }
  });

  it("keeps relationship traceability aligned with module-linked entities", () => {
    const source = extractDatabaseSource(model);
    const appointmentsLink = source.relationships.find(
      (relationship) => relationship.id === "rel-appointments-user",
    );

    expect(appointmentsLink).toBeTruthy();
    expect(appointmentsLink!.relatedModuleIds).toContain("appointments");
    expect(appointmentsLink!.relatedEntityIds).toContain("entity-user");
    expect(appointmentsLink!.relatedEntityIds).toContain("appointments-entity");
  });

  it("validates generated markdown against DocumentationContext fingerprint", () => {
    const core = createDocumentationCore();
    const generator = createDatabaseDocumentGenerator();
    core.registerGenerator(generator);

    const prepared = core.prepare(model);
    expect(prepared.context).toBeTruthy();

    const source = extractDatabaseSource(model);
    const rendered = renderDatabaseMarkdown(
      source,
      prepared.context!.modelFingerprint,
    );
    const output = {
      documentType: "DATABASE" as const,
      fileName: "DATABASE.md",
      markdown: rendered.markdown,
      sections: rendered.sections,
      modelFingerprint: prepared.context!.modelFingerprint,
    };

    const validation = validateDatabaseDocument(
      output,
      prepared.context!,
      source,
    );
    expect(validation.passed).toBe(true);
    expect(validation.issues).toEqual([]);
  });

  it("fails readiness when required Engineering Model sections are empty", () => {
    const core = createDocumentationCore();
    const generator = createDatabaseDocumentGenerator();
    const prepared = core.prepare(model);
    expect(prepared.context).toBeTruthy();

    const brokenCandidatesContext = {
      ...prepared.context!,
      engineeringModel: {
        ...prepared.context!.engineeringModel,
        databaseCandidates: [],
      },
    };

    const candidatesReadiness = generator.canGenerate(brokenCandidatesContext);
    expect(candidatesReadiness.passed).toBe(false);
    expect(
      candidatesReadiness.issues.some((issue) =>
        issue.includes("databaseCandidates"),
      ),
    ).toBe(true);

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
  });
});
