import type { DocumentGeneratorOutput } from "@/engines/documentation";

/**
 * Engineering Model slices used by the REQUIREMENTS.md generator.
 * Contains only facts extracted from the Engineering Model.
 */
export interface RequirementsDocumentSource {
  projectId: string;
  projectName: string;
  projectType: string;
  projectTypeLabel: string;
  businessGoal: string;
  complexityLevel: string;
  businessGoals: string[];
  functionalRequirements: Array<{
    id: string;
    title: string;
    description: string;
    priority: string;
    relatedModuleIds: string[];
  }>;
  nonFunctionalRequirements: Array<{
    id: string;
    category: string;
    description: string;
    priority: string;
  }>;
  securityRequirements: Array<{
    id: string;
    category: string;
    description: string;
    priority: string;
    rationale: string;
  }>;
  userRoles: Array<{
    id: string;
    name: string;
    responsibilities: string[];
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

export interface RequirementsDocumentValidationResult {
  passed: boolean;
  issues: string[];
}

export interface GenerateRequirementsDocumentResult {
  output: DocumentGeneratorOutput;
  validation: RequirementsDocumentValidationResult;
  modelFingerprint: string;
}
