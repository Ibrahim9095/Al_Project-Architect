import { DISCOVERY_SCHEMA_VERSION } from "./schema";
import type {
  NormalizationValidationResult,
  NormalizedDiscovery,
} from "./schema";

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isNamedItemArray(value: unknown): boolean {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        isNonEmptyString((item as { id?: unknown }).id) &&
        isNonEmptyString((item as { name?: unknown }).name),
    )
  );
}

/**
 * Validates a normalized Discovery Schema object.
 */
export function validateNormalizedDiscovery(
  value: unknown,
): NormalizationValidationResult {
  const errors: string[] = [];

  if (typeof value !== "object" || value === null) {
    return {
      valid: false,
      errors: ["Normalized Discovery must be an object."],
    };
  }

  const data = value as Partial<NormalizedDiscovery>;

  if (data.schemaVersion !== DISCOVERY_SCHEMA_VERSION) {
    errors.push(
      `schemaVersion must be "${DISCOVERY_SCHEMA_VERSION}".`,
    );
  }

  if (!data.project || typeof data.project !== "object") {
    errors.push("project is required.");
  } else {
    if (!isNonEmptyString(data.project.id)) {
      errors.push("project.id is required.");
    }
    if (!isNonEmptyString(data.project.name)) {
      errors.push("project.name is required.");
    }
    if (!isNonEmptyString(data.project.type)) {
      errors.push("project.type is required.");
    }
    if (!isNonEmptyString(data.project.typeLabel)) {
      errors.push("project.typeLabel is required.");
    }
    if (!Array.isArray(data.project.languages) || data.project.languages.length === 0) {
      errors.push("project.languages must contain at least one language.");
    }
  }

  if (!isNamedItemArray(data.roles) || (data.roles?.length ?? 0) === 0) {
    errors.push("roles must contain at least one role.");
  }

  if (!isNamedItemArray(data.modules) || (data.modules?.length ?? 0) === 0) {
    errors.push("modules must contain at least one module.");
  }

  if (!isNamedItemArray(data.features) || (data.features?.length ?? 0) === 0) {
    errors.push("features must contain at least one feature.");
  }

  if (!Array.isArray(data.businessRules)) {
    errors.push("businessRules must be an array.");
  }

  if (!data.database || !Array.isArray(data.database.entities)) {
    errors.push("database.entities must be an array.");
  }

  if (!data.api || !Array.isArray(data.api.resources)) {
    errors.push("api.resources must be an array.");
  }

  if (!Array.isArray(data.integrations)) {
    errors.push("integrations must be an array.");
  }

  if (!data.ui || !Array.isArray(data.ui.platforms) || data.ui.platforms.length === 0) {
    errors.push("ui.platforms must contain at least one platform.");
  }

  if (
    !data.deployment ||
    !isNonEmptyString(data.deployment.strategy) ||
    !Array.isArray(data.deployment.environments) ||
    data.deployment.environments.length === 0
  ) {
    errors.push("deployment must include strategy and environments.");
  }

  if (!data.metadata || typeof data.metadata !== "object") {
    errors.push("metadata is required.");
  } else {
    if (data.metadata.source !== "discovery-wizard") {
      errors.push('metadata.source must be "discovery-wizard".');
    }
    if (data.metadata.schemaVersion !== DISCOVERY_SCHEMA_VERSION) {
      errors.push(
        `metadata.schemaVersion must be "${DISCOVERY_SCHEMA_VERSION}".`,
      );
    }
    if (!isNonEmptyString(data.metadata.createdAt)) {
      errors.push("metadata.createdAt is required.");
    }
    if (!isNonEmptyString(data.metadata.updatedAt)) {
      errors.push("metadata.updatedAt is required.");
    }
    if (!isNonEmptyString(data.metadata.projectTypeId)) {
      errors.push("metadata.projectTypeId is required.");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
