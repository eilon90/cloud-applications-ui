import { useEffect, useMemo, useRef, useState } from "react";
import { resources } from "../../data/resources";
import { useDebounce } from "../../hooks/useDebounce";
import { suggestResources } from "../../lib/filters";

const LISTBOX_ID = "resource-search-suggestions";
const optionId = (index: number) => `resource-search-option-${index}`;

export function SearchBar({
  value,
  onValueChange,
  onSearch,
}: {
  value: string;
  onValueChange: (value: string) => void;
  onSearch: (value: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const debouncedValue = useDebounce(value, 300);

  const suggestions = useMemo(
    () => suggestResources(resources, debouncedValue),
    [debouncedValue],
  );

  const activeIndex = suggestions.findIndex(
    (resource) => resource.id === activeId,
  );
  const showSuggestions = isOpen && suggestions.length > 0;

  useEffect(() => {
    if (activeIndex < 0) return;
    listRef.current
      ?.querySelector(`#${optionId(activeIndex)}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  function close() {
    setIsOpen(false);
    setActiveId(null);
  }

  function commit(nextValue: string) {
    onValueChange(nextValue);
    onSearch(nextValue);
    close();
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (suggestions.length === 0) return;
      event.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
        return;
      }
      const step = event.key === "ArrowDown" ? 1 : -1;
      const next = activeIndex + step;
      const wrapped =
        next < 0
          ? suggestions.length - 1
          : next >= suggestions.length
            ? 0
            : next;
      setActiveId(suggestions[wrapped].id);
      return;
    }

    if (event.key === "Escape") {
      if (showSuggestions) {
        close();
      } else if (value !== "") {
        onValueChange("");
      }
      return;
    }

    if (event.key === "Tab") close();
  }

  return (
    <form
      className="flex gap-2"
      onSubmit={(event) => {
        event.preventDefault();
        const active = activeIndex >= 0 ? suggestions[activeIndex] : undefined;
        commit(active ? active.name : value);
      }}
    >
      <div className="relative flex-1">
        <label htmlFor="resource-search" className="sr-only">
          Search resources by name
        </label>
        <input
          id="resource-search"
          type="text"
          role="combobox"
          autoComplete="off"
          aria-expanded={showSuggestions}
          aria-controls={LISTBOX_ID}
          aria-autocomplete="list"
          aria-activedescendant={
            activeIndex >= 0 ? optionId(activeIndex) : undefined
          }
          placeholder="Search resources by name"
          value={value}
          onChange={(event) => {
            onValueChange(event.target.value);
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          onBlur={close}
          className="w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink placeholder:text-ink-muted"
        />

        {showSuggestions && (
          <ul
            id={LISTBOX_ID}
            ref={listRef}
            role="listbox"
            aria-label="Resource name suggestions"
            className="absolute z-20 mt-1 max-h-64 w-full overflow-y-auto rounded-md border border-line bg-surface py-1 shadow-lg"
          >
            {suggestions.map((resource, index) => (
              <li
                key={resource.id}
                id={optionId(index)}
                role="option"
                aria-selected={index === activeIndex}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => setActiveId(resource.id)}
                onClick={() => commit(resource.name)}
                className={`flex cursor-pointer items-baseline justify-between gap-3 px-3 py-2 text-sm ${
                  index === activeIndex
                    ? "bg-brand-soft text-ink"
                    : "text-ink-soft"
                }`}
              >
                <span className="font-mono text-[13px]">{resource.name}</span>
                <span className="text-xs text-ink-muted">{resource.type}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="submit"
        className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:brightness-110"
      >
        Search
      </button>
    </form>
  );
}
