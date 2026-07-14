import {
  validateNormalizedDiscovery,
  type NormalizationValidationResult,
} from "@/engines/contracts";
import type { AnalysisValidationResult } from "./types";

/**
 * Validates Analysis Engine input.
 * Reuses the official NormalizedDiscovery validator.
 * Does not modify Discovery Engine behavior.
 */
export function validateAnalysisInput(
  discovery: unknown,
): AnalysisValidationResult {
  const result: NormalizationValidationResult =
    validateNormalizedDiscovery(discovery);

  return {
    valid: result.valid,
    errors: result.errors,
  };
}
