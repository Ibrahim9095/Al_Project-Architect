import type { NormalizedDiscovery } from "@/engines/contracts";
import type {
  ComplexityLevel,
  NonFunctionalRequirement,
} from "../types";

export function buildNonFunctionalRequirements(
  discovery: NormalizedDiscovery,
  complexityLevel: ComplexityLevel,
): NonFunctionalRequirement[] {
  const requirements: NonFunctionalRequirement[] = [
    {
      id: "nfr-usability",
      category: "usability",
      description: `Provide a coherent ${discovery.ui.platforms.join(", ")} experience for all defined roles.`,
      priority: "must",
    },
    {
      id: "nfr-i18n",
      category: "usability",
      description: `Support project languages: ${discovery.project.languages.join(", ")}.`,
      priority: "must",
    },
    {
      id: "nfr-deploy",
      category: "deployment",
      description: `Follow deployment strategy "${discovery.deployment.strategy}" across ${discovery.deployment.environments.join(", ")}.`,
      priority: "must",
    },
    {
      id: "nfr-maintainability",
      category: "maintainability",
      description:
        "Keep module boundaries explicit so future engines can map documentation and tasks cleanly.",
      priority: "should",
    },
    {
      id: "nfr-observability",
      category: "observability",
      description: "Expose basic application logs for authentication and integration failures.",
      priority: "should",
    },
  ];

  if (complexityLevel === "tiny" || complexityLevel === "small") {
    requirements.push({
      id: "nfr-performance-basic",
      category: "performance",
      description:
        "Keep primary interactive flows responsive under expected small-team usage.",
      priority: "should",
    });
  } else {
    requirements.push({
      id: "nfr-performance",
      category: "performance",
      description:
        "Design key read paths for efficient querying as module and data volume grow.",
      priority: "must",
    });
    requirements.push({
      id: "nfr-scalability",
      category: "scalability",
      description:
        "Prefer horizontally scalable application and data access patterns where practical.",
      priority: "should",
    });
    requirements.push({
      id: "nfr-availability",
      category: "availability",
      description:
        "Define recovery expectations for production outages before implementation begins.",
      priority: "should",
    });
  }

  return requirements;
}
