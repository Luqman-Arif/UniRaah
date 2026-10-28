import { StudentAcademicProfile } from './student'
import { MatchCategory } from './admission'

export interface StudentProfileRecord extends StudentAcademicProfile {
  id: string
  studentId: string
  version: number
  updatedAt: string
  createdAt: string
}

export interface SavedProgrammeRecord {
  id: string
  studentId: string
  programmeId: string
  savedAt: string
  notes?: string
}

export interface SavedUniversityRecord {
  id: string
  studentId: string
  universityId: string
  savedAt: string
  notes?: string
}

export interface RecommendationSessionItem {
  rank: number
  programmeId: string
  programmeName: string
  universityName: string
  universityShortName: string
  matchCategory: MatchCategory
  recommendationScore: number
  studentEstimatedAggregate: number
  targetClosingCutoff: number
  aggregateDelta: number
  annualTuitionFeePKR: number
  distanceKm: number | null
  meetsMinimumEligibility: boolean
  eligibilityNotes: string[]
}

export interface RecommendationSessionRecord {
  id: string
  studentId: string
  createdAt: string
  profileSnapshot: {
    fullName: string
    hscGroup: string
    board: string
    sscPercentage: number
    hscPart1Percentage: number
    hscTotalPredictedPercentage: number
    homeLocation: string
    maxAnnualBudgetPKR: number
  }
  criteriaWeights: {
    merit: number
    affordability: number
    distance: number
  }
  resultsCount: number
  topRecommendationTitle: string
  results: RecommendationSessionItem[]
}

export interface SearchHistoryItem {
  id: string
  title: string
  subtitle?: string
  path: string
  type: 'programme' | 'university' | 'filter' | 'advisor'
  timestamp: string // ISO string or human formatted string
}

export interface AdmissionDeadlineItem {
  id: string
  universityId: string
  universityName: string
  universityShortName: string
  programmeOrEvent: string
  cycle: string
  deadlineDate: string
  status: 'upcoming' | 'closing_soon' | 'announced'
  officialSource: string
  sourceCitation: string
}

export interface ToastNotification {
  id: string
  title: string
  message: string
  type: 'success' | 'info' | 'warning' | 'error'
}

export interface StudentDashboardContextValue {
  // State indicators
  isLoading: boolean
  isSyncing: boolean

  // Saved Programmes
  savedProgrammeIds: string[]
  saveProgramme: (programmeId: string) => Promise<boolean>
  removeSavedProgramme: (programmeId: string) => Promise<boolean>
  toggleSaveProgramme: (programmeId: string) => Promise<boolean>
  isProgrammeSaved: (programmeId: string) => boolean
  clearAllSavedProgrammes: () => Promise<void>

  // Saved Universities
  savedUniversityIds: string[]
  saveUniversity: (universityId: string) => Promise<boolean>
  removeSavedUniversity: (universityId: string) => Promise<boolean>
  toggleSaveUniversity: (universityId: string) => Promise<boolean>
  isUniversitySaved: (universityId: string) => boolean
  clearAllSavedUniversities: () => Promise<void>

  // Programme Comparison (2 to 4 items)
  compareProgrammeIds: string[]
  addToCompare: (programmeId: string) => Promise<boolean>
  removeFromCompare: (programmeId: string) => Promise<void>
  toggleCompareProgramme: (programmeId: string) => Promise<boolean>
  isInCompare: (programmeId: string) => boolean
  clearCompare: () => Promise<void>

  // Activity & View History
  history: SearchHistoryItem[]
  recordHistory: (item: Omit<SearchHistoryItem, 'id' | 'timestamp'>) => Promise<void>
  clearHistory: () => Promise<void>

  // Recommendation Sessions (Requirement D)
  sessions: RecommendationSessionRecord[]
  activeSessionId: string | null
  activeSession: RecommendationSessionRecord | null
  saveRecommendationSession: (
    sessionData: Omit<RecommendationSessionRecord, 'id' | 'createdAt' | 'studentId'>
  ) => Promise<RecommendationSessionRecord | null>
  loadSession: (sessionId: string | null) => void
  refreshRecommendationSession: () => Promise<RecommendationSessionRecord | null>

  // Inline / Floating Feedback Toast
  toasts: ToastNotification[]
  showToast: (title: string, message: string, type?: ToastNotification['type']) => void
  dismissToast: (id: string) => void
}
