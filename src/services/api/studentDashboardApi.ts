import {
  StudentAcademicProfile,
} from '@/types/student'
import {
  StudentProfileRecord,
  SavedProgrammeRecord,
  SavedUniversityRecord,
  RecommendationSessionRecord,
  SearchHistoryItem,
} from '@/types/dashboard'
import { mockProgrammes } from '@/data/mock/programmes'
import { mockUniversities } from '@/data/mock/universities'
import { initialStudentProfile } from '@/app/providers/StudentProfileProvider'
import { DEMO_PERSONAS } from '@/app/providers/AuthProvider'

// ============================================================================
// 1. DOMAIN API ERRORS
// ============================================================================

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    public readonly code: string,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message = 'Authentication required. Please sign in to perform this operation.') {
    super(401, 'UNAUTHORIZED', message)
  }
}

export class ForbiddenError extends ApiError {
  constructor(message = 'Access forbidden. You do not have permission to access or modify records of another student.') {
    super(403, 'FORBIDDEN', message)
  }
}

export class NotFoundError extends ApiError {
  constructor(message = 'The requested record or resource was not found.') {
    super(404, 'NOT_FOUND', message)
  }
}

export class ConflictError extends ApiError {
  constructor(message = 'A conflict occurred: record already exists or concurrent update conflict.') {
    super(409, 'CONFLICT', message)
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, public readonly validationErrors?: Record<string, string>) {
    super(422, 'VALIDATION_FAILED', message)
  }
}

// ============================================================================
// 2. ABSTRACT API SERVICE CONTRACT
// ============================================================================

export interface IStudentDashboardApi {
  // Student Profile
  getProfile(studentId: string, authUserId: string): Promise<StudentProfileRecord>
  updateProfile(
    studentId: string,
    authUserId: string,
    updates: Partial<StudentAcademicProfile>,
    expectedVersion?: number
  ): Promise<StudentProfileRecord>

  // Saved Programmes
  getSavedProgrammes(studentId: string, authUserId: string): Promise<SavedProgrammeRecord[]>
  saveProgramme(
    studentId: string,
    authUserId: string,
    programmeId: string,
    notes?: string
  ): Promise<SavedProgrammeRecord>
  removeSavedProgramme(studentId: string, authUserId: string, programmeId: string): Promise<void>
  clearSavedProgrammes(studentId: string, authUserId: string): Promise<void>

  // Saved Universities
  getSavedUniversities(studentId: string, authUserId: string): Promise<SavedUniversityRecord[]>
  saveUniversity(
    studentId: string,
    authUserId: string,
    universityId: string,
    notes?: string
  ): Promise<SavedUniversityRecord>
  removeSavedUniversity(studentId: string, authUserId: string, universityId: string): Promise<void>
  clearSavedUniversities(studentId: string, authUserId: string): Promise<void>

  // Recommendation Sessions (Requirement D)
  getRecommendationSessions(
    studentId: string,
    authUserId: string
  ): Promise<RecommendationSessionRecord[]>
  saveRecommendationSession(
    studentId: string,
    authUserId: string,
    sessionData: Omit<RecommendationSessionRecord, 'id' | 'createdAt' | 'studentId'>
  ): Promise<RecommendationSessionRecord>
  getRecommendationSessionById(
    studentId: string,
    authUserId: string,
    sessionId: string
  ): Promise<RecommendationSessionRecord>

  // Recent Views / Audit Activity
  getRecentViews(studentId: string, authUserId: string): Promise<SearchHistoryItem[]>
  recordRecentView(
    studentId: string,
    authUserId: string,
    view: Omit<SearchHistoryItem, 'id' | 'timestamp'>
  ): Promise<SearchHistoryItem>
  clearRecentViews(studentId: string, authUserId: string): Promise<void>

  // Programme Comparison Matrix (2 to 4 items)
  getComparison(studentId: string, authUserId: string): Promise<string[]>
  updateComparison(studentId: string, authUserId: string, programmeIds: string[]): Promise<string[]>
}

