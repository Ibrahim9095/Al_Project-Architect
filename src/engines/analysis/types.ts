/**
 * Analysis Engine types.
 *
 * Input contract is Discovery Output.
 * Output contract is verified engineering knowledge for Architecture Planning.
 */

export type Priority = "Critical" | "High" | "Medium" | "Low";

export type Severity = "Critical" | "High" | "Medium" | "Low";

export type DecisionConfidence =
  | "Very High"
  | "High"
  | "Medium"
  | "Low"
  | "Unknown";

export type ReadinessScore =
  | "Not Ready"
  | "Partially Ready"
  | "Mostly Ready"
  | "Engineering Ready"
  | "Architecture Ready"
  | "Implementation Ready";

export type AnalysisStatus =
  | "approved"
  | "rejected"
  | "needs_clarification";

export type RiskCategory =
  | "Business Risk"
  | "Technical Risk"
  | "Architecture Risk"
  | "Database Risk"
  | "API Risk"
  | "Security Risk"
  | "Infrastructure Risk"
  | "Performance Risk"
  | "Scalability Risk"
  | "Integration Risk"
  | "Documentation Risk"
  | "Operational Risk"
  | "Maintenance Risk"
  | "Compliance Risk";

export type GapArea =
  | "Requirements"
  | "Business Rules"
  | "User Roles"
  | "Workflows"
  | "Modules"
  | "Database"
  | "APIs"
  | "Integrations"
  | "Testing"
  | "Documentation"
  | "Technical Constraints"
  | "Business Objectives";

export type ConflictType =
  | "Business Rule"
  | "Requirement"
  | "Permission"
  | "Workflow"
  | "Database"
  | "API"
  | "Architecture"
  | "Integration"
  | "Security"
  | "Project Scope";

export interface UserPersona {
  id: string;
  name: string;
  role: string;
  responsibilities?: string[];
  permissions?: string[];
}

export interface Requirement {
  id: string;
  title: string;
  description: string;
  type: "functional" | "non-functional" | "business" | "technical";
  category?: string;
  userRoles?: string[];
  businessObjective?: string;
  businessValue?: string;
  acceptanceCriteria?: string[];
  dependencies?: string[];
  relatedBusinessRules?: string[];
  priority?: Priority;
  inputs?: string[];
  outputs?: string[];
  nfrCategory?:
    | "Performance"
    | "Scalability"
    | "Availability"
    | "Reliability"
    | "Security"
    | "Accessibility"
    | "Localization"
    | "Maintainability"
    | "Compliance"
    | "Backup & Recovery";
}

export interface BusinessRule {
  id: string;
  name: string;
  description: string;
  category?: string;
  relatedRequirements?: string[];
  conditions?: string[];
  outcomes?: string[];
  exceptions?: string[];
}

export interface ProjectScope {
  included: string[];
  excluded?: string[];
  constraints?: string[];
  assumptions?: string[];
}

export interface ProjectClassification {
  level: "Tiny" | "Small" | "Medium" | "Large" | "Enterprise";
  engineeringComplexityScore?: number;
  justification?: string;
  confidence?: DecisionConfidence;
}

export interface EngineeringProfile {
  modules?: string[];
  integrations?: string[];
  securityRequirements?: string[];
  scalabilityNotes?: string[];
}

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  actors?: string[];
  steps?: string[];
  relatedRequirements?: string[];
}

export interface Integration {
  id: string;
  name: string;
  purpose?: string;
  provider?: string;
  relatedRequirements?: string[];
}

export interface ModuleHint {
  id: string;
  name: string;
  responsibility?: string;
  relatedRequirements?: string[];
}

export interface TaskPlanItem {
  id: string;
  title: string;
  description?: string;
  relatedRequirements?: string[];
}

export interface DiscoveredRisk {
  id: string;
  category: RiskCategory;
  description: string;
  probability?: Priority;
  impact?: Priority;
  affectedComponents?: string[];
  mitigation?: string;
}

