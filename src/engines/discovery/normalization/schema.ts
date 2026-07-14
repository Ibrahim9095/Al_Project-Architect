/**
 * Canonical Discovery Schema.
 * Official contract between Discovery and every future engine.
 * Future engines must consume ONLY this normalized schema.
 */

export const DISCOVERY_SCHEMA_VERSION = "1.0.0" as const;

export type DiscoverySchemaVersion = typeof DISCOVERY_SCHEMA_VERSION;

export interface NormalizedNamedItem {
  id: string;
  name: string;
}

export interface NormalizedBusinessRule {
  id: string;
  description: string;
  status: "draft" | "inferred" | "confirmed";
}

export interface NormalizedDatabaseEntity {
  id: string;
  name: string;
  status: "placeholder" | "planned";
}

export interface NormalizedApiResource {
  id: string;
  name: string;
  status: "placeholder" | "planned";
}

export interface NormalizedIntegration {
  id: string;
  name: string;
  status: "selected" | "optional";
}

export interface NormalizedProject {
  id: string;
  name: string;
  type: string;
  typeLabel: string;
  businessGoal: string;
  languages: string[];
}

export interface NormalizedDatabase {
  entities: NormalizedDatabaseEntity[];
  notes: string[];
}

export interface NormalizedApi {
  resources: NormalizedApiResource[];
  notes: string[];
}

export interface NormalizedUi {
  platforms: string[];
  languages: string[];
  notes: string[];
}

export interface NormalizedDeployment {
  environments: string[];
  strategy: string;
  notes: string[];
}

export interface NormalizedDiscoveryMetadata {
  createdAt: string;
  updatedAt: string;
  source: "discovery-wizard";
  schemaVersion: DiscoverySchemaVersion;
  projectTypeId: string;
  sessionHints: {
    hasRoles: boolean;
    hasModules: boolean;
    hasFeatures: boolean;
    hasLanguages: boolean;
    hasIntegrations: boolean;
  };
}

/**
 * Canonical normalized Discovery object.
 * This is the only Discovery output future engines should consume.
 */
export interface NormalizedDiscovery {
  schemaVersion: DiscoverySchemaVersion;
  project: NormalizedProject;
  roles: NormalizedNamedItem[];
  modules: NormalizedNamedItem[];
  features: NormalizedNamedItem[];
  businessRules: NormalizedBusinessRule[];
  database: NormalizedDatabase;
  api: NormalizedApi;
  integrations: NormalizedIntegration[];
  ui: NormalizedUi;
  deployment: NormalizedDeployment;
  metadata: NormalizedDiscoveryMetadata;
}

export interface NormalizationValidationResult {
  valid: boolean;
  errors: string[];
}
