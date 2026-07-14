import type { NormalizedDiscovery } from "@/engines/contracts";
import type { SecurityRequirement } from "../types";

export function buildSecurityRequirements(
  discovery: NormalizedDiscovery,
): SecurityRequirement[] {
  const requirements: SecurityRequirement[] = [
    {
      id: "sec-auth",
      category: "authentication",
      description: "All privileged routes require authenticated access.",
      priority: "must",
      rationale: "Discovery defines multiple roles that require identity assurance.",
    },
    {
      id: "sec-rbac",
      category: "authorization",
      description: `Enforce role-based authorization across ${discovery.roles.length} roles.`,
      priority: "must",
      rationale: "Role list from Discovery implies differentiated permissions.",
    },
    {
      id: "sec-transport",
      category: "data-protection",
      description: "All client-server traffic must use TLS in non-local environments.",
      priority: "must",
      rationale: "Protect credentials and business data in transit.",
    },
    {
      id: "sec-secrets",
      category: "data-protection",
      description:
        "Secrets and API keys must be stored in environment configuration, never source code.",
      priority: "must",
      rationale: "External integrations require secure credential handling.",
    },
    {
      id: "sec-audit",
      category: "audit",
      description: "Record audit events for authentication and privileged mutations.",
      priority: "should",
      rationale: "Supports accountability and incident investigation.",
    },
  ];

  if (discovery.project.type === "clinic") {
    requirements.push({
      id: "sec-phi",
      category: "compliance",
      description:
        "Protect patient health information with least-privilege access and access logging.",
      priority: "must",
      rationale: "Clinic domain implies sensitive healthcare data.",
    });
  }

  if (discovery.project.type === "ecommerce") {
    requirements.push({
      id: "sec-payments",
      category: "compliance",
      description:
        "Avoid storing raw payment card data; rely on payment provider tokenization.",
      priority: "must",
      rationale: "E-commerce checkout commonly involves payment processing.",
    });
  }

  if (discovery.project.type === "crm") {
    requirements.push({
      id: "sec-customer-data",
      category: "data-protection",
      description:
        "Restrict customer contact and opportunity data to authorized CRM roles.",
      priority: "must",
      rationale: "CRM systems concentrate personally identifiable customer data.",
    });
  }

  if (discovery.integrations.length > 0) {
    requirements.push({
      id: "sec-integration-auth",
      category: "authentication",
      description:
        "Authenticate outbound integration calls with short-lived or rotatable credentials.",
      priority: "must",
      rationale: `${discovery.integrations.length} selected integrations expand the trust boundary.`,
    });
  }

  return requirements;
}
