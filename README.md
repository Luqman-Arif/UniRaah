# UniRaah — University Admission Decision-Support Platform

**UniRaah** is a modern, production-grade university admission decision-support frontend application tailored specifically for Higher Secondary Certificate (HSC / Intermediate) students in Karachi, Pakistan (spanning BIEK, Federal Board FBISE, AKU-EB, and Cambridge A-Levels).

---

## 1. Project Scope & Architecture

The application delivers tailored experiences for two user roles:

### 🎓 Student Experience
- **Academic Profile Management:** Capture student board records (SSC Matriculation %, HSC Part-1 %, predicted overall %, and subject scores).
- **Preference Calibration:** Select target disciplines, maximum annual budget in PKR, university sector (Public, Private, Semi-Gov), and shift preferences.
- **Intelligent Recommendations Engine:** Matches student credentials against actual Karachi university eligibility requirements (e.g., PEC, NCEAC, and PM&DC rules), calculates estimated admission aggregates, and ranks degree programmes into **Safety**, **Target**, and **Reach (Competitive)** tiers.
- **Predicted Cutoffs & Trends:** Multi-year closing aggregate analytics (2021–2024) paired with projected 2025 thresholds and reference line comparisons against the student's score.
- **AI Admission Advisor:** Simulated interactive advisory chat handling Karachi intermediate policies (e.g., Pre-Medical transition into BS Computer Science, NED UET aggregate calculation, and affordable public tuition options).

### 🛡️ Administrator Experience
- **University Management:** Directory of Karachi institutions (NED UET, FAST-NUCES, KU UBIT, IBA Karachi, DUHS, SSUET, Dawood UET, Habib University) with contact helplines, official portals, and admission statuses.
- **Programme Catalog:** Academic offerings, minimum HSC percentage requirements, allowed intermediate groups, annual tuition fees, and test formulas.
- **Admission Data & Cutoff Calibration:** Multi-year historical cutoffs and projected cutoff boundaries.
- **Official Document Repository:** Syndicate notifications, verified prospectuses, tuition fee schedules, and merit list gazettes.

---

## 2. Technology Stack

- **Framework:** React 18 with TypeScript in strict mode
- **Build Tool:** Vite 5
- **Styling & Design System:** Tailwind CSS v3 with custom CSS tokens, Inter typography, and restrained shadows
- **Routing:** React Router v6 with centralized route definitions and responsive layouts
- **State & Server Cache:** TanStack Query v5 with simulated asynchronous latency
- **Forms & Validation:** React Hook Form + Zod schema validation
- **Data Visualization:** Recharts for historical cutoff trajectory analytics
- **Icons:** Lucide React

---

## 3. Directory Structure

```text
src/
├── app/
│   ├── providers/               # TanStack Query, Role, and Student Profile Providers
│   └── router/                  # Centralized React Router configuration and path constants
├── components/
│   ├── ui/                      # Accessible UI library (Button, Input, Select, Badge, Card, Dialog, Table, Tabs, Alert, EmptyState, Skeleton)
│   ├── shared/                  # Shared layouts (Header, Sidebar, PageHeader, StatCard, RoleSwitcher, MatchBadge)
│   └── layout/                  # Main responsive application layout
├── features/
│   ├── student/                 # Academic profile form and student score summaries
│   ├── recommendations/         # Recommendation cards, filter bar, and category tabs
│   ├── programmes/              # Programme detail modal and criteria views
│   ├── predictions/             # Cutoff trajectory chart and comparative tables
│   ├── advisor/                 # Simulated AI admission chat interface
│   └── admin/                   # Institutional directory, programme catalog, cutoff calibration, and document repository
├── hooks/                       # Custom query and mutation hooks (useUniversities, useProgrammes, useCutoffs, etc.)
├── services/
│   ├── api/                     # Standardized client wrapper with simulated network latency
│   └── mock/                    # In-memory services for universities, programmes, cutoffs, documents, and recommendation engine
├── types/                       # Domain models for Student, University, Programme, Cutoff, Document, and Advisor
├── schemas/                     # Zod validation schemas for forms and filters
├── data/
│   └── mock/                    # Real-world Karachi intermediate data and institutional records
└── styles/                      # Design tokens (tokens.css) and Tailwind styles (index.css)
```

---

## 4. Getting Started

### Prerequisites
- Node.js `^18.16.0` or higher
- npm `^9.0.0` or higher

### Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### Environment Configuration
Copy the provided `.env.example` file:
```bash
cp .env.example .env.local
```

### Development Server
Run the local Vite development server:
```bash
npm run dev
```
Navigate to `http://localhost:5173` in your browser.

### Type-Checking & Production Build
To validate TypeScript types and build the production bundle:
```bash
npm run build
```

### Linting
To check code formatting and ESLint rules:
```bash
npm run lint
```

---

## 5. Design System Tokens

The visual direction embodies a clean, modern, restrained education technology SaaS:
- **Surfaces:** Pure white (`#ffffff`) surfaces and soft slate page background (`#f8fafc`).
- **Typography:** Deep navy palette (`#0f172a`, `#1e293b`) with Inter font hierarchy.
- **Primary Actions:** Indigo tokens (`#4f46e5`, `#4338ca`).
- **Semantic Feedback:** Emerald for Safety/Probable, Amber for Target, Rose for Reach/Competitive.
- **Radii:** Balanced medium corner radii (`rounded-lg`, `rounded-xl`).
- **Restrained Shadows:** Subtle elevation (`shadow-subtle`, `shadow-elevated`) avoiding excessive glow or heavy blur.

---

## 6. Current Implementation & Next Steps

### ✅ Completed Foundation (Phase 1)
1. Full TypeScript domain models and Zod validation schemas for Karachi HSC students.
2. Complete reusable UI component library (`button`, `input`, `select`, `badge`, `card`, `dialog`, `table`, `tabs`, `alert`, `skeleton`, `empty-state`).
3. Reactive Student Profile Provider with persistent session state.
4. Recommendation Engine calculating Karachi test formulas (e.g. 50% test + 50% HSC) and Safety/Target/Reach probability tiers.
5. Recharts-powered Cutoff Analytics with reference lines comparing student scores against 2021–2025 cutoff trends.
6. Contextual AI Admission Advisor with simulated Karachi policy replies and quick prompt pills.
7. Administrator management views for Universities, Programmes, Cutoff Calibrations, and Official Documents.
8. Interactive Role Switcher allowing seamless switching between Student and Administrator perspectives.
9. Passed strict TypeScript check (`tsc -b`) and ESLint audit (`eslint .`) with 0 errors.

### 📋 Outstanding Work for Future Phases
- Connecting live REST/GraphQL backend endpoints (replacing `src/services/mock/*`).
- Integration with real authentication providers (e.g., student and institution SSO).
- Live AI LLM streaming endpoint integration for the Admission Advisor.
- PDF file viewer integration for official merit gazettes.
