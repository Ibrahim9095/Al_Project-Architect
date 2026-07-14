import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import {
  createAnalysisEngine,
  type DiscoveryOutput,
} from "../../../src/engines/analysis/index.js";
import { createDocumentationCore } from "../../../src/engines/documentation/index.js";

const fixturesDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "../analysis/fixtures/discovery",
);

describe("Documentation Core against Analysis fixtures", () => {
  const analysis = createAnalysisEngine();
  const core = createDocumentationCore();

  const fixtures = readdirSync(fixturesDir)
    .filter((file) => file.endsWith(".json"))
    .sort();

  for (const file of fixtures) {
    it(`prepares documentation core for ${file} without generating documents`, () => {
      const discovery = JSON.parse(
        readFileSync(join(fixturesDir, file), "utf8"),
      ) as DiscoveryOutput;
      const model = analysis.analyze(discovery).engineeringModel;
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
