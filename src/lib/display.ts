import type { Criticality, Environment, Provider } from "../types";

export const PROVIDER_DOT: Record<Provider, string> = {
  AWS: "bg-amber-500",
  GCP: "bg-sky-500",
  Azure: "bg-violet-500",
};

export const ENVIRONMENT_TONE: Record<Environment, string> = {
  production: "border-indigo-200 bg-indigo-50 text-indigo-700",
  staging: "border-teal-200 bg-teal-50 text-teal-700",
  development: "border-slate-200 bg-slate-100 text-slate-600",
};

export const CRITICALITY_TONE: Record<Criticality, string> = {
  low: "border-slate-200 bg-slate-100 text-slate-600",
  medium: "border-amber-200 bg-amber-50 text-amber-700",
  high: "border-orange-200 bg-orange-100 text-orange-800",
  critical: "border-red-200 bg-red-50 text-red-700",
};
