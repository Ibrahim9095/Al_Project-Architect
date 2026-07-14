import type { DocumentGenerator } from "../contracts/DocumentGenerator.js";
import { isDocumentGenerator } from "../contracts/DocumentGenerator.js";
import type { DocumentTypeId } from "../types.js";

/**
 * Registry for future document generator contracts.
 * Phase 4.1 starts empty — generators are not implemented yet.
 */
export class DocumentRegistry {
  private readonly generators = new Map<DocumentTypeId, DocumentGenerator>();

  register(generator: DocumentGenerator): void {
    if (!isDocumentGenerator(generator)) {
      throw new Error("Invalid DocumentGenerator contract.");
    }
    if (this.generators.has(generator.id)) {
      throw new Error(`Document generator already registered: ${generator.id}`);
    }
    this.generators.set(generator.id, generator);
  }

  has(id: DocumentTypeId): boolean {
    return this.generators.has(id);
  }

  get(id: DocumentTypeId): DocumentGenerator | undefined {
    return this.generators.get(id);
  }

  list(): DocumentGenerator[] {
    return Array.from(this.generators.values());
  }

  clear(): void {
    this.generators.clear();
  }

  get registeredIds(): DocumentTypeId[] {
    return Array.from(this.generators.keys());
  }
}

export function createDocumentRegistry(): DocumentRegistry {
  return new DocumentRegistry();
}
