import { createHash } from "node:crypto";
import type { EngineeringModel } from "../../analysis/types";
import type { DocumentationContext } from "../types";

function fingerprint(model: EngineeringModel): string {
  const payload = JSON.stringify(model);
  return createHash("sha256").update(payload).digest("hex");
}

function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== "object") {
    return value;
  }

  Object.freeze(value);

  for (const key of Reflect.ownKeys(value as object)) {
    const child = (value as Record<string | symbol, unknown>)[key];
    if (child && typeof child === "object" && !Object.isFrozen(child)) {
      deepFreeze(child);
    }
  }

  return value;
}

/**
 * Bind the Engineering Model as the immutable documentation source of truth.
 */
export function createDocumentationContext(
  model: EngineeringModel,
): DocumentationContext {
  return {
    sourceOfTruth: "EngineeringModel",
    engineeringModel: deepFreeze(JSON.parse(JSON.stringify(model)) as EngineeringModel),
    boundAt: new Date().toISOString(),
    modelFingerprint: fingerprint(model),
  };
}