/**
 * Structured Discovery Output — official Analysis Engine input.
 */
export interface DiscoveryOutput {
  businessSummary: string;
  vision: string;
  scope: ProjectScope;
  personas: UserPersona[];
  requirements: Requirement[];
  businessRules: BusinessRule[];
  classification: ProjectClassification;
  engineeringProfile?: EngineeringProfile;
  architectureContext?: string;
  taskPlanning?: TaskPlanItem[];
  risks?: DiscoveredRisk[];
  workflows?: Workflow[];
  integrations?: Integration[];
  modules?: ModuleHint[];
  technicalConstraints?: string[];
  successCriteria?: string[];
  stakeholders?: string[];
}

export interface RequirementQualityFlags {
  specific: boolean;
  measurable: boolean;
  complete: boolean;
  consistent: boolean;
  unambiguous: boolean;
  traceable: boolean;
  testable: boolean;
  implementable: boolean;
  maintainable: boolean;
}

export interface RequirementAnalysisItem {
  requirementId: string;
  approved: boolean;
  quality: RequirementQualityFlags;
  completenessIssues: string[];
  feasibilityIssues: string[];
  suggestedPriority: Priority;
  engineeringComplexity: "XS" | "S" | "M" | "L" | "XL";
}

export interface RequirementAnalysisResult {
  total: number;
  approved: number;
  rejected: number;
  items: RequirementAnalysisItem[];
  functionalCount: number;
  nonFunctionalCount: number;
  passed: boolean;
}

export interface EngineeringConflict {
  id: string;
  type: ConflictType;
  description: string;
  artifactIds: string[];
  impact: Severity;
  recommendation: string;
  resolved: boolean;
}

export interface ConsistencyAnalysisResult {
  conflicts: EngineeringConflict[];
  crossDocumentIssues: string[];
  passed: boolean;
}

export interface DependencyLink {
  fromId: string;
  toId: string;
  kind:
    | "requirement"
    | "business-rule"
    | "module"
    | "workflow"
    | "integration"
    | "blocking";
}

export interface DependencyAnalysisResult {
  links: DependencyLink[];
  circularDependencies: string[][];
  blockingRequirements: string[];
  passed: boolean;
}

export interface AnalyzedRisk {
  id: string;
  category: RiskCategory;
  description: string;
  probability: Priority;
  impact: Priority;
  severity: Severity;
  affectedComponents: string[];
  mitigationStrategy: string;
  status: "Open" | "Mitigated" | "Accepted" | "Needs Clarification";
  recommendation: string;
}

export interface RiskAnalysisResult {
  risks: AnalyzedRisk[];
  criticalCount: number;
  passed: boolean;
}

export interface EngineeringGap {
  id: string;
  area: GapArea;
  description: string;
  severity: Severity;
  businessImpact: string;
  engineeringImpact: string;
  recommendedAction: string;
  requiredInformation: string;
  status: "Open" | "Resolved";
}

export interface GapAnalysisResult {
  gaps: EngineeringGap[];
  criticalCount: number;
  passed: boolean;
}

export interface ValidationCheck {
  name: string;
  passed: boolean;
  reason?: string;
}

export interface ValidationResult {
  business: ValidationCheck[];
  requirements: ValidationCheck[];
  businessRules: ValidationCheck[];
  dependencies: ValidationCheck[];
  risks: ValidationCheck[];
  documentation: ValidationCheck[];
  passed: boolean;
  failures: ValidationCheck[];
}

export interface ReadinessAssessment {
  businessReady: boolean;
  requirementsReady: boolean;
  architectureReady: boolean;
  databaseReady: boolean;
  apiReady: boolean;
  testingReady: boolean;
  documentationReady: boolean;
  implementationReady: boolean;
  releaseReady: boolean;
  score: ReadinessScore;
}

