import type { ProjectTypeDefinition } from "../types";

export const clinicProjectType: ProjectTypeDefinition = {
  id: "clinic",
  label: "Clinic",
  description: "Clinic operations, appointments, patients, and staff workflows.",
  roleOptions: [
    { value: "patient", label: "Patient" },
    { value: "doctor", label: "Doctor" },
    { value: "nurse", label: "Nurse" },
    { value: "receptionist", label: "Receptionist" },
    { value: "clinic_admin", label: "Clinic Administrator" },
  ],
  moduleOptions: [
    { value: "patients", label: "Patient Records" },
    { value: "appointments", label: "Appointments" },
    { value: "doctors", label: "Doctor Directory" },
    { value: "scheduling", label: "Scheduling" },
    { value: "billing", label: "Clinic Billing" },
    { value: "prescriptions", label: "Prescriptions" },
  ],
  featureOptions: [
    { value: "online_booking", label: "Online Appointment Booking" },
    { value: "reminders", label: "Appointment Reminders" },
    { value: "medical_history", label: "Medical History" },
    { value: "lab_results", label: "Lab Results" },
    { value: "visit_notes", label: "Visit Notes" },
    { value: "insurance_info", label: "Insurance Information" },
  ],
  integrationOptions: [
    { value: "sms", label: "SMS Provider" },
    { value: "email", label: "Email Provider" },
    { value: "calendar", label: "Calendar Sync" },
    { value: "payment_gateway", label: "Payment Gateway" },
    { value: "lab_system", label: "Lab System" },
  ],
  steps: [
    {
      id: "clinic-capabilities",
      title: "Clinic Capabilities",
      description: "Select clinical modules and patient-care features.",
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
      id: "clinic-integrations",
      title: "Clinic Integrations",
      description: "Select external systems the clinic platform should use.",
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
