import type { NormalizedDiscovery } from "@/engines/contracts";
import type { AnalyzedUserRole } from "../types";

function inferResponsibilities(
  roleId: string,
  projectType: string,
): string[] {
  const commonAdmin = [
    "Manage configuration and privileged operations.",
    "Oversee user access within assigned scope.",
  ];

  if (roleId.includes("admin")) {
    return commonAdmin;
  }

  if (projectType === "ecommerce") {
    if (roleId === "customer") {
      return [
        "Browse catalog and place orders.",
        "Manage account profile and order history.",
      ];
    }
    if (roleId === "store_manager") {
      return [
        "Manage catalog, promotions, and store operations.",
        "Review order and inventory status.",
      ];
    }
    if (roleId === "support_agent") {
      return [
        "Assist customers with order issues.",
        "View customer and order records within support scope.",
      ];
    }
    if (roleId === "warehouse_staff") {
      return [
        "Process fulfillment and inventory movements.",
        "Update shipment and stock status.",
      ];
    }
  }

  if (projectType === "clinic") {
    if (roleId.includes("doctor") || roleId.includes("physician")) {
      return [
        "Access assigned patient clinical information.",
        "Manage appointments and clinical notes within policy.",
      ];
    }
    if (roleId.includes("patient")) {
      return [
        "View personal appointments and records.",
        "Update personal contact information.",
      ];
    }
    if (roleId.includes("receptionist") || roleId.includes("staff")) {
      return [
        "Schedule and manage appointments.",
        "Maintain front-desk operational records.",
      ];
    }
  }

  if (projectType === "crm") {
    if (roleId.includes("sales")) {
      return [
        "Manage leads, opportunities, and customer interactions.",
        "Update pipeline status and activity logs.",
      ];
    }
    if (roleId.includes("manager")) {
      return [
        "Oversee team pipeline and performance.",
        "Approve process exceptions within policy.",
      ];
    }
  }

  return [
    `Perform role-specific operations for "${roleId}".`,
    "Access only authorized project resources.",
  ];
}

function inferAccessScope(roleId: string): string {
  if (roleId.includes("admin")) {
    return "organization-wide with elevated privileges";
  }
  if (roleId.includes("manager")) {
    return "team or department scoped";
  }
  if (
    roleId.includes("customer") ||
    roleId.includes("patient") ||
    roleId.includes("guest")
  ) {
    return "self-scoped";
  }
  return "role-scoped operational access";
}

export function buildUserRoles(
  discovery: NormalizedDiscovery,
): AnalyzedUserRole[] {
  return discovery.roles.map((role) => ({
    id: role.id,
    name: role.name,
    responsibilities: inferResponsibilities(role.id, discovery.project.type),
    accessScope: inferAccessScope(role.id),
    source: "discovery",
  }));
}
