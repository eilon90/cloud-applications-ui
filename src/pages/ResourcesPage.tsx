import { ResourcesTable } from "../components/resources/ResourcesTable";
import { resources } from "../data/resources";

export default function ResourcesPage() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-ink">Resources</h2>
        <p className="mt-0.5 text-ink-muted">
          {resources.length} monitored resources
        </p>
      </div>

      <ResourcesTable resources={resources} />
    </section>
  );
}
