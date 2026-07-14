import type { DocumentGeneratorOutput } from "@/engines/documentation";

/**
 * Engineering Model slices used by the DATABASE.md generator.
 * Contains only facts extracted or deterministically derived from the Engineering Model.
 */
export interface DatabaseDocumentSource {
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
  }>;
  entities: Array<{
    id: string;
    name: string;
    entityType: string;
    description: string;
    status: string;
    relatedModuleIds: string[];
  }>;
  relationships: Array<{
    id: string;
    name: string;
    description: string;
    status: string;
    relatedModuleIds: string[];
    relatedEntityIds: string[];
  }>;
  indexes: Array<{
    id: string;
    name: string;
    entityId: string;
    purpose: string;
    source: string;
  }>;
  constraints: Array<{
    id: string;
    name: string;
    entityId: string;
    constraintType: string;
    description: string;
    source: string;
  }>;
  modelSchemaVersion: string;
  modelCreatedAt: string;
  analysisConfidence: string;
  warnings: string[];
}

export interface DatabaseDocumentValidationResult {
  passed: boolean;
  issues: string[];
}

export interface GenerateDatabaseDocumentResult {
  output: DocumentGeneratorOutput;
  validation: DatabaseDocumentValidationResult;
  modelFingerprint: string;
}
