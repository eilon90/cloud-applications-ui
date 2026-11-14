import { resources } from "../data/resources";

export default function ResourcesPage() {
  return (
    <section>
      <h2 className="text-lg font-semibold text-ink">Resources</h2>
      <p className="mt-1 text-ink-muted">
        {resources.length} resources in the catalog. Search, filters and the
        table land in the next steps.
      </p>
    </section>
  );
}
