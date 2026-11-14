# Gambit — Cloud Resources & Applications

Browse an organization's cloud resources, group a selection into a named Application, and view the Applications created. Client-only: resources are a static module, Applications live in React Context and persist to `localStorage`.

Built with React 19, TypeScript, Vite and Tailwind CSS v4, with React Router for URL state.

## Getting started

```bash
npm install
npm run dev     # http://localhost:5173
```

```bash
npm run build   # tsc -b && vite build
npm run lint
```

## What I built

- **`/resources`**: a resources table with name search, provider/environment/criticality filters and multi-select. "Create Application" opens a dialog (name with a default value, optional description) and creates an application from the selection.
- **`/applications`**: a card grid of the created applications. Clicking a card opens a modal with the application's graph.
- **Graph**: plain SVG star layout. The application sits in the center and its resources are spaced evenly on a circle, with the radius and angles computed from the resource count. Hovering a resource shows its details. Above 12 resources, nodes render without labels so the graph stays readable.
- **Data**: 12 hand-written resources across all providers, environments and criticality levels, with realistic types per provider and per-system naming (e.g. `billing-api-dev` / `billing-api-prod`) so grouping into applications is natural. I added `openIssues` to the `Resource` interface, since the sample data uses it but the interface omits it.

## Decisions beyond the brief

- **URL as state.** The search term and filters live in the query string, and the selected application lives in the path (`/applications/:id`). Views are shareable, survive a refresh, and back/forward work as expected. An unknown id is removed from the URL.
- **Search with suggestions.** The input keeps its own local value. A 300 ms debounce (custom `useDebounce` hook) updates only the suggestion list. The URL updates only on Enter, the Search button, or picking a suggestion, so the table doesn't refilter and history doesn't grow on every keystroke. The suggestion list supports arrow-key navigation, Escape and ARIA combobox attributes.
- **Selection feedback.** When filters hide selected rows, the UI says so ("5 selected (2 hidden by filters)") instead of silently keeping them selected.
- **After creating an application**, filters and search are cleared, so the user returns to a clean view.

## Why these choices

- **Vite + React, not Next.js.** There's no backend, no SEO requirement and no need for server rendering. A client-only SPA is simpler to run and to read.
- **Local state + one Context, not Zustand.** Most state belongs to a single area: search and selection to the resources page, hover to the graph. Only `applications` is shared across tabs, so it lives in a single Context behind a `useApplications()` hook. A store library would add a dependency without solving a real problem here, and since components only see the hook, swapping the implementation later touches one file.
- **`Set` and `Map`.** Selection is a `Set<string>` of ids: O(1) toggle and lookup, and no duplicated objects. `resourceById` is a `Map` derived once from the static resource list, so resolving an application's `resourceIds` doesn't need repeated `find` calls. Resources are static data, so neither of these is React state.
- **URL state without a backend.** A URL is only as good as the data it points to. `/applications/:id` would break on refresh, or when shared, if applications existed only in memory. Applications are therefore persisted to `localStorage` inside the provider, so deep links survive a reload in the same browser. Links still don't work across browsers or users, which would require a server.

## In a real production app

- **Server state**: resources and applications would come from an API via TanStack Query (caching, loading/error states, mutations), with no client-side copies in local state.
- **Server-side search, filtering and pagination**: an organization can have tens of thousands of resources, and the client shouldn't hold all of them.
- **Virtualization** of the table (e.g. TanStack Virtual), rendering only the visible rows.
- **Graph at scale**: group resources by type or provider, and add pan/zoom.

## With more time

- Sorting for both lists (e.g. by criticality, open issues, name, creation date).
- Tests: unit tests for filtering, graph layout and the debounce hook, plus an integration test for the select → create → view flow.
- Editing and deleting applications.

## Where I used AI

- **Specifying the plan**: I wrote a detailed spec covering stack, routes, URL schema, state model and UX behavior, had an AI review it, and fixed the contradictions and gaps it found before any code was written.
- **Implementation**: An AI coding agent built the project from that spec in plan mode. I reviewed the plan before approving it, and reviewed the code it produced. In addition, I used a different agent to review the code, beside my review.

