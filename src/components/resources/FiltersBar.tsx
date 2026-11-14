import { ALL, FILTER_OPTIONS } from "../../lib/filters";
import type { FilterKey, ResourceFilters } from "../../lib/filters";

const FILTER_LABELS: Record<FilterKey, { label: string; all: string }> = {
  provider: { label: "Provider", all: "All providers" },
  environment: { label: "Environment", all: "All environments" },
  criticality: { label: "Criticality", all: "All criticalities" },
};

const FILTER_KEYS = Object.keys(FILTER_LABELS) as FilterKey[];

export function FiltersBar({
  filters,
  onFilterChange,
}: {
  filters: ResourceFilters;
  onFilterChange: (key: FilterKey, value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-3">
      {FILTER_KEYS.map((key) => (
        <div key={key} className="flex flex-col gap-1">
          <label
            htmlFor={`filter-${key}`}
            className="text-xs font-medium text-ink-muted"
          >
            {FILTER_LABELS[key].label}
          </label>
          <select
            id={`filter-${key}`}
            value={filters[key]}
            onChange={(event) => onFilterChange(key, event.target.value)}
            className="min-w-44 rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink"
          >
            <option value={ALL}>{FILTER_LABELS[key].all}</option>
            {FILTER_OPTIONS[key].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}
