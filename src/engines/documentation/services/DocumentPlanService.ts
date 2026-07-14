import type { EngineeringModel } from "../../analysis/types";
import {
  CORE_DOCUMENT_TYPES,
  DOCUMENT_CATALOG,
} from "../constants";
import type { DocumentRegistry } from "./DocumentRegistry";
import type { DocumentDescriptor, DocumentPlan, DocumentTypeId } from "../types";

function documentsForComplexity(
  level: EngineeringModel["complexityLevel"],
): DocumentTypeId[] {
  const core = [...CORE_DOCUMENT_TYPES];

  if (level === "tiny") {
    return ["PROJECT", "REQUIREMENTS", "MODULES", "TASKS"];
  }

  if (level === "small") {
    return [...core, "PERSONAS", "TESTING"];
  }

  // Medium / Large / Enterprise — broader planned set (still no generation).
  return [
    ...core,
    "VISION",
    "SCOPE",
    "PERSONAS",
    "TESTING",
    "ROADMAP",
    "CHANGELOG",
  ];
}

/**
 * Build a documentation plan from the Engineering Model.
 * Plans descriptors only — does not generate documents.
 */
export function buildDocumentPlan(
  model: EngineeringModel,
  registry: DocumentRegistry,
): DocumentPlan {
  const selectedForComplexity = documentsForComplexity(model.complexityLevel);

  const documents: DocumentDescriptor[] = selectedForComplexity.map((id) => {
    const base = DOCUMENT_CATALOG[id];
    return {
      ...base,
      generatorRegistered: registry.has(id),
    };
  });

  return {
    documents,
    selectedForComplexity,
    deferredGeneratorIds: selectedForComplexity.filter((id) => !registry.has(id)),
  };
}
