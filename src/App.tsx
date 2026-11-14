import { resources } from "./data/resources";

function App() {
  return (
    <div className="mx-auto max-w-5xl p-8">
      <h1 className="text-xl font-semibold text-ink">Gambit</h1>
      <p className="mt-1 text-ink-muted">
        {resources.length} resources loaded. UI lands in the next step.
      </p>
    </div>
  );
}

export default App;
