import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  AnalysisEngine,
  validateEngineeringModel,
  type DiscoveryOutput,
  type EngineeringModel,
} from "../../../src/engines/analysis/index.js";

const fixturesDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "fixtures/discovery",
);

const REQUIRED_SECTIONS = [
  "Project Classification",
  "Business Goals",
  "User Roles",
  "Modules",
  "Features",
  "Business Rules",
  "Database Candidates",
  "API Candidates",
  "External Integrations",
  "Security Requirements",
  "Non-Functional Requirements",
  "Complexity Level",
] as const;

function loadFixtures(): Array<{ name: string; discovery: DiscoveryOutput }> {
  return readdirSync(fixturesDir)
    .filter((file) => file.endsWith(".json"))
    .sort()
    .map((file) => ({
      name: file.replace(/\.json$/, ""),
      discovery: JSON.parse(
        readFileSync(join(fixturesDir, file), "utf8"),
      ) as DiscoveryOutput,
    }));
}

function sectionPresence(model: EngineeringModel): Record<string, boolean> {
  return {
    "Project Classification": Boolean(model.projectClassification?.level),
    "Business Goals": model.businessGoals.length > 0,
    "User Roles": model.userRoles.length > 0,
    Modules: model.modules.length > 0,
    Features: model.features.length > 0,
    "Business Rules": model.businessRules.length > 0,
    "Database Candidates": model.databaseCandidates.length > 0,
    "API Candidates": model.apiCandidates.length > 0,
    // Empty integrations are allowed only when discovery has none; presence key means field exists.
    "External Integrations": Array.isArray(model.externalIntegrations),
    "Security Requirements": model.securityRequirements.length > 0,
    "Non-Functional Requirements": model.nonFunctionalRequirements.length > 0,
    "Complexity Level": Boolean(model.complexityLevel),
  };
}

describe("Analysis Engine validation across Discovery domains", () => {
  const engine = new AnalysisEngine();
  const fixtures = loadFixtures();

  it("loads all five required domain fixtures", () => {
    expect(fixtures.map((item) => item.name).sort()).toEqual([
      "clinic",
      "ecommerce",
      "hotel",
      "portfolio",
      "restaurant",
    ]);
  });

  for (const fixture of fixtures) {
    describe(fixture.name, () => {
      const result = engine.analyze(fixture.discovery);
      const model = result.engineeringModel;
      const presence = sectionPresence(model);
      const missing = validateEngineeringModel(model);

      it("produces an Engineering Model", () => {
        expect(model).toBeTruthy();
      });

      it("includes all required Engineering Model sections", () => {
        for (const section of REQUIRED_SECTIONS) {
          expect(presence[section], `${fixture.name} missing ${section}`).toBe(
            true,
          );
        }
        // For these realistic fixtures, integrations are expected to be present.
        expect(model.externalIntegrations.length).toBeGreaterThan(0);
        expect(missing, `${fixture.name} gaps: ${missing.join(", ")}`).toEqual(
          [],
        );
      });

      it("aligns complexity level with project classification", () => {
        expect(model.complexityLevel).toBe(model.projectClassification.level);
        expect(model.complexityLevel).toBe(fixture.discovery.classification.level);
      });

      it("derives database and API candidates from discovered knowledge", () => {
        expect(model.databaseCandidates.length).toBeGreaterThan(0);
        expect(model.apiCandidates.length).toBeGreaterThan(0);
        expect(
          model.apiCandidates.every((candidate) => candidate.operations.length > 0),
        ).toBe(true);
      });

      it("keeps business rules and NFRs traceable", () => {
        expect(model.businessRules.length).toBeGreaterThan(0);
        expect(model.nonFunctionalRequirements.length).toBeGreaterThan(0);
        expect(model.securityRequirements.length).toBeGreaterThan(0);
      });

      it("reports analysis status and readiness", () => {
        expect(["approved", "needs_clarification", "rejected"]).toContain(
          result.status,
        );
        expect(result.readinessScore).toBeTruthy();
        expect(result.reports.engineeringSummary.projectClassification).toBe(
          fixture.discovery.classification.level,
        );
      });
    });
  }
});
