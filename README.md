# UniRaah — Undergraduate Admission Decision-Support Monorepo

**UniRaah** is a modern, production-grade university admission decision-support platform tailored specifically for Higher Secondary Certificate (HSC / Intermediate) students in Karachi, Pakistan (spanning BIEK, Federal Board FBISE, AKU-EB, and Cambridge A-Levels).

The repository is organized as a clean **Monorepo** with dedicated `frontend/` and `backend/` packages orchestrated from root scripts.

---

## 1. Monorepo Architecture Overview

```text
UniRaah/
├── frontend/                          # React + TypeScript + Vite Single-Page Application
│   ├── public/                        # Static assets & public icons
│   ├── src/
│   │   ├── app/                       # Application layer (Providers & Central Router)
│   │   │   ├── providers/             # Auth, Role, Student Profile & TanStack Query providers
│   │   │   └── router/                # Route definitions & React Router v6 setup
│   │   ├── assets/                    # Optimized UI images and SVG vectors
│   │   ├── components/                # Atomic and domain component hierarchy
│   │   │   ├── auth/                  # Authentication modals & OTP verification step
│   │   │   ├── layout/                # Shell layouts (Public, Student, Admin, Auth)
│   │   │   ├── marketing/             # Landing page sections (Hero, Services, FAQ, Footer)
│   │   │   ├── profile/               # Student profile modals & edit cards
│   │   │   ├── shared/                # StatCard, PageHeader, RoleSwitcher, MatchBadge
│   │   │   └── ui/                    # Reusable primitives (Button, Input, Dialog, Select, etc.)
│   │   ├── data/mock/                 # Mock catalogs for universities, programmes, cutoffs
│   │   ├── features/                  # Domain feature modules
│   │   │   ├── admin/                 # Admin management directories & repositories
│   │   │   ├── advisor/               # Admission advisor chat interface
│   │   │   ├── predictions/           # Cutoff trend charts and probability indicators
│   │   │   ├── programmes/            # Programme comparison & details modal
│   │   │   ├── recommendations/       # Recommendation cards & filter bar
│   │   │   └── student/               # Academic onboarding stepper & profile forms
│   │   ├── hooks/                     # Custom hooks (useAuth, useStudentProfile, useProgrammes)
│   │   ├── lib/                       # Utility helpers (cn, formatters)
│   │   ├── pages/                     # Routed page views (Public, Student Dashboard, Admin)
│   │   ├── schemas/                   # Zod schemas for validation
│   │   ├── services/                  # API clients, local storage adapters & mock engines
│   │   ├── styles/                    # Design tokens & global CSS styles
│   │   └── types/                     # TypeScript models for student, university, programme
│   ├── index.html                     # HTML5 entrypoint
│   ├── package.json                   # Frontend dependencies & scripts
│   ├── tailwind.config.js             # Tailwind CSS tokens & color palette
│   └── vite.config.ts                 # Vite bundler config with /api proxy to backend
│
├── backend/                           # Node.js + Express + TypeScript Backend API
│   ├── src/
│   │   ├── config/                    # Environment variables (PORT, SMTP, FRONTEND_URL)
│   │   ├── controllers/               # API controllers (otpController, programmeController)
│   │   ├── db/
│   │   │   ├── schema.sql             # PostgreSQL production schema & tables
│   │   │   └── seeds/                 # Seed data (Karachi universities & degree programmes)
│   │   ├── middleware/                # CORS, request logger & centralized error handler
│   │   ├── routes/                    # Express routers (/api/send-otp, /api/universities, /api/predict)
│   │   ├── services/                  # Business logic (emailService with direct MX fallback)
│   │   ├── types/                     # Shared backend TypeScript interfaces
│   │   └── server.ts                  # Express server entrypoint (listening on port 5001)
│   ├── package.json                   # Backend dependencies & scripts
│   └── tsconfig.json                  # TypeScript compiler settings for Node.js
│
├── test/                              # Automated test suites (node:test native runner)
│   ├── authentication-workflows.test.mjs
│   └── dashboard-persistence.test.mjs
│
├── docs/                              # Database architecture & planning documentation
│   └── DATABASE_SCHEMA.sql
│
├── package.json                       # Root workspace orchestrator (concurrent dev runners)
├── tsconfig.json                      # Root TypeScript workspace references
└── README.md                          # Project documentation
```

---

## 2. Frontend Routing Architecture

The application uses **React Router v6** with dedicated layout shells and zero redirect loops:

