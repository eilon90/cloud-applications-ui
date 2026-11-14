export function ResourcesToolbar({
  selectedCount,
  hiddenCount,
  visibleCount,
  allVisibleSelected,
  onSelectAllVisible,
  onClearSelection,
  onCreateApplication,
}: {
  selectedCount: number;
  hiddenCount: number;
  visibleCount: number;
  allVisibleSelected: boolean;
  onSelectAllVisible: () => void;
  onClearSelection: () => void;
  onCreateApplication: () => void;
}) {
  const summary =
    selectedCount === 0
      ? "No resources selected"
      : `${selectedCount} selected${
          hiddenCount > 0 ? ` (${hiddenCount} hidden by filters)` : ""
        }`;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={onSelectAllVisible}
        disabled={visibleCount === 0 || allVisibleSelected}
        className="rounded-md border border-line bg-surface px-3 py-2 text-sm font-medium text-ink-soft hover:bg-canvas disabled:opacity-40"
      >
        Select all
      </button>

      <button
        type="button"
        onClick={onClearSelection}
        disabled={selectedCount === 0}
        className="rounded-md border border-line bg-surface px-3 py-2 text-sm font-medium text-ink-soft hover:bg-canvas disabled:opacity-40"
      >
        Clear selection
      </button>

      <button
        type="button"
        onClick={onCreateApplication}
        disabled={selectedCount === 0}
        className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:brightness-110 disabled:opacity-40 disabled:hover:brightness-100"
      >
        Create application
      </button>

      <p aria-live="polite" className="text-sm text-ink-muted">
        {summary}
      </p>
    </div>
  );
}
