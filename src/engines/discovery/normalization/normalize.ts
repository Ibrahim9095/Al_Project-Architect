import { getProjectTypeDefinition } from "../catalog";
import type { DiscoveryAnswers, DiscoveryJson } from "../catalog";
import { buildDiscoveryJson } from "../catalog";
import { createDiscoverySchemaDefaults } from "./defaults";
import {
  DISCOVERY_SCHEMA_VERSION,
  type NormalizedDiscovery,
  type NormalizedNamedItem,
} from "./schema";

function toNamedItems(
  ids: string[],
  labelLookup: Map<string, string>,
): NormalizedNamedItem[] {
  return ids.map((id) => ({
    id,
    name: labelLookup.get(id) ?? id,
  }));
}

function buildLabelLookup(
  options: Array<{ value: string; label: string }> | undefined,
): Map<string, string> {
  return new Map((options ?? []).map((option) => [option.value, option.label]));
}

function slugifyProjectName(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "untitled-project";
}

function asString(value: string | string[] | undefined): string {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Converts Discovery Wizard answers into the canonical normalized schema.
 */
export function normalizeDiscoveryAnswers(
  answers: DiscoveryAnswers,
  options?: { createdAt?: string },
): NormalizedDiscovery {
  const createdAt = options?.createdAt ?? new Date().toISOString();
  const discoveryJson = buildDiscoveryJson(answers);
  return normalizeDiscoveryJson(discoveryJson, answers, createdAt);
}

/**
 * Converts a raw Discovery JSON object into the canonical normalized schema.
 */
export function normalizeDiscoveryJson(
  discoveryJson: DiscoveryJson,
  answers: DiscoveryAnswers = {},
  createdAt: string = new Date().toISOString(),
): NormalizedDiscovery {
  const defaults = createDiscoverySchemaDefaults();
  const projectType = getProjectTypeDefinition(discoveryJson.projectType);

  const roleLookup = buildLabelLookup(projectType?.roleOptions);
  const moduleLookup = buildLabelLookup(projectType?.moduleOptions);
  const featureLookup = buildLabelLookup(projectType?.featureOptions);
  const integrationLookup = buildLabelLookup(projectType?.integrationOptions);

  const projectName = asString(answers.projectName) || "Untitled Project";
  const businessGoal = asString(answers.businessGoal);
  const languages = discoveryJson.languages;

  return {
    schemaVersion: DISCOVERY_SCHEMA_VERSION,
    project: {
      id: slugifyProjectName(projectName),
      name: projectName,
      type: discoveryJson.projectType,
      typeLabel: projectType?.label ?? discoveryJson.projectType,
      businessGoal,
      languages,
    },
    roles: toNamedItems(discoveryJson.roles, roleLookup),
    modules: toNamedItems(discoveryJson.modules, moduleLookup),
    features: toNamedItems(discoveryJson.features, featureLookup),
    businessRules: defaults.businessRules,
    database: {
      ...defaults.database,
      entities: discoveryJson.modules.map((moduleId) => ({
        id: `${moduleId}-entity`,
        name: `${moduleLookup.get(moduleId) ?? moduleId} Entity`,
        status: "placeholder" as const,
      })),
    },
    api: {
      ...defaults.api,
      resources: discoveryJson.modules.map((moduleId) => ({
        id: `${moduleId}-api`,
        name: `${moduleLookup.get(moduleId) ?? moduleId} API`,
        status: "placeholder" as const,
      })),
    },
    integrations: discoveryJson.integrations.map((id) => ({
      id,
      name: integrationLookup.get(id) ?? id,
      status: "selected" as const,
    })),
    ui: {
      ...defaults.ui,
      languages,
    },
    deployment: defaults.deployment,
    metadata: {
      createdAt,
      updatedAt: createdAt,
      source: "discovery-wizard",
      schemaVersion: DISCOVERY_SCHEMA_VERSION,
      projectTypeId: discoveryJson.projectType,
      sessionHints: {
        hasRoles: discoveryJson.roles.length > 0,
        hasModules: discoveryJson.modules.length > 0,
        hasFeatures: discoveryJson.features.length > 0,
        hasLanguages: discoveryJson.languages.length > 0,
        hasIntegrations: discoveryJson.integrations.length > 0,
      },
    },
  };
}
