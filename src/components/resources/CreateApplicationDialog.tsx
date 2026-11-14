import { useRef, useState } from "react";
import { ENVIRONMENT_TONE, PROVIDER_DOT } from "../../lib/display";
import type { Resource } from "../../types";
import { Badge } from "../ui/Badge";
import { Modal } from "../ui/Modal";

export function CreateApplicationDialog({
  defaultName,
  members,
  onCancel,
  onCreate,
}: {
  defaultName: string;
  members: Resource[];
  onCancel: () => void;
  onCreate: (name: string, description: string) => void;
}) {
  const [name, setName] = useState(defaultName);
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (trimmedName === "") {
      setError("Give the application a name.");
      nameRef.current?.focus();
      return;
    }
    onCreate(trimmedName, description);
  }

  return (
    <Modal
      labelledBy="create-application-title"
      onClose={onCancel}
      initialFocusRef={nameRef}
    >
      <form onSubmit={handleSubmit}>
        <div className="border-b border-line px-5 py-4">
          <h2
            id="create-application-title"
            className="text-base font-semibold text-ink"
          >
            Create application
          </h2>
          <p className="mt-0.5 text-sm text-ink-muted">
            Grouping {members.length}{" "}
            {members.length === 1 ? "resource" : "resources"}
          </p>
        </div>

        <div className="space-y-4 px-5 py-4">
          <div>
            <label
              htmlFor="application-name"
              className="text-xs font-medium text-ink-muted"
            >
              Name
            </label>
            <input
              id="application-name"
              ref={nameRef}
              type="text"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError(null);
              }}
              aria-invalid={error !== null}
              aria-describedby={error ? "application-name-error" : undefined}
              className="mt-1 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink"
            />
            {error && (
              <p
                id="application-name-error"
                className="mt-1 text-xs text-red-600"
              >
                {error}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="application-description"
              className="text-xs font-medium text-ink-muted"
            >
              Description <span className="font-normal">(optional)</span>
            </label>
            <textarea
              id="application-description"
              rows={3}
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="mt-1 w-full resize-none rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink"
            />
          </div>

          <div>
            <p className="text-xs font-medium text-ink-muted">Members</p>
            <ul className="mt-1 max-h-44 space-y-1 overflow-y-auto rounded-md border border-line-soft p-2">
              {members.map((resource) => (
                <li
                  key={resource.id}
                  className="flex items-center justify-between gap-3 text-sm"
                >
                  <span className="flex items-center gap-2 text-ink">
                    <span
                      aria-hidden="true"
                      className={`size-2 shrink-0 rounded-full ${PROVIDER_DOT[resource.provider]}`}
                    />
                    <span className="font-mono text-[13px]">
                      {resource.name}
                    </span>
                  </span>
                  <Badge className={ENVIRONMENT_TONE[resource.environment]}>
                    {resource.environment}
                  </Badge>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-line px-5 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-line px-3 py-2 text-sm font-medium text-ink-soft hover:bg-canvas"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:brightness-110"
          >
            Create application
          </button>
        </div>
      </form>
    </Modal>
  );
}
