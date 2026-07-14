import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createAnalysisEngine } from "../dist/engines/analysis/index.js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(
  root,
  "tests/engines/analysis/fixtures/discovery",
);
const outDir = join(root, "tmp/analysis-validation");
mkdirSync(outDir, { recursive: true });

const required = [
  "projectClassification",
  "businessGoals",
  "userRoles",
  "modules",
  "features",
  "businessRules",
  "databaseCandidates",
  "apiCandidates",
  "externalIntegrations",
  "securityRequirements",
  "nonFunctionalRequirements",
  "complexityLevel",
];

const engine = createAnalysisEngine();
const files = readdirSync(fixturesDir).filter((f) => f.endsWith(".json")).sort();
const report = [];

for (const file of files) {
  const name = file.replace(/\.json$/, "");
  const discovery = JSON.parse(readFileSync(join(fixturesDir, file), "utf8"));
  const result = engine.analyze(discovery);
  const model = result.engineeringModel;

  const sectionStatus = {
    "Project Classification": Boolean(model.projectClassification?.level),
    "Business Goals": model.businessGoals.length > 0,
    "User Roles": model.userRoles.length > 0,
    Modules: model.modules.length > 0,
    Features: model.features.length > 0,
    "Business Rules": model.businessRules.length > 0,
    "Database Candidates": model.databaseCandidates.length > 0,
    "API Candidates": model.apiCandidates.length > 0,
    "External Integrations": model.externalIntegrations.length > 0,
    "Security Requirements": model.securityRequirements.length > 0,
    "Non-Functional Requirements": model.nonFunctionalRequirements.length > 0,
    "Complexity Level": Boolean(model.complexityLevel),
  };

  const missing = Object.entries(sectionStatus)
    .filter(([, ok]) => !ok)
    .map(([section]) => section);

  const entry = {
    domain: name,
    status: result.status,
    approvedForArchitecture: result.approvedForArchitecture,
    confidence: result.confidence,
    readinessScore: result.readinessScore,
    complexityLevel: model.complexityLevel,
    counts: {
      businessGoals: model.businessGoals.length,
      userRoles: model.userRoles.length,
      modules: model.modules.length,
      features: model.features.length,
      businessRules: model.businessRules.length,
      databaseCandidates: model.databaseCandidates.length,
      apiCandidates: model.apiCandidates.length,
      externalIntegrations: model.externalIntegrations.length,
      securityRequirements: model.securityRequirements.length,
      nonFunctionalRequirements: model.nonFunctionalRequirements.length,
    },
    sectionStatus,
    missingSections: missing,
    qualityGates: result.qualityGates,
  };

  report.push(entry);
  writeFileSync(join(outDir, `${name}.result.json`), JSON.stringify({ result: {
    status: result.status,
    approvedForArchitecture: result.approvedForArchitecture,
    confidence: result.confidence,
    readinessScore: result.readinessScore,
    engineeringModel: model,
  }, validation: entry }, null, 2));
}

writeFileSync(join(outDir, "summary.json"), JSON.stringify(report, null, 2));

console.log("Analysis Engine Validation Report");
console.log("=".repeat(72));
for (const entry of report) {
  const pass = entry.missingSections.length === 0 ? "PASS" : "FAIL";
  console.log(`\n[${pass}] ${entry.domain}`);
  console.log(`  status=${entry.status} readiness=${entry.readinessScore} confidence=${entry.confidence}`);
  console.log(`  complexity=${entry.complexityLevel} approved=${entry.approvedForArchitecture}`);
  console.log(`  counts=${JSON.stringify(entry.counts)}`);
  if (entry.missingSections.length) {
    console.log(`  missing=${entry.missingSections.join(", ")}`);
  }
}
const failed = report.filter((e) => e.missingSections.length > 0);
console.log("\n" + "=".repeat(72));
console.log(`Fixtures: ${report.length} | Passed: ${report.length - failed.length} | Failed: ${failed.length}`);
if (failed.length) process.exit(1);
