import { describe, expect, it } from "vitest";
import { buildEngineeringModel } from "@/engines/analysis";
import { createDocumentationCore } from "@/engines/documentation";
import { createCompleteNormalizedDiscovery } from "./fixtures";

const domains = ["clinic", "ecommerce", "crm"] as const;

describe("Documentation Core against Analysis Engineering Model", () => {
  const core = createDocumentationCore();

  for (const domain of domains) {
    it(`prepares documentation core for ${domain} without generating documents`, () => {
      const discovery = createCompleteNormalizedDiscovery();
      discovery.project.type = domain;
      discovery.project.typeLabel = domain;
      discovery.metadata.projectTypeId = domain;

      const model = buildEngineeringModel(discovery, {
        createdAt: "2026-07-14T10:00:00.000Z",
      });
      const result = core.prepare(model);

      expect(result.accepted).toBe(true);
      expect(result.validated).toBe(true);
      expect(result.context?.sourceOfTruth).toBe("EngineeringModel");
      expect(result.generatedDocuments).toEqual([]);
      expect(result.plan?.documents.length).toBeGreaterThan(0);
      expect(result.traceability?.links.length).toBeGreaterThan(0);
    });
  }
});
