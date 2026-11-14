import { useMemo, useState } from "react";
import { FiltersBar } from "../components/resources/FiltersBar";
import { ResourcesTable } from "../components/resources/ResourcesTable";
import { SearchBar } from "../components/resources/SearchBar";
import { resources } from "../data/resources";
import { useResourceFilters } from "../hooks/useResourceFilters";
import { filterResources } from "../lib/filters";

export default function ResourcesPage() {
  const { filters, isFiltered, setFilter, setQuery, clearAll } =
    useResourceFilters();
  const [searchValue, setSearchValue] = useState(filters.q);

  const visibleResources = useMemo(
    () => filterResources(resources, filters),
    [filters],
  );

  function resetSearchAndFilters() {
    setSearchValue("");
    clearAll();
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-ink">Resources</h2>
        <p className="mt-0.5 text-ink-muted">
          Showing {visibleResources.length} of {resources.length} resources
        </p>
      </div>

      <div className="space-y-4 rounded-xl border border-line bg-surface p-4">
        <SearchBar
          value={searchValue}
          onValueChange={setSearchValue}
          onSearch={setQuery}
        />
        <FiltersBar filters={filters} onFilterChange={setFilter} />
      </div>

      {visibleResources.length > 0 ? (
        <ResourcesTable resources={visibleResources} />
      ) : (
        <div className="rounded-xl border border-dashed border-line bg-surface p-10 text-center">
          <p className="font-medium text-ink">
            No resources match these filters
          </p>
          <p className="mt-1 text-ink-muted">
            Try a different search term or widen the filters.
          </p>
          <button
            type="button"
            onClick={resetSearchAndFilters}
            disabled={!isFiltered}
            className="mt-4 rounded-md border border-line px-3 py-1.5 text-sm font-medium text-ink-soft hover:bg-canvas disabled:opacity-40"
          >
            Clear search &amp; filters
          </button>
        </div>
      )}
    </section>
  );
}