// ============================================================================
// 3. PROTOTYPE PERSISTENT ADAPTER
// ============================================================================

/**
 * Prototype implementation of IStudentDashboardApi.
 *
 * Implements strict per-student isolation, authorization checks, foreign key
 * validations, optimistic concurrency checks, and realistic async responses.
 *
 * It is completely decoupled from UI presentation components. When the backend
 * is ready, this adapter can be replaced with an HttpStudentDashboardApi that calls
 * live REST/GraphQL endpoints without modifying any front-end components.
 */
export class PrototypeDashboardAdapter implements IStudentDashboardApi {
  private readonly delayMs: number

  constructor(delayMs = 120) {
    this.delayMs = delayMs
  }

  private async sleep(): Promise<void> {
    if (this.delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, this.delayMs))
    }
  }

  /**
   * Authorization check: verifies that the authenticated user owns the student record.
   */
  private checkAuthorization(studentId: string, authUserId: string): void {
    if (!authUserId) {
      throw new UnauthorizedError('Unauthorized: Active student authentication required.')
    }
    if (authUserId !== studentId) {
      throw new ForbiddenError(
        `Forbidden: Authenticated student '${authUserId}' cannot access or modify records of student '${studentId}'.`
      )
    }
  }

  // Storage key helpers partitioned strictly by student ID
  private getProfileKey(studentId: string): string {
    return `uniraah_v2_${studentId}_profile`
  }
  private getSavedProgrammesKey(studentId: string): string {
    return `uniraah_v2_${studentId}_saved_programmes`
  }
  private getSavedUniversitiesKey(studentId: string): string {
    return `uniraah_v2_${studentId}_saved_universities`
  }
  private getSessionsKey(studentId: string): string {
    return `uniraah_v2_${studentId}_recom_sessions`
  }
  private getViewsKey(studentId: string): string {
    return `uniraah_v2_${studentId}_recent_views`
  }
  private getCompareKey(studentId: string): string {
    return `uniraah_v2_${studentId}_compare`
  }

  // Seed default data for known personas if storage is empty
  private seedPersonaIfEmpty(studentId: string): void {
    const profileKey = this.getProfileKey(studentId)
    const existing = localStorage.getItem(profileKey)
    if (existing) return

    // Check if persona exists
    const cleanId = studentId.replace('student-', '') as 'hamza' | 'aisha' | 'bilal'
    const persona = DEMO_PERSONAS[cleanId]

    let baseProfile: StudentAcademicProfile = persona ? persona.profile : initialStudentProfile

    if (!persona) {
      try {
        const storedUsers = localStorage.getItem('uniraah_registered_users_v2')
        if (storedUsers) {
          const usersList = JSON.parse(storedUsers)
          const matched = usersList.find((u: { id: string }) => u.id === studentId)
          if (matched) {
            baseProfile = {
              ...initialStudentProfile,
              fullName: matched.fullName,
              email: matched.email,
              hscGroup: matched.hscGroup,
              board: matched.board,
              hscTotalPredictedPercentage: matched.hscTotalPredictedPercentage,
              hscPart1Percentage: matched.hscTotalPredictedPercentage,
              sscPercentage: matched.hscTotalPredictedPercentage,
            }
          }
        }
      } catch {
        // Fallback to initial
      }
    }

    const seededProfile: StudentProfileRecord = {
      ...baseProfile,
      id: `prof-${studentId}`,
      studentId,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    try {
      localStorage.setItem(profileKey, JSON.stringify(seededProfile))

      // Seed persona-specific saved items
      let defaultProgs = ['ned-cs', 'fast-cs']
      let defaultUnis = ['ned-uet', 'fast-nuces']
      let defaultCompare = ['ned-cs', 'fast-cs']

      if (cleanId === 'aisha') {
        defaultProgs = ['fast-cs', 'iba-cs']
        defaultUnis = ['fast-nuces', 'iba-karachi']
        defaultCompare = ['fast-cs', 'iba-cs']
      } else if (cleanId === 'bilal') {
        defaultProgs = ['duhs-mbbs', 'ku-cs']
        defaultUnis = ['duhs-karachi', 'ku-uok']
        defaultCompare = ['duhs-mbbs', 'ku-cs']
      }

      const progRecords: SavedProgrammeRecord[] = defaultProgs.map((pid) => ({
        id: `sp-${studentId}-${pid}`,
        studentId,
        programmeId: pid,
        savedAt: new Date().toISOString(),
      }))

      const uniRecords: SavedUniversityRecord[] = defaultUnis.map((uid) => ({
        id: `su-${studentId}-${uid}`,
        studentId,
        universityId: uid,
        savedAt: new Date().toISOString(),
      }))

      localStorage.setItem(this.getSavedProgrammesKey(studentId), JSON.stringify(progRecords))
      localStorage.setItem(this.getSavedUniversitiesKey(studentId), JSON.stringify(uniRecords))
      localStorage.setItem(this.getCompareKey(studentId), JSON.stringify(defaultCompare))

      // Seed initial view history
      const initialViews: SearchHistoryItem[] = [
        {
          id: `view-${studentId}-1`,
          title: 'BS Computer Science — NED UET',
          subtitle: 'Viewed curriculum and test weightage',
          path: '/student/programmes/ned-cs',
          type: 'programme',
          timestamp: '15 minutes ago',
        },
        {
          id: `view-${studentId}-2`,
          title: 'BS Computer Science — FAST-NUCES',
          subtitle: 'Compared closing aggregate with 2025 projection',
          path: '/student/programmes/fast-cs',
          type: 'programme',
          timestamp: '40 minutes ago',
        },
      ]
      localStorage.setItem(this.getViewsKey(studentId), JSON.stringify(initialViews))
    } catch {
      // Ignore localStorage write quota error in prototype
    }
  }

  // ==========================================================================
  // STUDENT PROFILE IMPLEMENTATION
  // ==========================================================================

  async getProfile(studentId: string, authUserId: string): Promise<StudentProfileRecord> {
    this.checkAuthorization(studentId, authUserId)
    await this.sleep()
    this.seedPersonaIfEmpty(studentId)

    const raw = localStorage.getItem(this.getProfileKey(studentId))
    if (!raw) {
      throw new NotFoundError(`Profile record for student '${studentId}' was not found.`)
    }

    try {
      return JSON.parse(raw) as StudentProfileRecord
    } catch {
      throw new ApiError(500, 'PARSE_ERROR', 'Failed to parse stored student profile.')
    }
  }

  async updateProfile(
    studentId: string,
    authUserId: string,
    updates: Partial<StudentAcademicProfile>,
    expectedVersion?: number
  ): Promise<StudentProfileRecord> {
    this.checkAuthorization(studentId, authUserId)
    await this.sleep()
    this.seedPersonaIfEmpty(studentId)

    const raw = localStorage.getItem(this.getProfileKey(studentId))
    if (!raw) {
      throw new NotFoundError(`Profile record for student '${studentId}' was not found.`)
    }

    const current: StudentProfileRecord = JSON.parse(raw)

    // Optimistic Concurrency check
    if (expectedVersion !== undefined && current.version !== expectedVersion) {
      throw new ConflictError(
        `Optimistic Lock Conflict: Expected profile version ${expectedVersion}, but found version ${current.version}. Another session may have updated this profile. Please reload and try again.`
      )
    }

    // Business & Field validation rules
    if (updates.sscPercentage !== undefined) {
      if (updates.sscPercentage < 33 || updates.sscPercentage > 100) {
        throw new ValidationError('SSC percentage must be between 33% and 100%.')
      }
    }
    if (updates.hscPart1Percentage !== undefined) {
      if (updates.hscPart1Percentage < 33 || updates.hscPart1Percentage > 100) {
        throw new ValidationError('HSC Part-1 percentage must be between 33% and 100%.')
      }
    }
    if (updates.hscTotalPredictedPercentage !== undefined) {
      if (updates.hscTotalPredictedPercentage < 33 || updates.hscTotalPredictedPercentage > 100) {
        throw new ValidationError('Predicted aggregate percentage must be between 33% and 100%.')
      }
    }
    if (updates.preferences?.maxAnnualBudgetPKR !== undefined) {
      if (updates.preferences.maxAnnualBudgetPKR < 10000 || updates.preferences.maxAnnualBudgetPKR > 5000000) {
        throw new ValidationError('Annual budget must be between 10,000 PKR and 5,000,000 PKR.')
      }
    }

    // Verify subject marks are valid percentages (0-100)
    if (updates.subjectMarks) {
      for (const [subj, mark] of Object.entries(updates.subjectMarks)) {
        if (mark !== undefined && (mark < 0 || mark > 100)) {
          throw new ValidationError(`Subject mark for ${subj} must be between 0 and 100.`)
        }
      }
    }

    const nextRecord: StudentProfileRecord = {
      ...current,
      ...updates,
      preferences: {
        ...current.preferences,
        ...(updates.preferences || {}),
        priorities: {
          ...current.preferences.priorities,
          ...(updates.preferences?.priorities || {}),
        },
      },
      subjectMarks: {
        ...current.subjectMarks,
        ...(updates.subjectMarks || {}),
      },
      version: current.version + 1,
      updatedAt: new Date().toISOString(),
    }

    localStorage.setItem(this.getProfileKey(studentId), JSON.stringify(nextRecord))
    return nextRecord
  }

  // ==========================================================================
  // SAVED PROGRAMMES IMPLEMENTATION
  // ==========================================================================

  async getSavedProgrammes(studentId: string, authUserId: string): Promise<SavedProgrammeRecord[]> {
    this.checkAuthorization(studentId, authUserId)
    await this.sleep()
    this.seedPersonaIfEmpty(studentId)

    const raw = localStorage.getItem(this.getSavedProgrammesKey(studentId))
    if (!raw) return []

    try {
      return JSON.parse(raw) as SavedProgrammeRecord[]
    } catch {
      return []
    }
  }

  async saveProgramme(
    studentId: string,
    authUserId: string,
    programmeId: string,
    notes?: string
  ): Promise<SavedProgrammeRecord> {
    this.checkAuthorization(studentId, authUserId)
    await this.sleep()
    this.seedPersonaIfEmpty(studentId)

    // Foreign Key check
    const progExists = mockProgrammes.some((p) => p.id === programmeId)
    if (!progExists) {
      throw new ValidationError(
        `Foreign Key Constraint Violation: Programme '${programmeId}' does not exist in Karachi admissions catalog.`
      )
    }

    const currentList = await this.getSavedProgrammes(studentId, authUserId)

    // Duplicate check
    const existing = currentList.find((p) => p.programmeId === programmeId)
    if (existing) {
      throw new ConflictError(`Duplicate entry: Programme '${programmeId}' is already shortlisted for student '${studentId}'.`)
    }

    const newRecord: SavedProgrammeRecord = {
      id: `sp-${studentId}-${programmeId}-${Date.now()}`,
      studentId,
      programmeId,
      savedAt: new Date().toISOString(),
      notes,
    }

    const updated = [newRecord, ...currentList]
    localStorage.setItem(this.getSavedProgrammesKey(studentId), JSON.stringify(updated))
    return newRecord
  }

  async removeSavedProgramme(studentId: string, authUserId: string, programmeId: string): Promise<void> {
    this.checkAuthorization(studentId, authUserId)
    await this.sleep()
    const currentList = await this.getSavedProgrammes(studentId, authUserId)
    const updated = currentList.filter((p) => p.programmeId !== programmeId)
    localStorage.setItem(this.getSavedProgrammesKey(studentId), JSON.stringify(updated))
  }

  async clearSavedProgrammes(studentId: string, authUserId: string): Promise<void> {
    this.checkAuthorization(studentId, authUserId)
    await this.sleep()
    localStorage.setItem(this.getSavedProgrammesKey(studentId), JSON.stringify([]))
  }

  // ==========================================================================
  // SAVED UNIVERSITIES IMPLEMENTATION
  // ==========================================================================

  async getSavedUniversities(studentId: string, authUserId: string): Promise<SavedUniversityRecord[]> {
    this.checkAuthorization(studentId, authUserId)
    await this.sleep()
    this.seedPersonaIfEmpty(studentId)

    const raw = localStorage.getItem(this.getSavedUniversitiesKey(studentId))
    if (!raw) return []

    try {
      return JSON.parse(raw) as SavedUniversityRecord[]
    } catch {
      return []
    }
  }

  async saveUniversity(
    studentId: string,
    authUserId: string,
    universityId: string,
    notes?: string
  ): Promise<SavedUniversityRecord> {
    this.checkAuthorization(studentId, authUserId)
    await this.sleep()
    this.seedPersonaIfEmpty(studentId)

    // Foreign Key check
    const uniExists = mockUniversities.some((u) => u.id === universityId)
    if (!uniExists) {
      throw new ValidationError(
        `Foreign Key Constraint Violation: University '${universityId}' does not exist in Karachi admissions catalog.`
      )
    }

    const currentList = await this.getSavedUniversities(studentId, authUserId)

    // Duplicate check
    const existing = currentList.find((u) => u.universityId === universityId)
    if (existing) {
      throw new ConflictError(`Duplicate entry: University '${universityId}' is already bookmarked for student '${studentId}'.`)
    }

    const newRecord: SavedUniversityRecord = {
      id: `su-${studentId}-${universityId}-${Date.now()}`,
      studentId,
      universityId,
      savedAt: new Date().toISOString(),
      notes,
    }

    const updated = [newRecord, ...currentList]
    localStorage.setItem(this.getSavedUniversitiesKey(studentId), JSON.stringify(updated))
    return newRecord
  }

  async removeSavedUniversity(studentId: string, authUserId: string, universityId: string): Promise<void> {
    this.checkAuthorization(studentId, authUserId)
    await this.sleep()
    const currentList = await this.getSavedUniversities(studentId, authUserId)
    const updated = currentList.filter((u) => u.universityId !== universityId)
    localStorage.setItem(this.getSavedUniversitiesKey(studentId), JSON.stringify(updated))
  }

  async clearSavedUniversities(studentId: string, authUserId: string): Promise<void> {
    this.checkAuthorization(studentId, authUserId)
    await this.sleep()
    localStorage.setItem(this.getSavedUniversitiesKey(studentId), JSON.stringify([]))
  }

  // ==========================================================================
  // RECOMMENDATION SESSIONS IMPLEMENTATION (Requirement D)
  // ==========================================================================

  async getRecommendationSessions(
    studentId: string,
    authUserId: string
  ): Promise<RecommendationSessionRecord[]> {
    this.checkAuthorization(studentId, authUserId)
    await this.sleep()
    this.seedPersonaIfEmpty(studentId)

    const raw = localStorage.getItem(this.getSessionsKey(studentId))
    if (!raw) return []

    try {
      return JSON.parse(raw) as RecommendationSessionRecord[]
    } catch {
      return []
    }
  }

  async saveRecommendationSession(
    studentId: string,
    authUserId: string,
    sessionData: Omit<RecommendationSessionRecord, 'id' | 'createdAt' | 'studentId'>
  ): Promise<RecommendationSessionRecord> {
    this.checkAuthorization(studentId, authUserId)
    await this.sleep()
    this.seedPersonaIfEmpty(studentId)

    const currentSessions = await this.getRecommendationSessions(studentId, authUserId)

    const newSession: RecommendationSessionRecord = {
      ...sessionData,
      id: `recsess-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      studentId,
      createdAt: new Date().toISOString(),
    }

    // Keep up to 10 historical sessions per student
    const updated = [newSession, ...currentSessions].slice(0, 10)
    localStorage.setItem(this.getSessionsKey(studentId), JSON.stringify(updated))
    return newSession
  }

  async getRecommendationSessionById(
    studentId: string,
    authUserId: string,
    sessionId: string
  ): Promise<RecommendationSessionRecord> {
    this.checkAuthorization(studentId, authUserId)
    await this.sleep()

    const sessions = await this.getRecommendationSessions(studentId, authUserId)
    const found = sessions.find((s) => s.id === sessionId)
    if (!found) {
      throw new NotFoundError(`Recommendation session '${sessionId}' was not found for student '${studentId}'.`)
    }
    return found
  }

  // ==========================================================================
  // RECENT VIEWS & AUDIT LOG IMPLEMENTATION (Requirement E)
  // ==========================================================================

  async getRecentViews(studentId: string, authUserId: string): Promise<SearchHistoryItem[]> {
    this.checkAuthorization(studentId, authUserId)
    await this.sleep()
    this.seedPersonaIfEmpty(studentId)

    const raw = localStorage.getItem(this.getViewsKey(studentId))
    if (!raw) return []

    try {
      return JSON.parse(raw) as SearchHistoryItem[]
    } catch {
      return []
    }
  }

  async recordRecentView(
    studentId: string,
    authUserId: string,
    view: Omit<SearchHistoryItem, 'id' | 'timestamp'>
  ): Promise<SearchHistoryItem> {
    this.checkAuthorization(studentId, authUserId)
    await this.sleep()
    this.seedPersonaIfEmpty(studentId)

    const currentViews = await this.getRecentViews(studentId, authUserId)
    const filtered = currentViews.filter((v) => v.path !== view.path)

    const now = new Date()
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

    const newRecord: SearchHistoryItem = {
      ...view,
      id: `view-${studentId}-${Date.now()}`,
      timestamp: `Today at ${timeStr}`,
    }

    // Maximum 20 bounded views
    const updated = [newRecord, ...filtered].slice(0, 20)
    localStorage.setItem(this.getViewsKey(studentId), JSON.stringify(updated))
    return newRecord
  }

  async clearRecentViews(studentId: string, authUserId: string): Promise<void> {
    this.checkAuthorization(studentId, authUserId)
    await this.sleep()
    localStorage.setItem(this.getViewsKey(studentId), JSON.stringify([]))
  }

  // ==========================================================================
  // COMPARISON MATRIX (Requirement F)
  // ==========================================================================

  async getComparison(studentId: string, authUserId: string): Promise<string[]> {
    this.checkAuthorization(studentId, authUserId)
    await this.sleep()
    this.seedPersonaIfEmpty(studentId)

    const raw = localStorage.getItem(this.getCompareKey(studentId))
    if (!raw) return []

    try {
      return JSON.parse(raw) as string[]
    } catch {
      return []
    }
  }

  async updateComparison(
    studentId: string,
    authUserId: string,
    programmeIds: string[]
  ): Promise<string[]> {
    this.checkAuthorization(studentId, authUserId)
    await this.sleep()

    // Enforce max 4 comparison items
    const bounded = Array.from(new Set(programmeIds)).slice(0, 4)

    // Foreign key check
    for (const pid of bounded) {
      if (!mockProgrammes.some((p) => p.id === pid)) {
        throw new ValidationError(
          `Foreign key violation: Programme '${pid}' does not exist in admissions catalog.`
        )
      }
    }

    localStorage.setItem(this.getCompareKey(studentId), JSON.stringify(bounded))
    return bounded
  }
}

// Singleton API instance exported for the application
export const studentDashboardApi: IStudentDashboardApi = new PrototypeDashboardAdapter()