export interface EngineeringRecommendation {
  id: string;
  problem: string;
  analysis: string;
  recommendedSolution: string;
  benefits: string[];
  risks: string[];
  alternatives: string[];
  priority: Priority;
  impact: Severity;
}

export interface ArchitectureReadinessReport {
  businessAnalysisComplete: boolean;
  requirementsComplete: boolean;
  businessRulesComplete: boolean;
  dependenciesIdentified: boolean;
  risksEvaluated: boolean;
  classificationCompleted: boolean;
  documentationReady: boolean;
  engineeringConfidenceHigh: boolean;
  ready: boolean;
  blockers: string[];
}

export interface EngineeringSummaryReport {
  projectOverview: string;
  businessObjectives: string;
  engineeringComplexity: string;
  majorRequirements: string[];
  majorBusinessRules: string[];
  projectRisks: string[];
  projectClassification: string;
  engineeringReadiness: ReadinessScore;
  recommendedNextPhase:
    | "Architecture Planning"
    | "Return to Discovery"
    | "Clarification Required";
}

export interface AnalysisReports {
  businessAnalysis: string;
  requirementAnalysis: string;
  consistency: string;
  dependency: string;
  riskAssessment: string;
  gapAnalysis: string;
  architectureReadiness: ArchitectureReadinessReport;
  engineeringSummary: EngineeringSummaryReport;
  impact?: string;
}

export interface QualityGateResult {
  name: string;
  passed: boolean;
}


export interface EngineeringFeature {
  id: string;
  name: string;
  description: string;
  requirementIds: string[];
  moduleId?: string;
  priority: Priority;
}

export interface DatabaseCandidate {
  entity: string;
  description: string;
  source: string;
  relatedModules: string[];
  relatedRequirements: string[];
}

export interface ApiCandidate {
  resource: string;
  operations: Array<"GET" | "POST" | "PUT" | "PATCH" | "DELETE">;
  description: string;
  relatedRequirements: string[];
  relatedModules: string[];
}

/**
 * Verified Engineering Model produced by the Analysis Engine.
 * This is the structured handoff artifact for Architecture Planning.
 */
export interface EngineeringModel {
  projectClassification: ProjectClassification;
  businessGoals: string[];
  userRoles: Array<{
    id: string;
    name: string;
    role: string;
    responsibilities: string[];
    permissions: string[];
  }>;
  modules: Array<{
    id: string;
    name: string;
    responsibility: string;
    relatedRequirements: string[];
    featureIds: string[];
  }>;
  features: EngineeringFeature[];
  businessRules: BusinessRule[];
  databaseCandidates: DatabaseCandidate[];
  apiCandidates: ApiCandidate[];
  externalIntegrations: Array<{
    id: string;
    name: string;
    purpose: string;
    provider: string;
    relatedRequirements: string[];
  }>;
  securityRequirements: string[];
  nonFunctionalRequirements: Array<{
    id: string;
    title: string;
    description: string;
    category: string;
    priority: Priority;
  }>;
  complexityLevel: ProjectClassification["level"];
}

/**
 * Complete Analysis Engine result — handoff to Architecture Engine when approved.
 */
export interface AnalysisResult {
  status: AnalysisStatus;
  readinessScore: ReadinessScore;
  confidence: DecisionConfidence;
  requirementAnalysis: RequirementAnalysisResult;
  consistencyAnalysis: ConsistencyAnalysisResult;
  dependencyAnalysis: DependencyAnalysisResult;
  riskAnalysis: RiskAnalysisResult;
  gapAnalysis: GapAnalysisResult;
  validation: ValidationResult;
  readiness: ReadinessAssessment;
  qualityGates: QualityGateResult[];
  recommendations: EngineeringRecommendation[];
  reports: AnalysisReports;
  engineeringModel: EngineeringModel;
  approvedForArchitecture: boolean;
  analyzedAt: string;
}
