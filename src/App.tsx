import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import ApplicationsPage from "./pages/ApplicationsPage";
import ResourcesPage from "./pages/ResourcesPage";

const TABS = [
  { to: "/resources", label: "Resources" },
  { to: "/applications", label: "Applications" },
];

function App() {
  return (
    <div className="min-h-svh">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto max-w-6xl px-6 pt-6">
          <h1 className="text-base font-semibold tracking-tight text-ink">
            Gambit
          </h1>
          <p className="text-xs text-ink-muted">
            Cloud resource inventory &amp; applications
          </p>
        </div>

        <nav aria-label="Main" className="mx-auto max-w-6xl px-6">
          <ul className="-mb-px flex gap-1 pt-5">
            {TABS.map((tab) => (
              <li key={tab.to}>
                <NavLink
                  to={tab.to}
                  className={({ isActive }) =>
                    [
                      "inline-block border-b-2 px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "border-brand text-brand"
                        : "border-transparent text-ink-soft hover:border-line hover:text-ink",
                    ].join(" ")
                  }
                >
                  {tab.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        <Routes>
          <Route path="/" element={<Navigate to="/resources" replace />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/applications/:id" element={<ApplicationsPage />} />
          <Route path="*" element={<Navigate to="/resources" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
