import type {
  ApiCandidate,
  BusinessRule,
  DatabaseCandidate,
  DiscoveryOutput,
  EngineeringFeature,
  EngineeringModel,
  Priority,
  Requirement,
} from "./types.js";

function uniqueStrings(values: Array<string | undefined | null>): string[] {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    if (!value) continue;
    const trimmed = value.trim();
    if (!trimmed) continue;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(trimmed);
  }
  return result;
}

function toSingularEntity(name: string): string {
  const cleaned = name
    .replace(/[^a-zA-Z0-9\s]/g, " ")
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
  if (cleaned.endsWith("ies")) return `${cleaned.slice(0, -3)}y`;
  if (cleaned.endsWith("sses")) return cleaned.slice(0, -2);
  if (cleaned.endsWith("s") && !cleaned.endsWith("ss")) return cleaned.slice(0, -1);
  return cleaned || "Entity";
}

function inferOperations(requirement: Requirement): ApiCandidate["operations"] {
  const text = `${requirement.title} ${requirement.description}`.toLowerCase();
  const operations = new Set<ApiCandidate["operations"][number]>();

  if (/create|add|register|book|place|submit|upload|send/.test(text)) {
    operations.add("POST");
  }
  if (/update|edit|modify|manage|change|confirm|cancel|reschedule/.test(text)) {
    operations.add("PUT");
    operations.add("PATCH");
  }
  if (/delete|remove|archive/.test(text)) {
    operations.add("DELETE");
  }
  if (
    /view|list|search|get|read|browse|track|report|dashboard|display/.test(text) ||
    operations.size === 0
  ) {
    operations.add("GET");
  }

  return Array.from(operations);
}

function deriveBusinessGoals(discovery: DiscoveryOutput): string[] {
  const fromRequirements = discovery.requirements
    .map((requirement) => requirement.businessObjective)
    .filter(Boolean) as string[];

  return uniqueStrings([
    discovery.vision,
    ...(discovery.successCriteria ?? []),
    ...fromRequirements,
    ...discovery.scope.included.map((item) => `Deliver capability: ${item}`),
  ]);
}

function deriveFeatures(discovery: DiscoveryOutput): EngineeringFeature[] {
  const moduleByRequirement = new Map<string, string>();
  for (const module of discovery.modules ?? []) {
    for (const requirementId of module.relatedRequirements ?? []) {
      moduleByRequirement.set(requirementId, module.id);
    }
  }

  const fromRequirements: EngineeringFeature[] = discovery.requirements
    .filter((requirement) => requirement.type === "functional")
    .map((requirement) => ({
      id: `FEAT-${requirement.id}`,
      name: requirement.title,
      description: requirement.description,
      requirementIds: [requirement.id],
      moduleId: moduleByRequirement.get(requirement.id),
      priority: (requirement.priority ?? "Medium") as Priority,
    }));

  if (fromRequirements.length > 0) {
    return fromRequirements;
  }

  return discovery.scope.included.map((item, index) => ({
    id: `FEAT-SCOPE-${String(index + 1).padStart(3, "0")}`,
    name: item,
    description: `Scoped feature derived from project scope: ${item}`,
    requirementIds: [],
    priority: "Medium" as Priority,
  }));
}

function deriveModules(
  discovery: DiscoveryOutput,
  features: EngineeringFeature[],
): EngineeringModel["modules"] {
  if ((discovery.modules?.length ?? 0) > 0) {
    return (discovery.modules ?? []).map((module) => ({
      id: module.id,
      name: module.name,
      responsibility: module.responsibility ?? `Owns ${module.name} capabilities.`,
      relatedRequirements: module.relatedRequirements ?? [],
      featureIds: features
        .filter((feature) => feature.moduleId === module.id)
        .map((feature) => feature.id),
    }));
  }

  // Derive module candidates from functional requirement categories/titles.
  const buckets = new Map<string, Requirement[]>();
  for (const requirement of discovery.requirements.filter(
    (item) => item.type === "functional",
  )) {
    const key =
      requirement.category?.trim() ||
      requirement.title.split(" ")[0] ||
      "Core";
    const list = buckets.get(key) ?? [];
    list.push(requirement);
    buckets.set(key, list);
  }

  let index = 1;
  const derived: EngineeringModel["modules"] = [];
  for (const [name, requirements] of buckets) {
    const id = `MOD-DERIVED-${String(index++).padStart(3, "0")}`;
    const relatedRequirements = requirements.map((requirement) => requirement.id);
    derived.push({
      id,
      name,
      responsibility: `Derived module covering ${name} capabilities.`,
      relatedRequirements,
      featureIds: features
        .filter((feature) =>
          feature.requirementIds.some((requirementId) =>
            relatedRequirements.includes(requirementId),
          ),
        )
        .map((feature) => feature.id),
    });
  }

  if (derived.length === 0) {
    derived.push({
      id: "MOD-DERIVED-001",
      name: "Core",
      responsibility: "Core application capabilities.",
      relatedRequirements: discovery.requirements.map((requirement) => requirement.id),
      featureIds: features.map((feature) => feature.id),
    });
  }

  return derived;
}

