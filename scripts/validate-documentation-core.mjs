import { readFileSync, readdirSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createAnalysisEngine } from "../dist/engines/analysis/index.js";
import { createDocumentationCore } from "../dist/engines/documentation/index.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "tests/engines/analysis/fixtures/discovery");
const outDir = join(root, "tmp/documentation-core-validation");
mkdirSync(outDir, { recursive: true });

const analysis = createAnalysisEngine();
const core = createDocumentationCore();
const files = readdirSync(fixturesDir).filter((f) => f.endsWith(".json")).sort();
const report = [];

for (const file of files) {
  const name = file.replace(/\.json$/, "");
  const discovery = JSON.parse(readFileSync(join(fixturesDir, file), "utf8"));
  const model = analysis.analyze(discovery).engineeringModel;
  const result = core.prepare(model);

  const entry = {
    domain: name,
    accepted: result.accepted,
    validated: result.validated,
    sourceOfTruth: result.context?.sourceOfTruth ?? null,
    plannedDocuments: result.plan?.selectedForComplexity ?? [],
    deferredGenerators: result.plan?.deferredGeneratorIds ?? [],
    generatedDocuments: result.generatedDocuments,
    readyForGenerators: result.pipeline.readyForGenerators,
    blockedReasons: result.pipeline.blockedReasons,
    passed:
      result.accepted &&
      result.validated &&
      result.generatedDocuments.length === 0 &&
      result.context?.sourceOfTruth === "EngineeringModel",
  };

  report.push(entry);
  writeFileSync(join(outDir, `${name}.json`), JSON.stringify({ entry, pipeline: result.pipeline }, null, 2));
}

writeFileSync(join(outDir, "summary.json"), JSON.stringify(report, null, 2));

console.log("Documentation Core Validation Report");
console.log("=".repeat(72));
for (const entry of report) {
  console.log(
    `\n[${entry.passed ? "PASS" : "FAIL"}] ${entry.domain} accepted=${entry.accepted} validated=${entry.validated} generated=${entry.generatedDocuments.length}`,
  );
  console.log(`  planned=${entry.plannedDocuments.join(",")}`);
  console.log(`  deferredGenerators=${entry.deferredGenerators.join(",")}`);
}
const failed = report.filter((e) => !e.passed);
console.log("\n" + "=".repeat(72));
console.log(`Fixtures: ${report.length} | Passed: ${report.length - failed.length} | Failed: ${failed.length}`);
if (failed.length) process.exit(1);
