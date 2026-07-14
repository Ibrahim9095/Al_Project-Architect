import type { ProjectTypeDefinition } from "../types";
import { clinicProjectType } from "./clinic";
import { crmProjectType } from "./crm";
import { ecommerceProjectType } from "./ecommerce";

/**
 * Project type registry.
 * To add a new project type:
 * 1. Create a definition file in this folder.
 * 2. Import and append it to PROJECT_TYPE_DEFINITIONS.
 */
export const PROJECT_TYPE_DEFINITIONS: ProjectTypeDefinition[] = [
  ecommerceProjectType,
  clinicProjectType,
  crmProjectType,
];

export function getProjectTypeDefinition(
  projectTypeId: string,
): ProjectTypeDefinition | undefined {
  return PROJECT_TYPE_DEFINITIONS.find((type) => type.id === projectTypeId);
}

export function listProjectTypes(): Array<{
  id: string;
  label: string;
  description: string;
}> {
  return PROJECT_TYPE_DEFINITIONS.map(({ id, label, description }) => ({
    id,
    label,
    description,
  }));
}
