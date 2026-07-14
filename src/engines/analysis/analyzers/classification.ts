import type { NormalizedDiscovery } from "@/engines/contracts";
import type {
  ComplexityLevel,
  EngineeringDimensionScore,
  ProjectClassification,
} from "../types";

function clampScore(value: number): number {
  return Math.min(5, Math.max(1, Math.round(value)));
}

function scoreBusiness(discovery: NormalizedDiscovery): EngineeringDimensionScore {
  const modules = discovery.modules.length;
  const rules = discovery.businessRules.length;
  const score = clampScore(
    1 + modules / 2 + (rules > 0 ? Math.min(2, rules / 2) : 0),
  );
  return {
    dimension: "business",
    score,
    rationale: `${modules} modules and ${rules} business rules indicate business process scope.`,
  };
}

function scoreFunctional(
  discovery: NormalizedDiscovery,
): EngineeringDimensionScore {
  const features = discovery.features.length;
  const score = clampScore(1 + features / 2);
  return {
    dimension: "functional",
    score,
    rationale: `${features} features drive functional complexity.`,
  };
}

function scoreUser(discovery: NormalizedDiscovery): EngineeringDimensionScore {
  const roles = discovery.roles.length;
  const score = clampScore(1 + roles / 1.5);
  return {
    dimension: "user",
    score,
    rationale: `${roles} user roles require access-control modeling.`,
  };
}

function scoreData(discovery: NormalizedDiscovery): EngineeringDimensionScore {
  const entities = discovery.database.entities.length;
  const score = clampScore(1 + entities / 2);
  return {
    dimension: "data",
    score,
    rationale: `${entities} database entity candidates affect data model complexity.`,
  };
}

function scoreIntegration(
  discovery: NormalizedDiscovery,
): EngineeringDimensionScore {
  const integrations = discovery.integrations.length;
  const score = clampScore(integrations === 0 ? 1 : 1 + integrations);
  return {
    dimension: "integration",
    score,
    rationale:
      integrations === 0
        ? "No external integrations selected."
        : `${integrations} external integrations increase coupling risk.`,
  };
}

function scoreSecurity(
  discovery: NormalizedDiscovery,
): EngineeringDimensionScore {
  const type = discovery.project.type;
  let base = 2;
  if (type === "clinic") base = 4;
  if (type === "ecommerce") base = 3;
  if (type === "crm") base = 3;
  if (discovery.roles.length >= 4) base += 1;
  const score = clampScore(base);
  return {
    dimension: "security",
    score,
    rationale: `Project type "${type}" and ${discovery.roles.length} roles set security baseline.`,
  };
}

function scoreInfrastructure(
  discovery: NormalizedDiscovery,
): EngineeringDimensionScore {
  const environments = discovery.deployment.environments.length;
  const score = clampScore(1 + environments);
  return {
    dimension: "infrastructure",
    score,
    rationale: `${environments} deployment environments under strategy "${discovery.deployment.strategy}".`,
  };
}

function scoreScalability(
  discovery: NormalizedDiscovery,
): EngineeringDimensionScore {
  const load =
    discovery.modules.length +
    discovery.integrations.length +
    discovery.features.length / 2;
  const score = clampScore(1 + load / 3);
  return {
    dimension: "scalability",
    score,
    rationale:
      "Module, feature, and integration volume inform expected growth pressure.",
  };
}

export function mapEcsToComplexityLevel(ecs: number): ComplexityLevel {
  if (ecs <= 10) return "tiny";
  if (ecs <= 18) return "small";
  if (ecs <= 28) return "medium";
  if (ecs <= 36) return "large";
  return "enterprise";
}

function resolveDomain(projectType: string): string {
  switch (projectType) {
    case "ecommerce":
      return "commerce";
    case "clinic":
      return "healthcare";
    case "crm":
      return "customer-relationship";
    default:
      return "general-software";
  }
}

function resolveCategory(projectType: string): string {
  switch (projectType) {
    case "ecommerce":
      return "transactional-web-application";
    case "clinic":
      return "operations-management-system";
    case "crm":
      return "business-operations-platform";
    default:
      return "custom-software-system";
  }
}

export function buildProjectClassification(
  discovery: NormalizedDiscovery,
): ProjectClassification {
  const dimensionScores: EngineeringDimensionScore[] = [
    scoreBusiness(discovery),
    scoreFunctional(discovery),
    scoreUser(discovery),
    scoreData(discovery),
    scoreIntegration(discovery),
    scoreSecurity(discovery),
    scoreInfrastructure(discovery),
    scoreScalability(discovery),
  ];

  const engineeringComplexityScore = dimensionScores.reduce(
    (sum, item) => sum + item.score,
    0,
  );
  const complexityLevel = mapEcsToComplexityLevel(engineeringComplexityScore);

  return {
    domain: resolveDomain(discovery.project.type),
    category: resolveCategory(discovery.project.type),
    engineeringComplexityScore,
    complexityLevel,
    dimensionScores,
    rationale: [
      `Classified as ${complexityLevel} based on Engineering Complexity Score ${engineeringComplexityScore}.`,
      `Domain mapped from Discovery project type "${discovery.project.type}".`,
      ...dimensionScores
        .filter((item) => item.score >= 4)
        .map((item) => `Elevated ${item.dimension} complexity: ${item.rationale}`),
    ],
  };
}
