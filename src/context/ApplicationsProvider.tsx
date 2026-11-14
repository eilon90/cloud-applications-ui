import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Application } from "../types";
import { ApplicationsContext } from "./applicationsContext";
import type {
  ApplicationsContextValue,
  NewApplicationInput,
} from "./applicationsContext";

const STORAGE_KEY = "gambit.applications";

function createId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `app-${crypto.randomUUID()}`;
  }
  return `app-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function parseApplications(raw: string | null): Application[] {
  if (!raw) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return [];
  }
  if (!Array.isArray(parsed)) return [];

  return parsed.flatMap((entry): Application[] => {
    if (typeof entry !== "object" || entry === null) return [];
    const { id, name, description, resourceIds } = entry as Record<string, unknown>;
    if (typeof id !== "string" || typeof name !== "string") return [];
    if (!Array.isArray(resourceIds)) return [];

    const ids = resourceIds.filter(
      (value): value is string => typeof value === "string",
    );
    const members = [...new Set(ids)];
    if (members.length === 0) return [];

    const application: Application = { id, name, resourceIds: members };
    if (typeof description === "string" && description.length > 0) {
      application.description = description;
    }
    return [application];
  });
}

function readApplications(): Application[] {
  try {
    return parseApplications(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return [];
  }
}

export function ApplicationsProvider({ children }: { children: ReactNode }) {
  const [applications, setApplications] = useState<Application[]>(readApplications);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    } catch {
      // Storage unavailable (private mode, quota): state still works in memory.
    }
  }, [applications]);

  useEffect(() => {
    function handleStorage(event: StorageEvent) {
      if (event.storageArea !== window.localStorage) return;
      if (event.key !== null && event.key !== STORAGE_KEY) return;
      setApplications(parseApplications(event.newValue));
    }

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const createApplication = useCallback((input: NewApplicationInput) => {
    const id = createId();
    const application: Application = {
      id,
      name: input.name.trim(),
      resourceIds: [...input.resourceIds],
    };
    const description = input.description?.trim();
    if (description) application.description = description;

    setApplications((previous) => [...previous, application]);
    return id;
  }, []);

  const byId = useMemo(
    () => new Map(applications.map((application) => [application.id, application])),
    [applications],
  );

  const getApplication = useCallback(
    (id: string | undefined) => (id ? byId.get(id) : undefined),
    [byId],
  );

  const value = useMemo<ApplicationsContextValue>(
    () => ({ applications, createApplication, getApplication }),
    [applications, createApplication, getApplication],
  );

  return (
    <ApplicationsContext.Provider value={value}>
      {children}
    </ApplicationsContext.Provider>
  );
}
