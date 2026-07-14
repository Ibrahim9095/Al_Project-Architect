import type { DocumentGeneratorOutput } from "@/engines/documentation";

/**
 * Engineering Model slices used by the BUSINESS_RULES.md generator.
 * Contains only facts extracted from the Engineering Model.
 */
export interface BusinessRulesDocumentSource {
  projectId: string;
  projectName: string;
  projectType: string;
  projectTypeLabel: string;
  businessGoal: string;
  complexityLevel: string;
  businessGoals: string[];
  businessRules: Array<{
    id: string;
    description: string;
    status: string;
    relatedModuleIds: string[];
    source: string;
  }>;
  modules: Array<{
    id: string;
    name: string;
  }>;
  modelSchemaVersion: string;
  modelCreatedAt: string;
  analysisConfidence: string;
  warnings: string[];
}

export interface BusinessRulesDocumentValidationResult {
  passed: boolean;
  issues: string[];
}

export interface GenerateBusinessRulesDocumentResult {
  output: DocumentGeneratorOutput;
  validation: BusinessRulesDocumentValidationResult;
  modelFingerprint: string;
}
