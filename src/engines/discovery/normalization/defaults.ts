import {
  DISCOVERY_SCHEMA_VERSION,
  type NormalizedDiscovery,
} from "./schema";

/**
 * Default values for the canonical Discovery Schema.
 * Used when Discovery answers omit optional or deferred fields.
 */
export function createDiscoverySchemaDefaults(): Pick<
  NormalizedDiscovery,
  | "schemaVersion"
  | "businessRules"
  | "database"
  | "api"
  | "ui"
  | "deployment"
> {
  return {
    schemaVersion: DISCOVERY_SCHEMA_VERSION,
    businessRules: [],
    database: {
      entities: [],
      notes: [
        "Database entities are reserved for future Analysis/Database engines.",
      ],
    },
    api: {
      resources: [],
      notes: ["API resources are reserved for future Analysis/API engines."],
    },
    ui: {
      platforms: ["web"],
      languages: [],
      notes: ["UI details are reserved for future UI planning."],
    },
    deployment: {
      environments: ["development", "production"],
      strategy: "undetermined",
      notes: ["Deployment strategy is reserved for future planning."],
    },
  };
}

export function createEmptyNormalizedDiscovery(
  createdAt: string = new Date().toISOString(),
): NormalizedDiscovery {
  const defaults = createDiscoverySchemaDefaults();

  return {
    ...defaults,
    project: {
      id: "",
      name: "",
      type: "",
      typeLabel: "",
      businessGoal: "",
      languages: [],
    },
    roles: [],
    modules: [],
    features: [],
    integrations: [],
    metadata: {
      createdAt,
      updatedAt: createdAt,
      source: "discovery-wizard",
      schemaVersion: DISCOVERY_SCHEMA_VERSION,
      projectTypeId: "",
      sessionHints: {
        hasRoles: false,
        hasModules: false,
        hasFeatures: false,
        hasLanguages: false,
        hasIntegrations: false,
      },
    },
  };
}
