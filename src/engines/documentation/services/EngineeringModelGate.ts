import type { EngineeringModel } from "../../analysis/types";
import { REQUIRED_ENGINEERING_MODEL_SECTIONS } from "../constants";
import type {
  DocumentationModelValidationResult,
  DocumentationValidationIssue,
} from "../types";

function issue(
  code: string,
  section: string,
  message: string,
  severity: DocumentationValidationIssue["severity"] = "High",
): DocumentationValidationIssue {
  return { code, section, message, severity };
}

/**
 * Validate that an Engineering Model is usable as documentation source of truth.
 * Does not modify the Analysis Engine.
 */
export function validateEngineeringModelForDocumentation(
  model: EngineeringModel | null | undefined,
): DocumentationModelValidationResult {
  const issues: DocumentationValidationIssue[] = [];
  const checkedSections = [...REQUIRED_ENGINEERING_MODEL_SECTIONS];

  if (!model) {
    return {
      passed: false,
      checkedSections,
      issues: [
        issue(
          "DOC_MODEL_MISSING",
          "EngineeringModel",
          "Documentation Core requires an Engineering Model from the Analysis Engine.",
          "Critical",
        ),
      ],
    };
  }

  if (!model.projectClassification?.complexityLevel) {
    issues.push(
      issue(
        "DOC_MODEL_CLASSIFICATION",
        "Project Classification",
        "Project classification level is missing.",
        "Critical",
      ),
    );
  }

  if (!model.complexityLevel) {
    issues.push(
      issue(
        "DOC_MODEL_COMPLEXITY",
        "Complexity Level",
        "Complexity level is missing.",
        "Critical",
      ),
    );
  } else if (
    model.projectClassification?.complexityLevel &&
    model.complexityLevel !== model.projectClassification.complexityLevel
  ) {
    issues.push(
      issue(
        "DOC_MODEL_COMPLEXITY_MISMATCH",
        "Complexity Level",
        "Complexity level does not match project classification level.",
        "High",
      ),
    );
  }

  if (!model.businessGoals?.length) {
    issues.push(
      issue("DOC_MODEL_GOALS", "Business Goals", "Business goals are empty."),
    );
  }

  if (!model.userRoles?.length) {
    issues.push(
      issue("DOC_MODEL_ROLES", "User Roles", "User roles are empty.", "Critical"),
    );
  }

  if (!model.modules?.length) {
    issues.push(issue("DOC_MODEL_MODULES", "Modules", "Modules are empty."));
  }

  if (!model.features?.length) {
    issues.push(issue("DOC_MODEL_FEATURES", "Features", "Features are empty."));
  }

  if (!model.businessRules?.length) {
    issues.push(
      issue("DOC_MODEL_RULES", "Business Rules", "Business rules are empty."),
    );
  }

  if (!model.databaseCandidates?.length) {
    issues.push(
      issue(
        "DOC_MODEL_DATABASE",
        "Database Candidates",
        "Database candidates are empty.",
      ),
    );
  }

  if (!model.apiCandidates?.length) {
    issues.push(
      issue("DOC_MODEL_API", "API Candidates", "API candidates are empty."),
    );
  }

  // External integrations may be empty for simple projects — field must exist.
  if (!Array.isArray(model.externalIntegrations)) {
    issues.push(
      issue(
        "DOC_MODEL_INTEGRATIONS",
        "External Integrations",
        "External integrations collection is missing.",
      ),
    );
  }

  if (!model.securityRequirements?.length) {
    issues.push(
      issue(
        "DOC_MODEL_SECURITY",
        "Security Requirements",
        "Security requirements are empty.",
      ),
    );
  }

  if (!model.nonFunctionalRequirements?.length) {
    issues.push(
      issue(
        "DOC_MODEL_NFR",
        "Non-Functional Requirements",
        "Non-functional requirements are empty.",
      ),
    );
  }

  const criticalOrHigh = issues.filter(
    (item) => item.severity === "Critical" || item.severity === "High",
  );

  return {
    passed: criticalOrHigh.length === 0,
    issues,
    checkedSections,
  };
}
