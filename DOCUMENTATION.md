# FindMyCrib UI — Project Documentation

## 1. Overview

FindMyCrib is a single-page real-estate decision-support interface. It helps a user discover properties, inspect details, assess price and risk, compare shortlisted properties, estimate loan affordability, and request a property visit.

The project currently ships as a **frontend-only React application**. The `backend/` directory contains no application source or server configuration; it only contains installed packages. The data and analysis workflows therefore run in local mock mode by default, while service modules include scaffolding for n8n webhook integration.

## 2. Delivered capabilities

| Area | Implementation |
| --- | --- |
| Landing | Animated hero with a particle background and a route to property exploration. |
| Search | Location, budget, and property-type inputs; debounced location suggestions; result persistence during the browser session. |
| Listings | Ten seeded Bangalore-area properties, responsive cards, representative images, card tilt interaction, and detail modal. |
| Price intelligence | Price status, estimated price range, risk indicator, risk insight, and AI-style summary for a selected property. |
| Comparison | Shortlist up to three properties, rank two or more shortlisted properties, identify a best option, and show comparison insights. |
| Finance | EMI and affordability evaluation based on income, down payment, tenure, and interest rate. |
| Booking | Client-side validation, selectable visit date/time, mock confirmation, success animation, confirmation countdown, and email reminder. |
| Visual UX | CSS animations, tsparticles hero effect, and React Three Fiber/Three.js scenes for price-risk and comparison views. |

## 3. Technology stack

| Layer | Technology | Purpose |
| --- | --- | --- |
| UI runtime | React 19, React DOM 19 | Component-based SPA and DOM rendering. |
| Build tooling | Vite 8, `@vitejs/plugin-react` | Development server, HMR, and production bundling. |
| 3D effects | Three.js, `@react-three/fiber`, `@react-three/drei` | Animated risk and comparison scenes. |
| Particles | `@tsparticles/react`, `tsparticles` | Hero background particle animation. |
| Charts | Recharts | Installed dependency; it is not currently imported by application source. |
| Styling | Plain CSS | Component/page styles plus global theme variables. |
| Code quality | ESLint 10 with React Hooks/React Refresh plugins | Static linting. |
| Integration target | n8n webhooks | Optional POST endpoints for the five decision workflows. |

The project uses JavaScript/JSX rather than TypeScript and has no router library; screen changes are controlled with React state in `MainLayout`.

## 4. Repository layout

```text
findmycrib-ui/
├── frontend/                    # Vite/React application
│   ├── public/                  # Logo, favicon, and public property images
│   ├── src/
│   │   ├── assets/              # Local font and property-image assets
│   │   ├── components/          # Reusable UI, overlays, and 3D scene components
│   │   ├── config/              # Feature flags (currently unused by services)
│   │   ├── data/                # Mock properties and location suggestions
│   │   ├── layouts/             # Application navigation/state shell
│   │   ├── pages/               # Hero, Explore, Price Check, Compare, Finance, Schedule
│   │   ├── services/            # Agent 1–6 mock/API integration modules
│   │   ├── styles/              # Theme and global styles
│   │   └── utils/               # Formatting, image, cache, location, debounce helpers
│   ├── .env                     # Vite variables (do not store secrets here)
│   └── package.json
├── backend/                     # No backend source is currently present
├── README.md                    # Original Vite template readme
└── DOCUMENTATION.md             # This document
```

## 5. Application architecture

`src/main.jsx` loads the theme, global CSS, and `App` under React `StrictMode`. `App` renders `MainLayout`, which owns the shared state:

- `activeSection`: current screen (`hero`, `explore`, `price`, `compare`, `finance`, or `booking`).
- `selectedProperty`: the property passed from the detail modal into price, finance, and booking workflows.
- `compareList`: selected comparison candidates; Explore persists it in `sessionStorage`.

