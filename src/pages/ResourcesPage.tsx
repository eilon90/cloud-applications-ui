import { resources } from "../data/resources";
import { useResourceFilters } from "../hooks/useResourceFilters";

export default function ResourcesPage() {
  // Temporary readout: proves the URL round-trips into state. Replaced by the
  // search bar, filters and table in the next gates.
  const { filters, isFiltered, clearAll } = useResourceFilters();

  return (
    <section>
      <h2 className="text-lg font-semibold text-ink">Resources</h2>
      <p className="mt-1 text-ink-muted">
        {resources.length} resources in the catalog.
      </p>

      <pre className="mt-4 rounded-lg border border-line bg-surface p-4 text-xs text-ink-soft">
        {JSON.stringify(filters, null, 2)}
      </pre>

      <button
        type="button"
        onClick={clearAll}
        disabled={!isFiltered}
        className="mt-3 rounded-md border border-line px-3 py-1.5 text-sm font-medium text-ink-soft disabled:opacity-40"
      >
        Clear all params
      </button>
    </section>
  );
}
