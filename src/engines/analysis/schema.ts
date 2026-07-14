/**
 * Analysis Engine schema constants.
 * Engineering Model is INTERNAL ONLY — not documentation, not export.
 */

export const ENGINEERING_MODEL_SCHEMA_VERSION = "1.0.0" as const;

export type EngineeringModelSchemaVersion =
  typeof ENGINEERING_MODEL_SCHEMA_VERSION;

export const ANALYSIS_ENGINE_ID = "analysis" as const;