`MainLayout` uses a 150 ms fade transition when it changes screens. Explore is lazy-loaded, and `Schedule/BookingDetails` is lazy-loaded after a successful booking. There are no URL routes, deep links, server-side rendering, or authentication flows.

## 6. User workflows

### Explore properties

1. The user provides a location, a budget such as `90L`/`1.2Cr`, and optionally an apartment, villa, or plot type.
2. Location suggestions are generated from `src/data/locationData.js` after a 300 ms debounce; the dropdown is rendered with a React portal.
3. `fetchProperties` normalizes the filters and returns all mock properties in the current implementation. In API mode it posts the normalized filters to Agent 1.
4. Results, selected filters, and the search-complete state are restored from `sessionStorage` on refresh within the same browser session.
5. A card can open a modal with features and rationale, or be added/removed from the comparison shortlist.

### Price check

Opening **Analyze Property** records the selected property and opens Price Check. Agent 2 returns price status, estimated range, risk data, and summary. The page reveals the results in stages and adapts its 3D risk visual to the property risk (`low`, `medium`, or `high`).

### Compare

The app permits at most three selections and exposes the comparison action when at least two are selected. Agent 3’s mock scorer ranks candidates using area and price, marks the best property, and provides price/value/risk summaries. A comparison scene runs in the background. If fewer than two properties are available, the page shows the selected cards but has no populated comparison result.

### Finance

For a selected property, the user supplies monthly income, down payment, loan tenure, and interest rate. The page calculates the loan principal as price less down payment, then Agent 4 calculates EMI using the standard reducing-balance EMI formula. The local affordability thresholds are:

| EMI / income | Outcome |
| --- | --- |
| Up to 30% | `yes` / Good |
| Over 30% to 50% | `risky` / Moderate |
| Over 50% | `no` / Poor |

### Book a visit

Booking requires a selected property, a name of at least three characters, a valid email, a 10-digit numeric phone number, a date within the next 15 days, and a slot from 09:00 through 17:30. Agent 5 returns a booking response. On success, the UI shows its animated booking confirmation and a 15-second detail card before prompting the user to check email.

## 7. Data model

The mock catalogue in `src/data/propertiesData.js` has ten records. Each property uses this shape:

```js
{
  id: 1,
  name: "Prestige Lakeside Habitat",
  location: "Whitefield",
  price: "88 L",             // display value
  numeric_price: 8800000,     // INR number
  type: "apartment",         // apartment | villa | plot
  bhk: 3,                     // null for plots
  bath: 2,                    // null for plots
  area: "1650 sqft",
  risk: "low",               // low | medium | high
  features: ["..."],
  reason: "..."
}
```

The image mapper selects bundled apartment, villa, plot, or fallback imagery from the property’s type/name/BHK. Cards label these images as representative, not authoritative listing photos.

## 8. Services and n8n contracts

All five service modules currently define `USE_MOCK = true` and an empty `WEBHOOK_URL`. As a result, no n8n endpoint is called in the committed application. To use a real backend, set `USE_MOCK` to `false`, set the matching URL, configure CORS, and return the indicated response structure.

| Service | File | POST payload | Expected response data |
| --- | --- | --- | --- |
| Agent 1: recommendations | `services/agent1.js` | `{ location, budget, property_type, bhk }` | `{ data: { properties: Property[] } }` |
| Agent 2: price analysis | `services/agent2.js` | `{ name, location, price, type }` | `{ data: { price_analysis: { price_status, estimated_price_range }, risk_check: { risk_level, flags }, summary } }` |
| Agent 3: comparison | `services/agent3.js` | `{ properties: [{ id, name, location, price, bhk, area, type }] }` | `{ data: { ranking, best_property, comparison_summary } }` |
| Agent 4: finance | `services/agent4.js` | `{ price, income, interest_rate, tenure_years }` | `{ data: { emi, affordability, investment_rating, reason } }` |
| Agent 5: booking | `services/agent5.js` | `{ user_name, user_email, phone, date, time, property_name, location }` | `{ status: "success", data: { booking_id, visit_details, created_at, confirmation_message } }` |

