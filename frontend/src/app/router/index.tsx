import { createBrowserRouter, Navigate } from 'react-router-dom'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { StudentLayout } from '@/components/layout/StudentLayout'
import { StudentDashboardLayout } from '@/components/layout/StudentDashboardLayout'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { HomePage } from '@/pages/HomePage'
import { DiscoverPage } from '@/pages/DiscoverPage'
import { PreferencesPage } from '@/pages/PreferencesPage'
import { RecommendationsPage } from '@/pages/student/RecommendationsPage'
import { ProgrammeDetailPage } from '@/pages/ProgrammeDetailPage'
import { ProgrammePredictionPage } from '@/pages/ProgrammePredictionPage'
import { PredictionsPage } from '@/pages/student/PredictionsPage'
import { AdvisorPage } from '@/pages/student/AdvisorPage'
import { ProfilePage } from '@/pages/student/ProfilePage'
import { StudentOverviewPage } from '@/pages/student/StudentOverviewPage'
import { SavedProgrammesPage } from '@/pages/student/SavedProgrammesPage'
import { SavedUniversitiesPage } from '@/pages/student/SavedUniversitiesPage'
import { CompareProgrammesPage } from '@/pages/student/CompareProgrammesPage'
import { SearchHistoryPage } from '@/pages/student/SearchHistoryPage'
import { AccountSettingsPage } from '@/pages/student/AccountSettingsPage'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { UniversitiesPage } from '@/pages/admin/UniversitiesPage'
import { ProgrammesPage } from '@/pages/admin/ProgrammesPage'
import { CutoffsPage } from '@/pages/admin/CutoffsPage'
import { DocumentsPage } from '@/pages/admin/DocumentsPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { DesignSystemShowcasePage } from '@/pages/DesignSystemShowcasePage'
import { PublicAdvisorPage } from '@/pages/PublicAdvisorPage'
import { ROUTES } from './routes'

export const router = createBrowserRouter([
  // 1. Public Marketing Shell (Landing Page & Standalone Tools)
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'advisor',
        element: <PublicAdvisorPage />,
      },
    ],
  },

  // 2. Guided Discovery Onboarding Wizard
  {
    element: <StudentLayout />,
    children: [
      {
        path: ROUTES.DISCOVER,
        element: <DiscoverPage />,
      },
      {
        path: ROUTES.PREFERENCES,
        element: <PreferencesPage />,
      },
      {
        path: ROUTES.RECOMMENDATIONS,
        element: <RecommendationsPage />,
      },
      {
        path: ROUTES.DESIGN_SYSTEM,
        element: <DesignSystemShowcasePage />,
      },
    ],
  },

  // 3. Authenticated Student Dashboard Shell (/student/*)
  {
    path: ROUTES.STUDENT.ROOT,
    element: <StudentDashboardLayout />,
    children: [
      {
        index: true,
        element: <StudentOverviewPage />,
      },
      {
        path: 'overview',
        element: <StudentOverviewPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'recommendations',
        element: <RecommendationsPage />,
      },
      {
        path: 'saved-programmes',
        element: <SavedProgrammesPage />,
      },
      {
        path: 'saved-universities',
        element: <SavedUniversitiesPage />,
      },
      {
        path: 'compare',
        element: <CompareProgrammesPage />,
      },
      {
        path: 'predictions',
        element: <PredictionsPage />,
      },
      {
        path: 'programmes/:id/prediction',
        element: <ProgrammePredictionPage />,
      },
      {
        path: 'advisor',
        element: <AdvisorPage />,
      },
      {
        path: 'history',
        element: <SearchHistoryPage />,
      },
      {
        path: 'settings',
        element: <AccountSettingsPage />,
      },
      {
        path: 'programmes/:id',
        element: <ProgrammeDetailPage />,
      },
    ],
  },

  // Top-Level Route Aliases & Direct Fallbacks
  {
    path: '/profile',
    element: <Navigate to={ROUTES.STUDENT.PROFILE} replace />,
  },
  {
    path: '/programmes/:id',
    element: <StudentDashboardLayout />,
    children: [
      {
        index: true,
        element: <ProgrammeDetailPage />,
      },
      {
        path: 'prediction',
        element: <ProgrammePredictionPage />,
      },
    ],
  },

  // 4. Authentication Shell (Screen 8: Login)
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
    ],
  },

  // 5. Administrator Application Shell
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboardPage />,
      },
      {
        path: ROUTES.ADMIN.UNIVERSITIES,
        element: <UniversitiesPage />,
      },
      {
        path: ROUTES.ADMIN.PROGRAMMES,
        element: <ProgrammesPage />,
      },
      {
        path: ROUTES.ADMIN.CUTOFFS,
        element: <CutoffsPage />,
      },
      {
        path: ROUTES.ADMIN.DOCUMENTS,
        element: <DocumentsPage />,
      },
    ],
  },

  // Fallback Catch-all
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
])