function deriveDatabaseCandidates(
  discovery: DiscoveryOutput,
  modules: EngineeringModel["modules"],
): DatabaseCandidate[] {
  const candidates: DatabaseCandidate[] = [];
  const seen = new Set<string>();

  const push = (
    entity: string,
    description: string,
    source: string,
    relatedModules: string[],
    relatedRequirements: string[],
  ): void => {
    const key = entity.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    candidates.push({
      entity,
      description,
      source,
      relatedModules,
      relatedRequirements,
    });
  };

  for (const persona of discovery.personas) {
    push(
      toSingularEntity(persona.role || persona.name || "User"),
      `Entity representing persona/role ${persona.role}.`,
      "persona",
      modules.map((module) => module.id),
      [],
    );
  }

  for (const module of modules) {
    push(
      toSingularEntity(module.name),
      `Primary entity candidate for module ${module.name}.`,
      "module",
      [module.id],
      module.relatedRequirements,
    );
  }

  for (const requirement of discovery.requirements.filter(
    (item) => item.type === "functional",
  )) {
    const entity = toSingularEntity(requirement.title);
    const relatedModules = modules
      .filter((module) => module.relatedRequirements.includes(requirement.id))
      .map((module) => module.id);
    push(
      entity,
      `Entity inferred from requirement ${requirement.id}.`,
      "requirement",
      relatedModules,
      [requirement.id],
    );
  }

  // Common supporting entities for authenticated systems.
  const mentionsAuth = discovery.requirements.some((requirement) =>
    /auth|login|permission|role/i.test(`${requirement.title} ${requirement.description}`),
  );
  if (mentionsAuth) {
    push("User", "Authenticated user account.", "security", ["Authentication"], ["auth"]);
    push("Role", "Authorization role assignment.", "security", ["Authentication"], ["auth"]);
    push(
      "Permission",
      "Authorization permission assignment.",
      "security",
      ["Authentication"],
      ["auth"],
    );
  }

  return candidates;
}

function deriveApiCandidates(
  discovery: DiscoveryOutput,
  modules: EngineeringModel["modules"],
): ApiCandidate[] {
  const candidates: ApiCandidate[] = [];
  const seen = new Set<string>();

  for (const requirement of discovery.requirements.filter(
    (item) => item.type === "functional",
  )) {
    const resource = toSingularEntity(requirement.title);
    const key = resource.toLowerCase();
    if (seen.has(key)) {
      const existing = candidates.find(
        (candidate) => candidate.resource.toLowerCase() === key,
      );
      if (existing) {
        existing.relatedRequirements = uniqueStrings([
          ...existing.relatedRequirements,
          requirement.id,
        ]);
        existing.operations = Array.from(
          new Set([...existing.operations, ...inferOperations(requirement)]),
        ) as ApiCandidate["operations"];
      }
      continue;
    }
    seen.add(key);

    candidates.push({
      resource,
      operations: inferOperations(requirement),
      description: `API resource inferred from ${requirement.id}: ${requirement.title}`,
      relatedRequirements: [requirement.id],
      relatedModules: modules
        .filter((module) => module.relatedRequirements.includes(requirement.id))
        .map((module) => module.id),
    });
  }

  if (candidates.length === 0) {
    for (const module of modules) {
      candidates.push({
        resource: toSingularEntity(module.name),
        operations: ["GET", "POST", "PUT", "DELETE"],
        description: `API resource inferred from module ${module.name}.`,
        relatedRequirements: module.relatedRequirements,
        relatedModules: [module.id],
      });
    }
  }

  return candidates;
}

