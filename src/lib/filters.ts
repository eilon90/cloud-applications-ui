import { CRITICALITIES, ENVIRONMENTS, PROVIDERS } from "../types";
import type { Criticality, Environment, Provider, Resource } from "../types";

export const ALL = "all";

export type FilterValue<T extends string> = T | typeof ALL;
export type FilterKey = "provider" | "environment" | "criticality";

export interface ResourceFilters {
  q: string;
  provider: FilterValue<Provider>;
  environment: FilterValue<Environment>;
  criticality: FilterValue<Criticality>;
}

export const FILTER_OPTIONS: Record<FilterKey, readonly string[]> = {
  provider: PROVIDERS,
  environment: ENVIRONMENTS,
  criticality: CRITICALITIES,
};

export function filterResources(
  resources: Resource[],
  filters: ResourceFilters,
): Resource[] {
  const needle = filters.q.trim().toLowerCase();

  return resources.filter(
    (resource) =>
      (needle === "" || resource.name.toLowerCase().includes(needle)) &&
      (filters.provider === ALL || resource.provider === filters.provider) &&
      (filters.environment === ALL ||
        resource.environment === filters.environment) &&
      (filters.criticality === ALL ||
        resource.criticality === filters.criticality),
  );
}

export function suggestResources(
  resources: Resource[],
  term: string,
  limit = 8,
): Resource[] {
  const needle = term.trim().toLowerCase();
  if (needle === "") return [];

  return resources
    .filter((resource) => resource.name.toLowerCase().includes(needle))
    .sort((a, b) => {
      const aStarts = a.name.toLowerCase().startsWith(needle) ? 0 : 1;
      const bStarts = b.name.toLowerCase().startsWith(needle) ? 0 : 1;
      return aStarts - bStarts || a.name.localeCompare(b.name);
    })
    .slice(0, limit);
}