Agents 2, 3, and 5 deduplicate concurrent identical requests in memory and cache results; Agent 1 caches API results only. Agent 4 runs locally in mock mode without a cache. Agent 6 only maps an intent (`evaluating`, `serious_buyer`, `ready_to_visit`) to CTA text and is not imported by the current UI.

## 9. Browser storage and caching

The app uses `sessionStorage`, which lasts for the current browser tab/session and is not shared as persistent server data.

| Key/prefix | Contents |
| --- | --- |
| `explore_properties` | Last search results |
| `explore_filters` | Location, budget, and type inputs |
| `explore_has_searched` | Whether results should be rendered |
| `compare_list` | Current comparison shortlist |
| `property_cache_*` | Agent 1 result cache (API mode only) |
| `price_cache_*` | Agent 2 analysis cache |
| `compare_cache_*` | Agent 3 comparison cache |
| `booking_cache_*` | Agent 5 booking cache |

Clear site data or run `sessionStorage.clear()` in the browser console to reset a session.

## 10. Setup and commands

### Prerequisites

- Node.js compatible with Vite 8 (use a current Node LTS release).
- npm, included with Node.js.

### Install and run

```powershell
cd frontend
npm install
npm run dev
```

Vite prints the local URL after startup. Use the following scripts from `frontend/`:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server with hot reload. |
| `npm run build` | Create a production bundle in `frontend/dist`. |
| `npm run preview` | Serve the local production bundle for verification. |
| `npm run lint` | Run ESLint across the frontend source. |

## 11. Environment configuration

`frontend/.env` currently contains:

```dotenv
VITE_USE_MOCK=true
VITE_API_URL=""
```

These variables are not read by the existing service files. The effective runtime switches are the hard-coded `USE_MOCK` and `WEBHOOK_URL` constants in `agent1.js` through `agent5.js`. Before deployment, centralize those settings through `import.meta.env`, keep `.env` values limited to public client configuration, and use production n8n webhook URLs only where they are safe to expose.

## 12. Assets and styling

- Logo files are under `frontend/public/assets/logo/`; the navbar uses `logo.jpeg`.
- Public property imagery is under `frontend/public/assets/images/properties/`.
- Local mapped property images and the Clash Grotesk font are under `frontend/src/assets/`.
- Shared theme/global definitions are in `src/styles/theme.css` and `src/styles/globals.css`; each page/component also maintains a colocated CSS file.
- `public/icons.svg` and `public/favicon.svg` provide public SVG assets.

## 13. Limitations and implementation notes

- Search mock mode returns the whole catalogue after a short simulated delay; filters are packaged for API use but are not locally applied.
- The checked-in n8n URL in `.env` is not consumed by application code, and service webhook URLs are blank.
- Booking confirmation uses static mock values (including a sample customer/property/date) rather than the submitted details.
- There are no automated test files, backend endpoints, authentication, database, analytics, or deployment configuration in the repository.
- `FEATURE_FLAGS.USE_MOCK_SEARCH` exists but is not currently connected to Agent 1.
- Recharts is declared but unused, and several utility modules (`cache`, `formatTime`, `formatCurrency`, `normalizeLocation`, `priceFormatter`) are not imported by the main flows.
- The root `README.md` remains the default Vite template; this document is the project-specific reference.

## 14. Recommended production hardening

1. Replace service-local flags and URLs with validated Vite environment variables, with separate development and production configurations.
2. Implement and secure the n8n workflows/API gateway; validate all inputs server-side and configure restrictive CORS.
3. Ensure booking responses are generated from the current request, persist bookings on a backend, and deliver real notifications.
4. Add client error states, request timeouts/abort handling, tests, accessibility checks, and responsive/device QA.
5. Introduce URL routing and deep links if pages need to be directly shareable.
6. Remove unused dependencies/utilities or put them into production use.
