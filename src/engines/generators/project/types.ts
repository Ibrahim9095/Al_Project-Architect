import type { ComplexityLevel } from "@/engines/analysis";
import type { DocumentGeneratorOutput } from "@/engines/documentation";

/**
 * Engineering Model slices used by the PROJECT.md generator.
 * Contains only facts extracted from the Engineering Model.
 */
export interface ProjectDocumentSource {
  projectId: string;
  projectName: string;
  projectType: string;
  projectTypeLabel: string;
  businessGoal: string;
  languages: string[];
  uiPlatforms: string[];
  deploymentStrategy: string;
  deploymentEnvironments: string[];
  complexityLevel: ComplexityLevel;
  classificationDomain: string;
  classificationCategory: string;
  engineeringComplexityScore: number;
  classificationRationale: string[];
  businessGoals: string[];
  userRoles: Array<{
    id: string;
    name: string;
    responsibilities: string[];
    accessScope: string;
  }>;
  modules: Array<{
    id: string;
    name: string;
    purpose: string;
    priority: string;
  }>;
  features: Array<{
    id: string;
    name: string;
    description: string;
    priority: string;
  }>;
  externalIntegrations: Array<{
    id: string;
    name: string;
    purpose: string;
    status: string;
  }>;
  technologyStack: {
    frontend: string[];
    backend: string[];
    database: string[];
    infrastructure: string[];
    aiServices: string[];
  };
  risks: Array<{
    id: string;
    title: string;
    description: string;
    severity: string;
    mitigation: string;
  }>;
  modelSchemaVersion: string;
  modelCreatedAt: string;
  analysisConfidence: string;
  warnings: string[];
}

export interface ProjectDocumentValidationResult {
  passed: boolean;
  issues: string[];
}

export interface GenerateProjectDocumentResult {
  output: DocumentGeneratorOutput;
  validation: ProjectDocumentValidationResult;
  modelFingerprint: string;
}
