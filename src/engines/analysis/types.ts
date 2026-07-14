import type { EngineContext, EngineResult } from "../types";
import type { NormalizedDiscovery } from "@/engines/contracts";
import type { EngineeringModelSchemaVersion } from "./schema";

/**
 * Analysis Engine contracts.
 * Consumes NormalizedDiscovery only.
 * Produces an internal Engineering Model only.
 */

export type ComplexityLevel =
  | "tiny"
  | "small"
  | "medium"
  | "large"
  | "enterprise";

export type AnalysisConfidence = "high" | "medium" | "low";

export type RequirementPriority = "must" | "should" | "could";

export type RiskSeverity = "low" | "medium" | "high" | "critical";

export type CandidateStatus = "inferred" | "placeholder" | "confirmed";

export interface EngineeringDimensionScore {
  dimension: string;
  score: number;
  rationale: string;
}

export interface ProjectSummary {
  projectId: string;
  projectName: string;
  projectType: string;
  projectTypeLabel: string;
  businessGoal: string;
  languages: string[];
  moduleCount: number;
  featureCount: number;
  roleCount: number;
  integrationCount: number;
  uiPlatforms: string[];
  deploymentStrategy: string;
  deploymentEnvironments: string[];
}

export interface ProjectClassification {
  domain: string;
  category: string;
  engineeringComplexityScore: number;
  complexityLevel: ComplexityLevel;
  dimensionScores: EngineeringDimensionScore[];
  rationale: string[];
}

export interface AnalyzedUserRole {
  id: string;
  name: string;
  responsibilities: string[];
  accessScope: string;
  source: "discovery";
}

export interface AnalyzedModule {
  id: string;
  name: string;
  purpose: string;
  relatedFeatureIds: string[];
  priority: RequirementPriority;
  source: "discovery";
}

export interface AnalyzedFeature {
  id: string;
  name: string;
  description: string;
  relatedModuleIds: string[];
  priority: RequirementPriority;
  source: "discovery";
}

export interface AnalyzedBusinessRule {
  id: string;
  description: string;
  status: "draft" | "inferred" | "confirmed";
  relatedModuleIds: string[];
  source: "discovery" | "analysis-inference";
}

export interface DatabaseCandidate {
  id: string;
  name: string;
  entityType: "core" | "module" | "relationship" | "audit";
  description: string;
  status: CandidateStatus;
  relatedModuleIds: string[];
}

export interface ApiCandidate {
  id: string;
  name: string;
  methodHints: string[];
  pathHint: string;
  description: string;
  status: CandidateStatus;
  relatedModuleIds: string[];
}

export interface ExternalIntegration {
  id: string;
  name: string;
  purpose: string;
  status: "selected" | "optional" | "recommended";
  riskNotes: string[];
}

export interface SecurityRequirement {
  id: string;
  category:
    | "authentication"
    | "authorization"
    | "data-protection"
    | "compliance"
    | "audit";
  description: string;
  priority: RequirementPriority;
  rationale: string;
}

export interface NonFunctionalRequirement {
  id: string;
  category:
    | "performance"
    | "scalability"
    | "availability"
    | "usability"
    | "maintainability"
    | "observability"
    | "deployment";
  description: string;
  priority: RequirementPriority;
}

export interface EngineeringRisk {
  id: string;
  title: string;
  description: string;
  severity: RiskSeverity;
  mitigation: string;
}

export interface RecommendedTechnologyStack {
  frontend: string[];
  backend: string[];
  database: string[];
  infrastructure: string[];
  aiServices: string[];
  rationale: string[];
  notes: string[];
}

export interface EngineeringModelMetadata {
  createdAt: string;
  sourceEngine: "analysis";
  schemaVersion: EngineeringModelSchemaVersion;
  discoverySchemaVersion: string;
  analysisConfidence: AnalysisConfidence;
  inputProjectId: string;
  warnings: string[];
}

/**
 * Internal Engineering Model.
 * Must never be emitted as Markdown documentation or a repository.
 */
export interface EngineeringModel {
  schemaVersion: EngineeringModelSchemaVersion;
  projectSummary: ProjectSummary;
  projectClassification: ProjectClassification;
  businessGoals: string[];
  userRoles: AnalyzedUserRole[];
  modules: AnalyzedModule[];
  features: AnalyzedFeature[];
  businessRules: AnalyzedBusinessRule[];
  databaseCandidates: DatabaseCandidate[];
  apiCandidates: ApiCandidate[];
  externalIntegrations: ExternalIntegration[];
  securityRequirements: SecurityRequirement[];
  nonFunctionalRequirements: NonFunctionalRequirement[];
  risks: EngineeringRisk[];
  complexityLevel: ComplexityLevel;
  recommendedTechnologyStack: RecommendedTechnologyStack;
  metadata: EngineeringModelMetadata;
}

export interface AnalysisValidationResult {
  valid: boolean;
  errors: string[];
}

export interface AnalysisEngineInput {
  action: "analyze";
  discovery: NormalizedDiscovery | unknown;
}

export type AnalysisEngineOutput = EngineeringModel;

export interface IAnalysisService {
  readonly serviceId: "analysis.service";
  readonly engineId: "analysis";

  validateInput(discovery: unknown): AnalysisValidationResult;

  analyze(
    discovery: NormalizedDiscovery,
    context: EngineContext,
  ): Promise<EngineResult<EngineeringModel>>;
}
