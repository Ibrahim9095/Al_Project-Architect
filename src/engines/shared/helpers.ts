import type { EngineContext, EngineResult } from "../types";
import { createNotImplementedResult } from "../types";

/**
 * Shared helpers for engine placeholder implementations.
 */

export function blockedCapability<T = never>(
  engineId: Parameters<typeof createNotImplementedResult>[0],
  capability: string,
): EngineResult<T> {
  return createNotImplementedResult<T>(engineId, capability);
}

export function assertEngineContext(context: EngineContext): void {
  if (!context.projectId || !context.requestId) {
    throw new Error("EngineContext requires projectId and requestId.");
  }
}
