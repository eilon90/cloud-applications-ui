import { Link } from "react-router-dom";
import {
  applicationMembers,
  highestCriticality,
  totalOpenIssues,
  usedProviders,
} from "../../lib/applications";
import { CRITICALITY_TONE, PROVIDER_DOT } from "../../lib/display";
import type { Application } from "../../types";
import { Badge } from "../ui/Badge";

export function ApplicationCard({ application }: { application: Application }) {
  const members = applicationMembers(application);
  const criticality = highestCriticality(members);
  const openIssues = totalOpenIssues(members);

  return (
    <Link
      to={`/applications/${application.id}`}
      className="flex w-full flex-col rounded-xl border border-line bg-surface p-4 transition-colors hover:border-brand-line hover:bg-brand-soft/40"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-ink">{application.name}</h3>
        {criticality && (
          <Badge className={CRITICALITY_TONE[criticality]}>{criticality}</Badge>
        )}
      </div>

      {application.description && (
        <p className="mt-1 line-clamp-2 text-sm text-ink-soft">
          {application.description}
        </p>
      )}

      <div className="mt-4 flex items-center gap-3 text-xs text-ink-muted">
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
        <span>
          {openIssues} open {openIssues === 1 ? "issue" : "issues"}
        </span>
      </div>
    </Link>
  );
}