| Path | Layout Shell | View Description |
| :--- | :--- | :--- |
| `/` | `PublicLayout` | Public marketing landing page & university directory |
| `/advisor` | `PublicLayout` | Public AI admission advisor preview |
| `/discover` | `StudentLayout` | Step 1: Intermediate board & academic background |
| `/discover/preferences` | `StudentLayout` | Step 2: Degree discipline & budget calibration |
| `/recommendations` | `StudentLayout` | Step 3: Filtered safety, target, and reach programmes |
| `/student` | `StudentDashboardLayout` | Authenticated student portal overview |
| `/student/overview` | `StudentDashboardLayout` | Active application status & recent actions |
| `/student/profile` | `StudentDashboardLayout` | Full academic profile management & mark edits |
| `/student/recommendations` | `StudentDashboardLayout` | Persistent recommendation shortlist & filters |
| `/student/saved-programmes` | `StudentDashboardLayout` | Bookmarked degree programmes |
| `/student/saved-universities` | `StudentDashboardLayout` | Bookmarked Karachi university campuses |
| `/student/compare` | `StudentDashboardLayout` | Side-by-side comparison matrix (up to 4 programmes) |
| `/student/predictions` | `StudentDashboardLayout` | Aggregate admission probability forecasts |
| `/student/advisor` | `StudentDashboardLayout` | Personalized admission policy AI assistant |
| `/student/history` | `StudentDashboardLayout` | Search and filter activity log |
| `/student/settings` | `StudentDashboardLayout` | Security credentials & password change |
| `/student/programmes/:id` | `StudentDashboardLayout` | In-depth programme page & official syllabus |
| `/profile` | *Redirect* | Automatically redirects to `/student/profile` |
| `/login` / `/auth/login` | `AuthLayout` | Student sign in & account creation with live validation |
| `/admin` | `AdminLayout` | Institutional admin dashboard |
| `/admin/universities` | `AdminLayout` | University directory editor |
| `/admin/programmes` | `AdminLayout` | Degree requirements & seat quota management |
| `/admin/cutoffs` | `AdminLayout` | Historical merit cutoff thresholds (2021–2024) |
| `/admin/documents` | `AdminLayout` | Official prospectus & gazette repository |
| `*` | *Catch-All* | Seamless redirect back to `/` |

---

## 3. Backend API Endpoints

The backend Express server runs on port **5001** and handles core platform services:

### 📧 Email & Verification (`/api/send-otp`)
- **Direct Mail Exchange (MX) Resolution:** Dynamically resolves destination domain MX DNS records (e.g., `gmail.com`, `neduet.edu.pk`) and delivers OTP verification emails directly.
- **Authenticated SMTP Fallback:** Optionally uses credentials defined in `.env` (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`).
- **Terminal Dispatch Preview:** Outputs high-visibility styled terminal badges for instant local testing.

### 🏛️ University Directory (`/api/universities`)
- `GET /api/universities`: List all verified Karachi institutions (NED, FAST, KU, IBA, DUHS, SSUET, DUET, Habib) with filters (`sector`, `locationZone`).
- `GET /api/universities/:id`: Detailed profile, contact lines, and offered programmes.

### 📚 Degree Programmes (`/api/programmes`)
- `GET /api/programmes`: Query catalog with criteria (`discipline`, `hscGroup`, `maxFee`).
- `GET /api/programmes/:id`: Comprehensive fee breakdown, accreditation status, and eligibility rules.

### 🎯 Admission Aggregate & Cutoff Predictor (`/api/predict`)
- `POST /api/predict`: Calculates weighted merit aggregate based on Karachi board formulas and predicts probability (`Safety`, `Target`, `Reach`).

### 💓 Healthcheck (`/api/health`)
- `GET /api/health`: Real-time backend status and versioning.

---

## 4. Quickstart Guide

### One-Command Full-Stack Development
From the repository root, start both the frontend and backend servers simultaneously:

```bash
npm run dev
```

This launches:
- **Frontend:** `http://localhost:5173/` (Vite dev server with automatic `/api` proxying)
- **Backend:** `http://localhost:5001/` (Express API server with automatic hot-reloading via `tsx`)

### Running Packages Independently
```bash
# Run only frontend
npm run dev:frontend

# Run only backend
npm run dev:backend
```

### Production Build
```bash
# Build frontend production bundle
npm run build

# Build both packages
npm run build:all
```

### Automated Testing
Run the comprehensive test suite (authentication, session persistence, multi-tenant isolation, validation limits):
```bash
npm test
```

---

## 5. Technology Stack Summary

- **Frontend:** React 18, TypeScript, Vite 5, Tailwind CSS, TanStack Query, React Hook Form, Zod, Lucide React, Recharts
- **Backend:** Node.js 18+, Express, TypeScript, Nodemailer, DNS MX Resolver, CORS
- **Database:** PostgreSQL 15+ relational schema with Row-Level Security (`backend/src/db/schema.sql`)
- **Testing:** Node.js native test runner (`node:test`, `node:assert/strict`)
