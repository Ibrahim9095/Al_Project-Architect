/**
 * Discovery catalog contracts.
 * New project types are registered in project-types/registry.ts.
 */

export type DiscoveryFieldType =
  | "text"
  | "textarea"
  | "select"
  | "multiselect";

export type DiscoveryJsonField =
  | "projectType"
  | "roles"
  | "modules"
  | "features"
  | "languages"
  | "integrations"
  | "projectName"
  | "businessGoal";

export interface DiscoveryOption {
  value: string;
  label: string;
}

export interface DiscoveryQuestion {
  id: string;
  label: string;
  description?: string;
  type: DiscoveryFieldType;
  required: boolean;
  options?: DiscoveryOption[];
  placeholder?: string;
  /** Target field in the final Discovery JSON (or supporting meta). */
  mapsTo: DiscoveryJsonField;
}

export interface DiscoveryStepDefinition {
  id: string;
  title: string;
  description: string;
  questions: DiscoveryQuestion[];
}

export interface ProjectTypeDefinition {
  id: string;
  label: string;
  description: string;
  /** Extra steps inserted after core project setup. */
  steps: DiscoveryStepDefinition[];
  roleOptions: DiscoveryOption[];
  moduleOptions: DiscoveryOption[];
  featureOptions: DiscoveryOption[];
  integrationOptions: DiscoveryOption[];
}

export interface DiscoveryJson {
  projectType: string;
  roles: string[];
  modules: string[];
  features: string[];
  languages: string[];
  integrations: string[];
}

export type DiscoveryAnswers = Record<string, string | string[]>;

export interface DiscoveryValidationResult {
  valid: boolean;
  errors: Record<string, string>;
}
