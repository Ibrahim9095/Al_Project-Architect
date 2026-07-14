import { CORE_SETUP_STEP, LANGUAGES_STEP } from "./base-steps";
import {
  getProjectTypeDefinition,
  listProjectTypes,
  PROJECT_TYPE_DEFINITIONS,
} from "./project-types/registry";
import type {
  DiscoveryAnswers,
  DiscoveryJson,
  DiscoveryQuestion,
  DiscoveryStepDefinition,
  DiscoveryValidationResult,
  ProjectTypeDefinition,
} from "./types";

function hydrateQuestionOptions(
  question: DiscoveryQuestion,
  projectType: ProjectTypeDefinition,
): DiscoveryQuestion {
  if (question.id === "modules") {
    return { ...question, options: projectType.moduleOptions };
  }
  if (question.id === "features") {
    return { ...question, options: projectType.featureOptions };
  }
  if (question.id === "integrations") {
    return { ...question, options: projectType.integrationOptions };
  }
  return question;
}

function hydrateTypeSteps(
  projectType: ProjectTypeDefinition,
): DiscoveryStepDefinition[] {
  return projectType.steps.map((step) => ({
    ...step,
    questions: step.questions.map((question) =>
      hydrateQuestionOptions(question, projectType),
    ),
  }));
}

function buildRolesStep(
  projectType: ProjectTypeDefinition,
): DiscoveryStepDefinition {
  return {
    id: "roles",
    title: "User Roles",
    description: `Select the roles that will use this ${projectType.label} system.`,
    questions: [
      {
        id: "roles",
        label: "User roles",
        type: "multiselect",
        required: true,
        mapsTo: "roles",
        options: projectType.roleOptions,
      },
    ],
  };
}

function buildSetupStep(): DiscoveryStepDefinition {
  return {
    ...CORE_SETUP_STEP,
    questions: CORE_SETUP_STEP.questions.map((question) => {
      if (question.id !== "projectType") {
        return question;
      }

      return {
        ...question,
        options: listProjectTypes().map((type) => ({
          value: type.id,
          label: type.label,
        })),
      };
    }),
  };
}

/**
 * Builds the active wizard steps from current answers.
 * Project-type-specific steps appear only after a type is selected.
 */
export function buildDiscoverySteps(
  answers: DiscoveryAnswers,
): DiscoveryStepDefinition[] {
  const steps: DiscoveryStepDefinition[] = [buildSetupStep()];
  const projectTypeId =
    typeof answers.projectType === "string" ? answers.projectType : "";

  if (!projectTypeId) {
    return [...steps, LANGUAGES_STEP];
  }

  const projectType = getProjectTypeDefinition(projectTypeId);
  if (!projectType) {
    return [...steps, LANGUAGES_STEP];
  }

  steps.push(buildRolesStep(projectType));
  steps.push(...hydrateTypeSteps(projectType));
  steps.push(LANGUAGES_STEP);
  return steps;
}

export function validateDiscoveryStep(
  step: DiscoveryStepDefinition,
  answers: DiscoveryAnswers,
): DiscoveryValidationResult {
  const errors: Record<string, string> = {};

  for (const question of step.questions) {
    if (!question.required) {
      continue;
    }

    const value = answers[question.id];

    if (question.type === "multiselect") {
      if (!Array.isArray(value) || value.length === 0) {
        errors[question.id] = `${question.label} is required.`;
      }
      continue;
    }

    if (typeof value !== "string" || value.trim().length === 0) {
      errors[question.id] = `${question.label} is required.`;
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

function asStringArray(value: string | string[] | undefined): string[] {
  if (Array.isArray(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim().length > 0) {
    return [value];
  }
  return [];
}

export function buildDiscoveryJson(answers: DiscoveryAnswers): DiscoveryJson {
  return {
    projectType:
      typeof answers.projectType === "string" ? answers.projectType : "",
    roles: asStringArray(answers.roles),
    modules: asStringArray(answers.modules),
    features: asStringArray(answers.features),
    languages: asStringArray(answers.languages),
    integrations: asStringArray(answers.integrations),
  };
}

export function validateCompleteDiscovery(
  answers: DiscoveryAnswers,
): DiscoveryValidationResult {
  const steps = buildDiscoverySteps(answers);
  const errors: Record<string, string> = {};

  for (const step of steps) {
    const result = validateDiscoveryStep(step, answers);
    Object.assign(errors, result.errors);
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

export {
  getProjectTypeDefinition,
  listProjectTypes,
  PROJECT_TYPE_DEFINITIONS,
};

export type {
  DiscoveryAnswers,
  DiscoveryJson,
  DiscoveryQuestion,
  DiscoveryStepDefinition,
  DiscoveryValidationResult,
  ProjectTypeDefinition,
} from "./types";
