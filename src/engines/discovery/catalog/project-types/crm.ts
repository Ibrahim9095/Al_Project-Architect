import type { ProjectTypeDefinition } from "../types";

export const crmProjectType: ProjectTypeDefinition = {
  id: "crm",
  label: "CRM",
  description: "Customer relationships, leads, pipelines, and sales operations.",
  roleOptions: [
    { value: "sales_rep", label: "Sales Representative" },
    { value: "sales_manager", label: "Sales Manager" },
    { value: "marketing", label: "Marketing User" },
    { value: "support_agent", label: "Support Agent" },
    { value: "crm_admin", label: "CRM Administrator" },
  ],
  moduleOptions: [
    { value: "leads", label: "Lead Management" },
    { value: "contacts", label: "Contacts" },
    { value: "accounts", label: "Accounts" },
    { value: "opportunities", label: "Opportunities" },
    { value: "pipeline", label: "Sales Pipeline" },
    { value: "activities", label: "Activities & Tasks" },
    { value: "reports", label: "CRM Reports" },
  ],
  featureOptions: [
    { value: "lead_scoring", label: "Lead Scoring" },
    { value: "email_sequences", label: "Email Sequences" },
    { value: "deal_stages", label: "Custom Deal Stages" },
    { value: "activity_reminders", label: "Activity Reminders" },
    { value: "contact_import", label: "Contact Import" },
    { value: "dashboard", label: "Sales Dashboard" },
  ],
  integrationOptions: [
    { value: "email", label: "Email Provider" },
    { value: "calendar", label: "Calendar Sync" },
    { value: "linkedin", label: "LinkedIn" },
    { value: "slack", label: "Slack" },
    { value: "marketing_automation", label: "Marketing Automation" },
  ],
  steps: [
    {
      id: "crm-capabilities",
      title: "CRM Capabilities",
      description: "Select CRM modules and sales workflow features.",
      questions: [
        {
          id: "modules",
          label: "Required modules",
          type: "multiselect",
          required: true,
          mapsTo: "modules",
          options: [],
        },
        {
          id: "features",
          label: "Required features",
          type: "multiselect",
          required: true,
          mapsTo: "features",
          options: [],
        },
      ],
    },
    {
      id: "crm-integrations",
      title: "CRM Integrations",
      description: "Select systems the CRM should connect with.",
      questions: [
        {
          id: "integrations",
          label: "Integrations",
          type: "multiselect",
          required: false,
          mapsTo: "integrations",
          options: [],
        },
      ],
    },
  ],
};
