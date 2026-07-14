import type { DiscoveryOption, DiscoveryStepDefinition } from "./types";

export const LANGUAGE_OPTIONS: DiscoveryOption[] = [
  { value: "en", label: "English" },
  { value: "az", label: "Azerbaijani" },
  { value: "tr", label: "Turkish" },
  { value: "ru", label: "Russian" },
  { value: "de", label: "German" },
  { value: "ar", label: "Arabic" },
];

export const CORE_SETUP_STEP: DiscoveryStepDefinition = {
  id: "project-setup",
  title: "Project Setup",
  description: "Define the project identity and select the project type.",
  questions: [
    {
      id: "projectName",
      label: "Project name",
      type: "text",
      required: true,
      placeholder: "e.g. Northwind Commerce",
      mapsTo: "projectName",
    },
    {
      id: "projectType",
      label: "Project type",
      description: "This choice unlocks type-specific discovery questions.",
      type: "select",
      required: true,
      mapsTo: "projectType",
      options: [], // filled by registry at runtime
    },
    {
      id: "businessGoal",
      label: "Primary business goal",
      type: "textarea",
      required: true,
      placeholder: "What business outcome should this software deliver?",
      mapsTo: "businessGoal",
    },
  ],
};

export const LANGUAGES_STEP: DiscoveryStepDefinition = {
  id: "languages",
  title: "Languages",
  description: "Select the languages the product must support.",
  questions: [
    {
      id: "languages",
      label: "Supported languages",
      type: "multiselect",
      required: true,
      mapsTo: "languages",
      options: LANGUAGE_OPTIONS,
    },
  ],
};
