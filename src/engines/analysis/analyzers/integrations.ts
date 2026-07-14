import type { NormalizedDiscovery } from "@/engines/contracts";
import type { ExternalIntegration } from "../types";

function purposeForIntegration(id: string, name: string): string {
  const key = id.toLowerCase();
  if (key.includes("stripe") || key.includes("paypal") || key.includes("payment")) {
    return "Process payments and manage payment lifecycle events.";
  }
  if (key.includes("email")) {
    return "Deliver transactional and notification email.";
  }
  if (key.includes("sms")) {
    return "Deliver SMS notifications and verification codes.";
  }
  if (key.includes("shipping")) {
    return "Calculate shipping and track carrier fulfillment.";
  }
  if (key.includes("analytics")) {
    return "Capture product analytics and usage metrics.";
  }
  if (key.includes("calendar")) {
    return "Synchronize scheduling with external calendar systems.";
  }
  return `Integrate external capability provided by ${name}.`;
}

function riskNotesForIntegration(id: string): string[] {
  const key = id.toLowerCase();
  const notes: string[] = [
    "External dependency requires credential management and failure handling.",
  ];
  if (key.includes("stripe") || key.includes("paypal") || key.includes("payment")) {
    notes.push("Payment integrations require PCI-aware handling of sensitive data.");
  }
  if (key.includes("email") || key.includes("sms")) {
    notes.push("Delivery failures must not corrupt core business transactions.");
  }
  return notes;
}

export function buildExternalIntegrations(
  discovery: NormalizedDiscovery,
): ExternalIntegration[] {
  const selected = discovery.integrations.map((integration) => ({
    id: integration.id,
    name: integration.name,
    purpose: purposeForIntegration(integration.id, integration.name),
    status: integration.status,
    riskNotes: riskNotesForIntegration(integration.id),
  }));

  const recommended: ExternalIntegration[] = [];

  const hasEmail = discovery.integrations.some((item) =>
    item.id.toLowerCase().includes("email"),
  );
  if (!hasEmail) {
    recommended.push({
      id: "recommended-email",
      name: "Email Provider",
      purpose: "Support account and workflow notifications.",
      status: "recommended",
      riskNotes: [
        "Absence of email delivery may block onboarding and notification flows.",
      ],
    });
  }

  return [...selected, ...recommended];
}
