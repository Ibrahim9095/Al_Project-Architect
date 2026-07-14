import type { DocumentGeneratorOutput } from "@/engines/documentation";

/**
 * Engineering Model slices used by the MODULES.md generator.
 * Contains only facts extracted from the Engineering Model.
 */
export interface ModulesDocumentSource {
  projectId: string;
  projectName: string;
  projectType: string;
  projectTypeLabel: string;
  businessGoal: string;
  complexityLevel: string;
  businessGoals: string[];
  modules: Array<{
    id: string;
    name: string;
    purpose: string;
    priority: string;
    source: string;
    relatedFeatureIds: string[];
    relatedBusinessRuleIds: string[];
    relatedDatabaseCandidateIds: string[];
    relatedApiCandidateIds: string[];
  }>;
  features: Array<{
    id: string;
    name: string;
    relatedModuleIds: string[];
  }>;
  businessRules: Array<{
    id: string;
    description: string;
    relatedModuleIds: string[];
  }>;
  databaseCandidates: Array<{
    id: string;
    name: string;
    relatedModuleIds: string[];
  }>;
  apiCandidates: Array<{
    id: string;
    name: string;
    relatedModuleIds: string[];
  }>;
  modelSchemaVersion: string;
  modelCreatedAt: string;
  analysisConfidence: string;
  warnings: string[];
}

export interface ModulesDocumentValidationResult {
  passed: boolean;
  issues: string[];
}

export interface GenerateModulesDocumentResult {
  output: DocumentGeneratorOutput;
  validation: ModulesDocumentValidationResult;
  modelFingerprint: string;
}
