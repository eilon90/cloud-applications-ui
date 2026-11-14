import { useParams } from "react-router-dom";
import { useApplications } from "../context/applicationsContext";

export default function ApplicationsPage() {
  const { id } = useParams<{ id: string }>();
  // Temporary readout: proves context + localStorage round-trip.
  const { applications, getApplication } = useApplications();
  const selected = getApplication(id);

  return (
    <section>
      <h2 className="text-lg font-semibold text-ink">Applications</h2>
      <p className="mt-1 text-ink-muted">
        {applications.length} stored in context / localStorage.
      </p>

      <pre className="mt-4 rounded-lg border border-line bg-surface p-4 text-xs text-ink-soft">
        {JSON.stringify({ selectedId: id ?? null, selected: selected ?? null, applications }, null, 2)}
      </pre>
    </section>
  );
}
