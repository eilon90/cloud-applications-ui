import {
  missingMemberCount,
  totalOpenIssues,
  usedProviders,
} from "../../lib/applications";
import { PROVIDER_DOT } from "../../lib/display";
import type { Application, Resource } from "../../types";
import { Modal } from "../ui/Modal";
import { ApplicationGraph } from "./ApplicationGraph";

export function ApplicationGraphModal({
  application,
  members,
  onClose,
}: {
  application: Application;
  members: Resource[];
  onClose: () => void;
}) {
  const missing = missingMemberCount(application);

  return (
    <Modal
      labelledBy="application-graph-title"
      onClose={onClose}
      className="max-w-3xl"
    >
      <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
        <div>
          <h2
            id="application-graph-title"
            className="text-base font-semibold text-ink"
          >
            {application.name}
          </h2>
          {application.description && (
            <p className="mt-0.5 text-sm text-ink-soft">
              {application.description}
            </p>
          )}
          <div className="mt-2 flex items-center gap-3 text-xs text-ink-muted">
            <span>
              {members.length} {members.length === 1 ? "resource" : "resources"}
            </span>
            <span className="flex items-center gap-1">
              {usedProviders(members).map((provider) => (
                <span
                  key={provider}
                  title={provider}
                  className={`size-2 rounded-full ${PROVIDER_DOT[provider]}`}
                />
              ))}
            </span>
            <span>{totalOpenIssues(members)} open issues</span>
            {missing > 0 && (
              <span className="text-amber-600">{missing} unavailable</span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="rounded px-2 py-1 text-lg leading-none text-ink-muted hover:text-ink"
        >
          &times;
        </button>
      </div>

      <div className="p-5">
        <ApplicationGraph application={application} members={members} />
      </div>
    </Modal>
  );
}
