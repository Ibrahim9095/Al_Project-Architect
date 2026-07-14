export const NORMALIZED_DISCOVERY_STORAGE_KEY =
  "apa.normalizedDiscovery" as const;

export const ENGINEERING_MODEL_STORAGE_KEY = "apa.engineeringModel" as const;

export function readNormalizedDiscoveryFromStorage(): unknown | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(NORMALIZED_DISCOVERY_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

export function writeNormalizedDiscoveryToStorage(data: unknown): void {
  if (typeof window === "undefined") {
    return;
  }
  window.sessionStorage.setItem(
    NORMALIZED_DISCOVERY_STORAGE_KEY,
    JSON.stringify(data),
  );
}

export function writeEngineeringModelToStorage(data: unknown): void {
  if (typeof window === "undefined") {
    return;
  }
  window.sessionStorage.setItem(
    ENGINEERING_MODEL_STORAGE_KEY,
    JSON.stringify(data),
  );
}
