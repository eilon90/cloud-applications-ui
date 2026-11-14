import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CreateApplicationDialog } from "../components/resources/CreateApplicationDialog";
import { FiltersBar } from "../components/resources/FiltersBar";
import { ResourcesTable } from "../components/resources/ResourcesTable";
import { ResourcesToolbar } from "../components/resources/ResourcesToolbar";
import { SearchBar } from "../components/resources/SearchBar";
import { useApplications } from "../context/applicationsContext";
import { resources } from "../data/resources";
import { useResourceFilters } from "../hooks/useResourceFilters";
import { filterResources } from "../lib/filters";

export default function ResourcesPage() {
  const { applications, createApplication } = useApplications();
  const { filters, isFiltered, setFilter, setQuery, clearAll } =
    useResourceFilters();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [created, setCreated] = useState<{ id: string; name: string } | null>(
    null,
  );

  const visibleResources = useMemo(
    () => filterResources(resources, filters),
    [filters],
  );

  const hiddenCount = useMemo(() => {
    const visibleIds = new Set(visibleResources.map((resource) => resource.id));
    return [...selectedIds].filter((id) => !visibleIds.has(id)).length;
  }, [selectedIds, visibleResources]);

  const selectedResources = useMemo(
    () => resources.filter((resource) => selectedIds.has(resource.id)),
    [selectedIds],
  );

  const allVisibleSelected =
    visibleResources.length > 0 &&
    visibleResources.every((resource) => selectedIds.has(resource.id));
  const someVisibleSelected = visibleResources.some((resource) =>
    selectedIds.has(resource.id),
  );

  function toggleResource(id: string) {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function setVisibleSelected(selected: boolean) {
    setSelectedIds((previous) => {
      const next = new Set(previous);
      for (const resource of visibleResources) {
        if (selected) {
          next.add(resource.id);
        } else {
          next.delete(resource.id);
        }
      }
      return next;
    });
  }

  function toggleHeaderCheckbox() {
    setVisibleSelected(!someVisibleSelected);
  }

  function handleCreate(name: string, description: string) {
    const id = createApplication({
      name,
      description,
      resourceIds: selectedResources.map((resource) => resource.id),
    });
    setSelectedIds(new Set());
    setIsDialogOpen(false);
    setCreated({ id, name });
    clearAll();
  }

  return (
    <section className="flex min-h-0 flex-1 flex-col gap-4">
      <div>
        <h2 className="text-lg font-semibold text-ink">Resources</h2>
        <p className="mt-0.5 text-ink-muted">
          Showing {visibleResources.length} of {resources.length} resources
        </p>
      </div>

      {created && (
        <div
          role="status"
          className="flex items-center justify-between gap-3 rounded-lg border border-brand-line bg-brand-soft px-4 py-3 text-sm text-ink"
        >
          <span>
            Created <span className="font-medium">{created.name}</span>.{" "}
            <Link
              to={`/applications/${created.id}`}
              className="font-medium text-brand underline"
            >
              View its graph
            </Link>
          </span>
          <button
            type="button"
            onClick={() => setCreated(null)}
            className="rounded px-2 py-1 text-ink-muted hover:text-ink"
            aria-label="Dismiss"
          >
            &times;
          </button>
        </div>
      )}

      <div className="space-y-4 rounded-xl border border-line bg-surface p-4">
        <SearchBar query={filters.q} onSearch={setQuery} />
        <FiltersBar filters={filters} onFilterChange={setFilter} />
      </div>

      <ResourcesToolbar
        selectedCount={selectedIds.size}
        hiddenCount={hiddenCount}
        visibleCount={visibleResources.length}
        allVisibleSelected={allVisibleSelected}
        onSelectAllVisible={() => setVisibleSelected(true)}
        onClearSelection={() => setSelectedIds(new Set())}
        onCreateApplication={() => setIsDialogOpen(true)}
      />

      {visibleResources.length > 0 ? (
        <div className="min-h-0 flex-1">
          <ResourcesTable
            resources={visibleResources}
            selectedIds={selectedIds}
            allVisibleSelected={allVisibleSelected}
            someVisibleSelected={someVisibleSelected}
            onToggleResource={toggleResource}
            onToggleAllVisible={toggleHeaderCheckbox}
          />
        </div>
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
            onClick={clearAll}
            disabled={!isFiltered}
            className="mt-4 rounded-md border border-line px-3 py-1.5 text-sm font-medium text-ink-soft hover:bg-canvas disabled:opacity-40"
          >
            Clear search &amp; filters
          </button>
        </div>
      )}

      {isDialogOpen && (
        <CreateApplicationDialog
          defaultName={`Application ${applications.length + 1}`}
          members={selectedResources}
          onCancel={() => setIsDialogOpen(false)}
          onCreate={handleCreate}
        />
      )}
    </section>
  );
}
