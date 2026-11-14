import { useParams } from "react-router-dom";

export default function ApplicationsPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <section>
      <h2 className="text-lg font-semibold text-ink">Applications</h2>
      <p className="mt-1 text-ink-muted">
        {id
          ? `Selected application id: ${id}. The graph modal lands in a later step.`
          : "No applications yet. The card grid lands in a later step."}
      </p>
    </section>
  );
}
