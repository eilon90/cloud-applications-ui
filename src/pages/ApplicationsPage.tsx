import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ApplicationCard } from "../components/applications/ApplicationCard";
import { ApplicationGraphModal } from "../components/applications/ApplicationGraphModal";
import { useApplications } from "../context/applicationsContext";
import { applicationMembers } from "../lib/applications";

export default function ApplicationsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { applications, getApplication } = useApplications();

  const selected = getApplication(id);

  useEffect(() => {
    if (id && !selected) navigate("/applications", { replace: true });
  }, [id, selected, navigate]);

  return (
    <section className="min-h-0 flex-1 space-y-4 overflow-y-auto">
      <div>
        <h2 className="text-lg font-semibold text-ink">Applications</h2>
        <p className="mt-0.5 text-ink-muted">
          {applications.length === 0
            ? "No applications yet"
            : `${applications.length} ${applications.length === 1 ? "application" : "applications"}`}
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-surface p-10 text-center">
          <p className="font-medium text-ink">Nothing grouped yet</p>
          <p className="mt-1 text-ink-muted">
            Select resources and group them into an application.
          </p>
          <Link
            to="/resources"
            className="mt-4 inline-block rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:brightness-110"
          >
            Browse resources
          </Link>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {applications.map((application) => (
            <li key={application.id} className="flex">
              <ApplicationCard application={application} />
            </li>
          ))}
        </ul>
      )}

      {selected && (
        <ApplicationGraphModal
          application={selected}
          members={applicationMembers(selected)}
          onClose={() => navigate("/applications")}
        />
      )}
    </section>
  );
}