function deriveSecurityRequirements(discovery: DiscoveryOutput): string[] {
  const explicit = discovery.requirements
    .filter(
      (requirement) =>
        requirement.type === "non-functional" &&
        (requirement.nfrCategory === "Security" ||
          /security|auth|permission|encryption|gdpr|privacy/i.test(
            `${requirement.title} ${requirement.description}`,
          )),
    )
    .map((requirement) => `${requirement.id}: ${requirement.title}`);

  const fromProfile = discovery.engineeringProfile?.securityRequirements ?? [];
  const fromConstraints = (discovery.technicalConstraints ?? []).filter((item) =>
    /security|auth|gdpr|privacy|pci|hipaa|encryption/i.test(item),
  );

  const inferred: string[] = [];
  const mentionsAuth = discovery.requirements.some((requirement) =>
    /login|auth|permission|role/i.test(`${requirement.title} ${requirement.description}`),
  );
  if (mentionsAuth) {
    inferred.push("Enforce authentication and role-based authorization.");
  }
  if ((discovery.integrations ?? []).some((item) => /payment|stripe|paypal/i.test(item.name))) {
    inferred.push("Protect payment data and comply with payment security controls.");
  }

  return uniqueStrings([...explicit, ...fromProfile, ...fromConstraints, ...inferred]);
}

function deriveNonFunctionalRequirements(
  discovery: DiscoveryOutput,
): EngineeringModel["nonFunctionalRequirements"] {
  return discovery.requirements
    .filter((requirement) => requirement.type === "non-functional")
    .map((requirement) => ({
      id: requirement.id,
      title: requirement.title,
      description: requirement.description,
      category: requirement.nfrCategory ?? requirement.category ?? "General",
      priority: (requirement.priority ?? "Medium") as Priority,
    }));
}

function normalizeIntegrations(
  discovery: DiscoveryOutput,
): EngineeringModel["externalIntegrations"] {
  return (discovery.integrations ?? []).map((integration) => ({
    id: integration.id,
    name: integration.name,
    purpose: integration.purpose ?? "External system integration",
    provider: integration.provider ?? "Unspecified",
    relatedRequirements: integration.relatedRequirements ?? [],
  }));
}

function normalizeBusinessRules(discovery: DiscoveryOutput): BusinessRule[] {
  return discovery.businessRules.map((rule) => ({
    ...rule,
    relatedRequirements: rule.relatedRequirements ?? [],
    conditions: rule.conditions ?? [],
    outcomes: rule.outcomes ?? [],
    exceptions: rule.exceptions ?? [],
  }));
}

/**
 * Build the verified Engineering Model from Discovery Output.
 * Derives missing architecture candidates without inventing business facts.
 */
export function buildEngineeringModel(
  discovery: DiscoveryOutput,
): EngineeringModel {
  const features = deriveFeatures(discovery);
  const modules = deriveModules(discovery, features);
  const databaseCandidates = deriveDatabaseCandidates(discovery, modules);
  const apiCandidates = deriveApiCandidates(discovery, modules);

  return {
    projectClassification: { ...discovery.classification },
    businessGoals: deriveBusinessGoals(discovery),
    userRoles: discovery.personas.map((persona) => ({
      id: persona.id,
      name: persona.name,
      role: persona.role,
      responsibilities: persona.responsibilities ?? [],
      permissions: persona.permissions ?? [],
    })),
    modules,
    features,
    businessRules: normalizeBusinessRules(discovery),
    databaseCandidates,
    apiCandidates,
    externalIntegrations: normalizeIntegrations(discovery),
    securityRequirements: deriveSecurityRequirements(discovery),
    nonFunctionalRequirements: deriveNonFunctionalRequirements(discovery),
    complexityLevel: discovery.classification.level,
  };
}

export function validateEngineeringModel(model: EngineeringModel): string[] {
  const missing: string[] = [];

  if (!model.projectClassification?.level) missing.push("Project Classification");
  if (model.businessGoals.length === 0) missing.push("Business Goals");
  if (model.userRoles.length === 0) missing.push("User Roles");
  if (model.modules.length === 0) missing.push("Modules");
  if (model.features.length === 0) missing.push("Features");
  if (model.businessRules.length === 0) missing.push("Business Rules");
  if (model.databaseCandidates.length === 0) missing.push("Database Candidates");
  if (model.apiCandidates.length === 0) missing.push("API Candidates");
  // External integrations may be empty for simple projects (valid).
  if (model.securityRequirements.length === 0) missing.push("Security Requirements");
  if (model.nonFunctionalRequirements.length === 0) {
    missing.push("Non-Functional Requirements");
  }
  if (!model.complexityLevel) missing.push("Complexity Level");

  return missing;
}
