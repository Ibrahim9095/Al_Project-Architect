/**
 * Platform configuration aligned with documented architecture layers.
 * Source of truth: README.md Platform Architecture / docs/12_AI_BRAIN.md
 */

export const PLATFORM_NAME = "AI Project Architect" as const;

export const PLATFORM_ENGINES = [
  {
    id: "discovery",
    name: "Discovery Engine",
    description: "Adaptive project discovery and question generation.",
  },
  {
    id: "analysis",
    name: "Analysis Engine",
    description: "Requirement and business analysis.",
  },
  {
    id: "classification",
    name: "Classification Engine",
    description: "Project complexity classification and repository selection.",
  },
  {
    id: "documentation",
    name: "Documentation Engine",
    description: "Engineering documentation generation.",
  },
  {
    id: "repository",
    name: "Repository Engine",
    description: "Repository assembly from classified templates.",
  },
  {
    id: "export",
    name: "Export Engine",
    description: "Validated ZIP and implementation package export.",
  },
] as const;

export type PlatformEngineId = (typeof PLATFORM_ENGINES)[number]["id"];
