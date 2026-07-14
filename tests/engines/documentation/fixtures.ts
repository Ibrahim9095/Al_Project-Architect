import { buildEngineeringModel } from "@/engines/analysis";
import type { EngineeringModel } from "@/engines/analysis";
import type { NormalizedDiscovery } from "@/engines/contracts";
import { DISCOVERY_SCHEMA_VERSION } from "@/engines/contracts";

/**
 * Complete Normalized Discovery fixture for Documentation Core tests.
 * Uses the merged main Analysis Engine contract only.
 */
export function createCompleteNormalizedDiscovery(): NormalizedDiscovery {
  const now = "2026-07-14T10:00:00.000Z";

  return {
    schemaVersion: DISCOVERY_SCHEMA_VERSION,
    project: {
      id: "proj-clinic-001",
      name: "Clinic Booking Platform",
      type: "clinic",
      typeLabel: "Clinic",
      businessGoal:
        "Let patients schedule appointments and staff manage availability reliably.",
      languages: ["en", "tr"],
    },
    roles: [
      { id: "role-patient", name: "Patient" },
      { id: "role-staff", name: "Staff" },
      { id: "role-admin", name: "Administrator" },
    ],
    modules: [
      { id: "auth", name: "Authentication" },
      { id: "appointments", name: "Appointments" },
      { id: "schedule", name: "Schedule" },
      { id: "notifications", name: "Notifications" },
    ],
    features: [
      { id: "feat-login", name: "Patient login" },
      { id: "feat-book", name: "Book appointment" },
      { id: "feat-cancel", name: "Cancel appointment" },
      { id: "feat-manage-slots", name: "Manage availability slots" },
    ],
    businessRules: [
      {
        id: "br-001",
        description: "Patients must authenticate before booking.",
        status: "confirmed",
      },
      {
        id: "br-002",
        description: "Double booking of the same slot is prohibited.",
        status: "confirmed",
      },
    ],
    database: {
      entities: [
        { id: "appointments-entity", name: "Appointment", status: "planned" },
        { id: "schedule-entity", name: "AvailabilitySlot", status: "planned" },
      ],
      notes: [],
    },
    api: {
      resources: [
        { id: "appointments-api", name: "Appointments", status: "planned" },
        { id: "schedule-api", name: "Schedule", status: "planned" },
      ],
      notes: [],
    },
    integrations: [
      { id: "email", name: "Email", status: "selected" },
      { id: "sms", name: "SMS", status: "optional" },
    ],
    ui: {
      platforms: ["web"],
      languages: ["en", "tr"],
      notes: [],
    },
    deployment: {
      environments: ["development", "staging", "production"],
      strategy: "container",
      notes: [],
    },
    metadata: {
      createdAt: now,
      updatedAt: now,
      source: "discovery-wizard",
      schemaVersion: DISCOVERY_SCHEMA_VERSION,
      projectTypeId: "clinic",
      sessionHints: {
        hasRoles: true,
        hasModules: true,
        hasFeatures: true,
        hasLanguages: true,
        hasIntegrations: true,
      },
    },
  };
}

export function createCompleteEngineeringModel(): EngineeringModel {
  return buildEngineeringModel(createCompleteNormalizedDiscovery(), {
    createdAt: "2026-07-14T10:00:00.000Z",
  });
}
