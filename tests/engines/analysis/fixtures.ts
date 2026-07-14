import type { DiscoveryOutput } from "../../../src/engines/analysis/types.js";

export function createCompleteDiscovery(): DiscoveryOutput {
  return {
    businessSummary:
      "A clinic booking platform that lets patients schedule appointments and staff manage availability.",
    vision:
      "Provide reliable appointment scheduling with clear roles, rules, and auditability.",
    scope: {
      included: [
        "Patient registration",
        "Appointment booking",
        "Staff scheduling",
        "Notifications",
      ],
      excluded: ["Insurance claims", "Telemedicine video"],
      constraints: ["Must support GDPR"],
      assumptions: ["Clinic operates in a single timezone"],
    },
    personas: [
      {
        id: "P-001",
        name: "Patient",
        role: "Patient",
        responsibilities: ["Book appointments", "Cancel appointments"],
        permissions: ["create:appointment", "read:own-appointment"],
      },
      {
        id: "P-002",
        name: "Clinic Staff",
        role: "Staff",
        responsibilities: ["Manage schedule", "Confirm appointments"],
        permissions: ["manage:schedule", "confirm:appointment"],
      },
      {
        id: "P-003",
        name: "Administrator",
        role: "Admin",
        responsibilities: ["Manage users", "Configure clinic settings"],
        permissions: ["manage:users", "manage:settings"],
      },
    ],
    requirements: [
      {
        id: "REQ-001",
        title: "Patient authentication",
        description:
          "Patients must authenticate before booking or managing appointments.",
        type: "functional",
        userRoles: ["Patient"],
        businessObjective: "Protect patient data and booking integrity.",
        businessValue: "Prevents unauthorized access to medical appointments.",
        acceptanceCriteria: [
          "Unauthenticated users cannot create appointments",
          "Authenticated patients can access only their own appointments",
        ],
        dependencies: [],
        relatedBusinessRules: ["BR-001"],
        priority: "Critical",
        inputs: ["email", "password"],
        outputs: ["session token"],
      },
      {
        id: "REQ-002",
        title: "Book appointment",
        description:
          "Authenticated patients can book an available appointment slot with a clinician.",
        type: "functional",
        userRoles: ["Patient"],
        businessObjective: "Enable patients to schedule care.",
        businessValue: "Reduces phone scheduling overhead.",
        acceptanceCriteria: [
          "Patient can select an available slot",
          "Double booking is prevented",
          "Confirmation is returned to the patient",
        ],
        dependencies: ["REQ-001"],
        relatedBusinessRules: ["BR-002", "BR-003"],
        priority: "Critical",
        inputs: ["clinicianId", "slotId"],
        outputs: ["appointmentId", "status"],
      },
      {
        id: "REQ-003",
        title: "Staff schedule management",
        description: "Staff can define available appointment slots.",
        type: "functional",
        userRoles: ["Staff"],
        businessObjective: "Control clinic capacity.",
        businessValue: "Ensures accurate availability.",
        acceptanceCriteria: [
          "Staff can create availability windows",
          "Unavailable slots cannot be booked",
        ],
        dependencies: ["REQ-001"],
        relatedBusinessRules: ["BR-002"],
        priority: "High",
      },
      {
        id: "REQ-004",
        title: "Authentication security",
        description:
          "The system must enforce secure authentication and role-based authorization.",
        type: "non-functional",
        nfrCategory: "Security",
        userRoles: ["Patient", "Staff", "Admin"],
        businessObjective: "Protect clinic and patient data.",
        businessValue: "Meets security and compliance expectations.",
        acceptanceCriteria: [
          "Passwords are stored using a strong one-way hash",
          "Role checks are enforced on every protected action",
        ],
        dependencies: ["REQ-001"],
        relatedBusinessRules: ["BR-001"],
        priority: "Critical",
      },
      {
        id: "REQ-005",
        title: "Booking performance",
        description:
          "Appointment search and booking confirmation must respond within 2 seconds under normal load.",
        type: "non-functional",
        nfrCategory: "Performance",
        userRoles: ["Patient", "Staff"],
        businessObjective: "Keep booking usable during clinic hours.",
        businessValue: "Reduces abandoned booking attempts.",
        acceptanceCriteria: [
          "P95 booking confirmation latency <= 2 seconds for 100 concurrent users",
        ],
        dependencies: ["REQ-002"],
        relatedBusinessRules: ["BR-002"],
        priority: "High",
      },
    ],
    businessRules: [
      {
        id: "BR-001",
        name: "Authenticated access only",
        description: "Only authenticated users may access protected booking features.",
        relatedRequirements: ["REQ-001", "REQ-004"],
        conditions: ["User session is valid"],
        outcomes: ["Access granted to authorized actions"],
      },
      {
        id: "BR-002",
        name: "No double booking",
        description: "An appointment slot may be assigned to only one patient.",
        relatedRequirements: ["REQ-002", "REQ-003", "REQ-005"],
        conditions: ["Slot is available"],
        outcomes: ["Slot becomes unavailable after booking"],
      },
      {
        id: "BR-003",
        name: "Cancellation window",
        description: "Patients may cancel appointments up to 2 hours before start time.",
        relatedRequirements: ["REQ-002"],
        conditions: ["Current time <= appointment start - 2 hours"],
        outcomes: ["Appointment cancelled and slot released"],
      },
    ],
    classification: {
      level: "Small",
      engineeringComplexityScore: 32,
      justification: "Multiple roles, relational data, moderate business rules.",
      confidence: "High",
    },
    engineeringProfile: {
      modules: ["Authentication", "Appointments", "Scheduling", "Notifications"],
      integrations: ["Email"],
      securityRequirements: ["Role-based access control"],
    },
    architectureContext: "Modular web application with authenticated booking flows.",
    taskPlanning: [
      {
        id: "TASK-001",
        title: "Implement authentication module",
        relatedRequirements: ["REQ-001", "REQ-004"],
      },
    ],
    risks: [
      {
        id: "RISK-001",
        category: "Security Risk",
        description: "Weak authentication would expose patient appointment data.",
        probability: "Low",
        impact: "High",
        affectedComponents: ["Authentication"],
        mitigation: "Enforce hashed credentials and role checks from day one.",
      },
    ],
    workflows: [
      {
        id: "WF-001",
        name: "Book appointment",
        actors: ["Patient"],
        steps: ["Login", "Select clinician", "Select slot", "Confirm"],
        relatedRequirements: ["REQ-001", "REQ-002"],
      },
    ],
    integrations: [
      {
        id: "INT-001",
        name: "Email notifications",
        purpose: "Send booking confirmations",
        provider: "SMTP",
        relatedRequirements: ["REQ-002"],
      },
    ],
    modules: [
      {
        id: "MOD-001",
        name: "Authentication",
        responsibility: "Identity and access control",
        relatedRequirements: ["REQ-001", "REQ-004"],
      },
      {
        id: "MOD-002",
        name: "Appointments",
        responsibility: "Booking lifecycle",
        relatedRequirements: ["REQ-002"],
      },
    ],
    technicalConstraints: ["Web application", "Relational database", "GDPR"],
    successCriteria: [
      "Patients can book appointments online",
      "Double booking never occurs",
      "Staff can manage availability",
    ],
    stakeholders: ["Clinic Owner", "Patients", "Clinic Staff"],
  };
}

export function createIncompleteDiscovery(): DiscoveryOutput {
  return {
    businessSummary: "",
    vision: "",
    scope: { included: [] },
    personas: [],
    requirements: [],
    businessRules: [],
    classification: {
      level: "Tiny",
    },
  };
}
