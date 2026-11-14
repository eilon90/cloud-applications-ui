import type {
  Criticality,
  Environment,
  Provider,
  Resource,
} from "../types";

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

export const PROVIDER_HEX: Record<Provider, string[]> = {
  AWS: ["#f59e0b", "#b45309", "#fbbf24", "#92400e"],
  GCP: ["#0ea5e9", "#0369a1", "#38bdf8", "#075985"],
  Azure: ["#8b5cf6", "#6d28d9", "#a78bfa", "#4c1d95"],
};

export function assignNodeColors(members: Resource[]): string[] {
  const seenPerProvider = new Map<Provider, number>();

  return members.map((member) => {
    const occurrence = seenPerProvider.get(member.provider) ?? 0;
    seenPerProvider.set(member.provider, occurrence + 1);
    const palette = PROVIDER_HEX[member.provider];
    return palette[occurrence % palette.length];
  });
}
