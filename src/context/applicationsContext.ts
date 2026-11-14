import { createContext, useContext } from "react";
import type { Application } from "../types";

export interface NewApplicationInput {
  name: string;
  description?: string;
  resourceIds: string[];
}

export interface ApplicationsContextValue {
  applications: Application[];
  createApplication: (input: NewApplicationInput) => string;
  getApplication: (id: string | undefined) => Application | undefined;
}

export const ApplicationsContext =
  createContext<ApplicationsContextValue | null>(null);

export function useApplications(): ApplicationsContextValue {
  const value = useContext(ApplicationsContext);
  if (!value) {
    throw new Error("useApplications must be used inside an ApplicationsProvider");
  }
  return value;
}
