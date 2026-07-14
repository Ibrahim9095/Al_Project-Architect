import type { DocumentDescriptor, DocumentTypeId } from "./types.js";

/**
 * Catalog of documents the pipeline may plan.
 * Descriptors only — no generation.
 */
export const DOCUMENT_CATALOG: Record<DocumentTypeId, Omit<DocumentDescriptor, "generatorRegistered">> =
  {
    PROJECT: {
      id: "PROJECT",
      title: "Project Overview",
      responsibility: "Summarize project vision, scope, classification, and goals.",
      requiredModelSections: [
        "projectClassification",
        "businessGoals",
        "userRoles",
        "complexityLevel",
      ],
      templateName: "PROJECT.md",
      outputFileName: "PROJECT.md",
    },
    REQUIREMENTS: {
      id: "REQUIREMENTS",
      title: "Requirements",
      responsibility: "Document functional and non-functional requirements.",
      requiredModelSections: ["features", "nonFunctionalRequirements"],
      templateName: "REQUIREMENTS.md",
      outputFileName: "REQUIREMENTS.md",
    },
    BUSINESS_RULES: {
      id: "BUSINESS_RULES",
      title: "Business Rules",
      responsibility: "Document validated business rules and constraints.",
      requiredModelSections: ["businessRules"],
      templateName: "BUSINESS_RULES.md",
      outputFileName: "BUSINESS_RULES.md",
    },
    MODULES: {
      id: "MODULES",
      title: "Modules",
      responsibility: "Document software modules and responsibilities.",
      requiredModelSections: ["modules", "features"],
      templateName: "MODULES.md",
      outputFileName: "MODULES.md",
    },
    DATABASE: {
      id: "DATABASE",
      title: "Database",
      responsibility: "Document database entity candidates and relationships.",
      requiredModelSections: ["databaseCandidates", "modules"],
      templateName: "DATABASE.md",
      outputFileName: "DATABASE.md",
    },
    API: {
      id: "API",
      title: "API",
      responsibility: "Document API resource candidates and operations.",
      requiredModelSections: ["apiCandidates", "modules"],
      templateName: "API.md",
      outputFileName: "API.md",
    },
    TASKS: {
      id: "TASKS",
      title: "Tasks",
      responsibility: "Document implementation tasks derived from features and modules.",
      requiredModelSections: ["features", "modules"],
      templateName: "TASKS.md",
      outputFileName: "TASKS.md",
    },
    VISION: {
      id: "VISION",
      title: "Vision",
      responsibility: "Document long-term project vision and business goals.",
      requiredModelSections: ["businessGoals"],
      outputFileName: "01_VISION.md",
    },
    SCOPE: {
      id: "SCOPE",
      title: "Project Scope",
      responsibility: "Document project boundaries and classification.",
      requiredModelSections: ["projectClassification", "features"],
      outputFileName: "02_PROJECT_SCOPE.md",
    },
    PERSONAS: {
      id: "PERSONAS",
      title: "User Personas",
      responsibility: "Document user roles and responsibilities.",
      requiredModelSections: ["userRoles"],
      outputFileName: "03_USER_PERSONAS.md",
    },
    TESTING: {
      id: "TESTING",
      title: "Testing Strategy",
      responsibility: "Document testing approach derived from features and NFRs.",
      requiredModelSections: ["features", "nonFunctionalRequirements"],
      outputFileName: "17_TESTING.md",
    },
    ROADMAP: {
      id: "ROADMAP",
      title: "Roadmap",
      responsibility: "Document delivery phases based on complexity and modules.",
      requiredModelSections: ["complexityLevel", "modules"],
      outputFileName: "16_ROADMAP.md",
    },
    CHANGELOG: {
      id: "CHANGELOG",
      title: "Changelog",
      responsibility: "Document engineering history structure for the project.",
      requiredModelSections: ["projectClassification"],
      outputFileName: "CHANGELOG.md",
    },
  };

export const CORE_DOCUMENT_TYPES: DocumentTypeId[] = [
  "PROJECT",
  "REQUIREMENTS",
  "BUSINESS_RULES",
  "MODULES",
  "DATABASE",
  "API",
  "TASKS",
];

export const REQUIRED_ENGINEERING_MODEL_SECTIONS = [
  "Project Classification",
  "Business Goals",
  "User Roles",
  "Modules",
  "Features",
  "Business Rules",
  "Database Candidates",
  "API Candidates",
  "External Integrations",
  "Security Requirements",
  "Non-Functional Requirements",
  "Complexity Level",
] as const;
