import { useEffect, useRef } from "react";
import {
  CRITICALITY_TONE,
  ENVIRONMENT_TONE,
  PROVIDER_DOT,
} from "../../lib/display";
import type { Resource } from "../../types";
import { Badge } from "../ui/Badge";

const COLUMNS = [
  "Name",
  "Type",
  "Provider",
  "Region",
  "Environment",
  "Criticality",
  "Open issues",
  "Owner",
  "Tags",
];

const HEAD_CELL =
  "sticky top-0 z-10 border-b border-line bg-line-soft px-3 py-2.5 text-left text-xs font-semibold tracking-wide text-ink-muted uppercase";
const CELL = "border-b border-line-soft px-3 py-3";

export function ResourcesTable({
  resources,
  selectedIds,
  allVisibleSelected,
  someVisibleSelected,
  onToggleResource,
  onToggleAllVisible,
}: {
  resources: Resource[];
  selectedIds: Set<string>;
  allVisibleSelected: boolean;
  someVisibleSelected: boolean;
  onToggleResource: (id: string) => void;
  onToggleAllVisible: () => void;
}) {
  const headerCheckboxRef = useRef<HTMLInputElement>(null);
  const headerCheckboxLabel = someVisibleSelected
    ? "Clear selection of shown resources"
    : "Select all shown resources";

  useEffect(() => {
    if (headerCheckboxRef.current) {
      headerCheckboxRef.current.indeterminate =
        someVisibleSelected && !allVisibleSelected;
    }
  }, [someVisibleSelected, allVisibleSelected]);

  return (
    <div className="h-full overflow-auto rounded-xl border border-line bg-surface">
      <table className="w-full min-w-[860px] border-separate border-spacing-0 text-sm">
        <caption className="sr-only">Monitored cloud resources</caption>
        <thead>
          <tr>
            <th scope="col" className={`${HEAD_CELL} w-10`}>
              <input
                ref={headerCheckboxRef}
                type="checkbox"
                checked={allVisibleSelected}
                onChange={onToggleAllVisible}
                aria-label={headerCheckboxLabel}
                title={headerCheckboxLabel}
                className="size-4 accent-brand"
              />
            </th>
            {COLUMNS.map((column) => (
              <th key={column} scope="col" className={HEAD_CELL}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {resources.map((resource) => {
            const isSelected = selectedIds.has(resource.id);

            return (
              <tr
                key={resource.id}
                onClick={() => onToggleResource(resource.id)}
                className={`cursor-pointer ${
                  isSelected ? "bg-brand-soft" : "hover:bg-canvas"
                }`}
              >
                <td
                  className={CELL}
                  onClick={(event) => event.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleResource(resource.id)}
                    aria-label={`Select ${resource.name}`}
                    className="size-4 accent-brand"
                  />
                </td>
                <td
                  className={`${CELL} font-mono text-[13px] font-medium whitespace-nowrap text-ink`}
                >
                  {resource.name}
                </td>
                <td className={`${CELL} whitespace-nowrap text-ink-soft`}>
                  {resource.type}
                </td>
                <td className={`${CELL} whitespace-nowrap`}>
                  <span className="inline-flex items-center gap-2 text-ink-soft">
                    <span
                      aria-hidden="true"
                      className={`size-2 rounded-full ${PROVIDER_DOT[resource.provider]}`}
                    />
                    {resource.provider}
                  </span>
                </td>
                <td className={`${CELL} whitespace-nowrap text-ink-muted`}>
                  {resource.region}
                </td>
                <td className={CELL}>
                  <Badge className={ENVIRONMENT_TONE[resource.environment]}>
                    {resource.environment}
                  </Badge>
                </td>
                <td className={CELL}>
                  <Badge className={CRITICALITY_TONE[resource.criticality]}>
                    {resource.criticality}
                  </Badge>
                </td>
                <td className={CELL}>
                  {resource.openIssues > 0 ? (
                    <span className="inline-flex min-w-6 justify-center rounded-md bg-red-50 px-1.5 py-0.5 text-xs font-semibold text-red-700 tabular-nums">
                      {resource.openIssues}
                    </span>
                  ) : (
                    <span className="text-ink-muted">&mdash;</span>
                  )}
                </td>
                <td className={`${CELL} whitespace-nowrap text-ink-soft`}>
                  {resource.owner}
                </td>
                <td className={CELL}>
                  <span className="flex flex-wrap gap-1">
                    {resource.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-line-soft px-1.5 py-0.5 text-xs text-ink-muted"
                      >
                        {tag}
                      </span>
                    ))}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
