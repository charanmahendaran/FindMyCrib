# 🏠 FindMyCrib

### AI-Driven Real Estate Intelligence Platform

FindMyCrib is a modern real-estate intelligence platform designed to help users **discover, evaluate, compare, and make informed decisions about residential properties** through an interactive AI-inspired workflow.

The application combines property discovery, price intelligence, comparison, financial analysis, and site-visit booking into a single streamlined experience.


---

## 🌐 Live Demo

**Web Application:**
[FindMyCrib](https://find-my-crib-tau.vercel.app)

---

## 🎥 Demo

> Add your project demonstration video here.

<!-- Example:
[![FindMyCrib Demo]\([https://img.youtube.com/vi/YOUR\_VIDEO\_ID/maxresdefault.jpg)\](https://www.youtube.com/watch?v=YOUR\_VIDEO\_ID](https://img.youtube.com/vi/YOUR_VIDEO_ID/maxresdefault.jpg\)](https://www.youtube.com/watch?v=YOUR_VIDEO_ID))
-->

---

# 📌 Overview

Finding a suitable property often requires users to manually compare multiple listings, evaluate whether a property is fairly priced, estimate financial affordability, and coordinate property visits.

**FindMyCrib brings these activities together into one guided workflow.**

The platform allows users to:

1. 🔎 Discover residential properties
2. 🏠 Explore detailed property information
3. 📊 Analyze price competitiveness
4. ⚖️ Compare shortlisted properties
5. 💰 Estimate EMI and affordability
6. 📅 Book a property site visit

The application is designed around an **AI-driven multi-agent architecture**, where individual services can later be connected to AI agents, APIs, or automation workflows.

---

# ✨ Key Features

## 🔎 Property Discovery

Explore residential properties using:

* Location
* Budget
* Property type
* Search suggestions
* Property cards
* Property details

---

## 📊 Price Intelligence

Evaluate a property's pricing through:

* Estimated price range
* Price status
* Risk indicators
* Property-specific insights
* AI-style analysis

---

## ⚖️ Property Comparison

Shortlist and compare up to **three properties simultaneously**.

Comparison can help users evaluate:

* Price
* Property characteristics
* Amenities
* Location-related information
* Investment considerations

---

## 💰 Financial Analysis

The finance module provides:

* EMI calculation
* Affordability analysis
* Financial impact estimation
* Investment-oriented insights

---

## 📅 Site Visit Booking

Users can schedule a property visit through a validated booking workflow.

The flow includes:

* User information
* Visit details
* Form validation
* Submission state
* Booking confirmation

---

## 💾 Session Persistence

The application uses browser `sessionStorage` to preserve relevant user selections during navigation.

This currently includes:

* Explore results
* Selected properties
* Comparison list

---

## 🌌 Interactive UI

FindMyCrib uses modern visual effects to create an immersive real-estate experience.

The interface includes:

* Animated backgrounds
* Interactive visual elements
* 3D components
* Particle effects
* Responsive layouts
* Dark-themed UI

---

# 🧠 AI / Multi-Agent Architecture

The project is designed around an **agent-oriented service architecture**.

The current implementation uses local mock data, while the service layer provides a foundation for connecting future AI agents or external APIs.

```text
                         ┌─────────────────┐
                         │   FindMyCrib UI │
                         └────────┬────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
              Property Data               User Actions
                    │                           │
                    ▼                           ▼
             ┌─────────────┐             ┌─────────────┐
             │   Explore   │             │   Booking   │
             └──────┬──────┘             └──────┬──────┘
                    │                           │
          ┌─────────┼─────────┐                 │
          ▼         ▼         ▼                 ▼
      Price Agent Compare   Finance          Visit Agent
          │         │         │                 │
          └─────────┴─────────┴─────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ Mock Data / API │
                    └─────────────────┘
```

### Current architecture

The frontend currently operates in **mock mode**, allowing the complete user experience to run without a backend.

The service layer is structured so that mock implementations can later be replaced or extended with:

* REST APIs
* AI agents
* n8n workflows
* Webhooks
* External real-estate data sources
* Persistent backend services

---

# 🛠️ Tech Stack

| Category       | Technology              |
| -------------- | ----------------------- |
| Frontend       | React 19                |
| Build Tool     | Vite                    |
| Language       | JavaScript / ES Modules |
| Styling        | CSS                     |
| 3D             | Three.js                |
| React 3D       | React Three Fiber       |
| 3D Helpers     | React Three Drei        |
| Visual Effects | TSParticles             |
| Charts         | Recharts                |
| State          | React State             |
| Persistence    | sessionStorage          |
| Development    | ESLint                  |
| Deployment     | Vercel                  |

---

# 🏗️ Project Structure

```text
FindMyCrib/
│
├── Resources/
│   └── Project resources and supporting material
│
├── frontend/
│   │
│   ├── public/
│   │   ├── assets/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   │
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── config/
│   │   ├── data/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── ...
│
├── DOCUMENTATION.md
├── LICENSE
├── README.md
└── .gitignore
```

### Important directories

| Directory         | Purpose                              |
| ----------------- | ------------------------------------ |
| `src/pages/`      | Main application screens             |
| `src/components/` | Reusable UI components               |
| `src/services/`   | Data/service adapters                |
| `src/data/`       | Mock property and location data      |
| `src/utils/`      | Utility and helper functions         |
| `src/styles/`     | Global styling and theme definitions |
| `public/assets/`  | Static application assets            |

---

# 🔄 Application Workflow

```text
Landing
   │
   ▼
Explore Properties
   │
   ├───────────────┐
   │               │
   ▼               ▼
Property       Shortlist
Details            │
                   ▼
              Compare
                   │
       ┌───────────┼───────────┐
       ▼           ▼           ▼
  Price Check   Finance   Book Visit
       │           │           │
       └───────────┴───────────┘
                   │
                   ▼
             User Decision
```

---

# 🚀 Getting Started

## Prerequisites

Make sure the following are installed:

* **Node.js 20+**
* **npm**
* **Git**

Check your versions:

```bash
node --version
npm --version
git --version
```

---

## 1. Clone the Repository

```bash
git clone https://github.com/charanmahendaran/FindMyCrib.git
```

Move into the project:

```bash
cd FindMyCrib
```

---

## 2. Open the Frontend

The Vite application is located inside the `frontend` directory.

```bash
cd frontend
```

---

## 3. Install Dependencies

```bash
npm install
```

---

## 4. Start the Development Server

```bash
npm run dev
```

Vite will provide a local development URL, normally:

```text
http://localhost:5173
```

Open the URL in your browser.

---

# 📦 Production Build

Create an optimized production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

The generated production files are placed in:

```text
frontend/dist/
```

---

# ☁️ Deployment

The application can be deployed using **Vercel**.

Because the Vite application is located inside `frontend/`, configure the Vercel project with:

```text
Root Directory: frontend
```

Recommended configuration:

```text
Framework Preset: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

---

# 📸 Screenshots

Add screenshots of the major application sections here.

### Landing / Hero

<!-- Add screenshot -->

### Property Explorer

<!-- Add screenshot -->

### Property Details

<!-- Add screenshot -->

### Price Intelligence

<!-- Add screenshot -->

### Property Comparison

<!-- Add screenshot -->

### Financial Analysis

<!-- Add screenshot -->

### Site Visit Booking

<!-- Add screenshot -->

---

# 📚 Documentation

Detailed implementation information is available in:

**[`DOCUMENTATION.md`](./DOCUMENTATION.md)**

This document contains deeper technical information about the project's implementation and architecture.

---

# 👨‍💻 Author

### Charan Mahendaran

Electronics & Communication Engineering graduate interested in:

* Software Development
* Full-Stack Development
* Artificial Intelligence
* Embedded Systems
* VLSI & Digital Design

### Links

* **GitHub:** [github.com/charanmahendaran](https://github.com/charanmahendaran)
* **LinkedIn:** [linkedin.com/in/charanmahendaran](https://www.linkedin.com/in/charanmahendaran)
* **Portfolio:** [Portfolio](https://portfolio-d6803.web.app)

---

# 📄 License

This project is proprietary.

See [`LICENSE`](./LICENSE) for the applicable terms.

---

<p align="center">
  Built with ❤️ by <strong>Charan Mahendaran</strong>
</p>
