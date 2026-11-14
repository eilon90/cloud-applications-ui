import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { ALL, FILTER_OPTIONS } from "../lib/filters";
import type { FilterKey, FilterValue, ResourceFilters } from "../lib/filters";
import type { Criticality, Environment, Provider } from "../types";

function readFilter<T extends string>(
  params: URLSearchParams,
  key: FilterKey,
): FilterValue<T> {
  const raw = params.get(key);
  return raw && FILTER_OPTIONS[key].includes(raw) ? (raw as T) : ALL;
}

export function useResourceFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo<ResourceFilters>(
    () => ({
      q: searchParams.get("q")?.trim() ?? "",
      provider: readFilter<Provider>(searchParams, "provider"),
      environment: readFilter<Environment>(searchParams, "environment"),
      criticality: readFilter<Criticality>(searchParams, "criticality"),
    }),
    [searchParams],
  );

  const setParam = useCallback(
    (key: string, value: string) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          if (!value || value === ALL) {
            next.delete(key);
          } else {
            next.set(key, value);
          }
          return next;
        },
        // Replace, so a run of dropdown changes does not fill the back button.
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const setFilter = useCallback(
    (key: FilterKey, value: string) => setParam(key, value),
    [setParam],
  );

  const setQuery = useCallback(
    (value: string) => setParam("q", value.trim()),
    [setParam],
  );

  const clearAll = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  const isFiltered =
    filters.q !== "" ||
    filters.provider !== ALL ||
    filters.environment !== ALL ||
    filters.criticality !== ALL;

  return { filters, isFiltered, setFilter, setQuery, clearAll };
}
