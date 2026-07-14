/**
 * Shared domain types for AI Project Architect.
 * Identifier conventions follow docs/00_ENGINEERING_STANDARD.md
 */

export type RequirementId = `REQ-${string}`;
export type BusinessRuleId = `BR-${string}`;
export type ModuleId = `MOD-${string}`;
export type DatabaseEntityId = `DB-${string}`;
export type ApiResourceId = `API-${string}`;
export type TaskId = `TASK-${string}`;
export type ChangeId = `CR-${string}`;

export type ProjectComplexity =
  | "tiny"
  | "small"
  | "medium"
  | "large"
  | "enterprise";

export type EngineeringStatus =
  | "draft"
  | "in_progress"
  | "review"
  | "approved"
  | "exported";

export interface ProjectIdentity {
  name: string;
  description: string;
  complexity?: ProjectComplexity;
  status: EngineeringStatus;
}
