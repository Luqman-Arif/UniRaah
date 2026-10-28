/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react'
import {
  StudentDashboardContextValue,
  SearchHistoryItem,
  ToastNotification,
  RecommendationSessionRecord,
  RecommendationSessionItem,
} from '@/types/dashboard'
import { useAuth } from '@/hooks/useAuth'
import { useStudentProfile } from '@/hooks/useStudentProfile'
import { studentDashboardApi, ApiError } from '@/services/api/studentDashboardApi'
import { evaluateStudentRecommendations } from '@/services/mock/recommendationEngine'
import { mockProgrammes } from '@/data/mock/programmes'

export const StudentDashboardContext = createContext<StudentDashboardContextValue | undefined>(
  undefined
)

export const StudentDashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const { profile } = useStudentProfile()
  const activeStudentId = user?.id || 'student-hamza'

  // State indicators
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSyncing, setIsSyncing] = useState<boolean>(false)

  // 1. Saved Programmes
  const [savedProgrammeIds, setSavedProgrammeIds] = useState<string[]>([])

  // 2. Saved Universities
  const [savedUniversityIds, setSavedUniversityIds] = useState<string[]>([])

  // 3. Compare List (2 - 4 programmes)
  const [compareProgrammeIds, setCompareProgrammeIds] = useState<string[]>([])

  // 4. View & Search History
  const [history, setHistory] = useState<SearchHistoryItem[]>([])

  // 5. Recommendation Sessions
  const [sessions, setSessions] = useState<RecommendationSessionRecord[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)

  // 6. Toast Notifications
  const [toasts, setToasts] = useState<ToastNotification[]>([])

  // Toast Helpers
  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (title: string, message: string, type: ToastNotification['type'] = 'info') => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
      const newToast: ToastNotification = { id, title, message, type }
      setToasts((prev) => [...prev.slice(-3), newToast])

      setTimeout(() => {
        dismissToast(id)
      }, 4000)
    },
    [dismissToast]
  )

  // Asynchronously synchronize all student-owned entities from the API layer
  const loadDashboardData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [progs, unis, comp, views, recSessions] = await Promise.all([
        studentDashboardApi.getSavedProgrammes(activeStudentId, activeStudentId),
        studentDashboardApi.getSavedUniversities(activeStudentId, activeStudentId),
        studentDashboardApi.getComparison(activeStudentId, activeStudentId),
        studentDashboardApi.getRecentViews(activeStudentId, activeStudentId),
        studentDashboardApi.getRecommendationSessions(activeStudentId, activeStudentId),
      ])

      setSavedProgrammeIds(progs.map((p) => p.programmeId))
      setSavedUniversityIds(unis.map((u) => u.universityId))
      setCompareProgrammeIds(comp)
      setHistory(views)
      setSessions(recSessions)
    } catch (err) {
      if (err instanceof ApiError) {
        showToast('Sync Error', err.message, 'error')
      } else {
        showToast('Sync Error', 'Failed to synchronize student dashboard data.', 'error')
      }
    } finally {
      setIsLoading(false)
    }
  }, [activeStudentId, showToast])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  // ==========================================================================
  // PROGRAMME SHORTLIST OPERATIONS
  // ==========================================================================

  const saveProgramme = useCallback(
    async (programmeId: string): Promise<boolean> => {
      if (savedProgrammeIds.includes(programmeId)) {
        showToast('Already Saved', 'This degree programme is already in your shortlist.', 'info')
        return true
      }
      setIsSyncing(true)
      try {
        await studentDashboardApi.saveProgramme(activeStudentId, activeStudentId, programmeId)
        setSavedProgrammeIds((prev) => [programmeId, ...prev])
        showToast('Programme Shortlisted', 'Degree added to your saved shortlist.', 'success')
        return true
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : 'Could not save programme.'
        showToast('Save Failed', msg, 'error')
        return false
      } finally {
        setIsSyncing(false)
      }
    },
    [activeStudentId, savedProgrammeIds, showToast]
  )

  const removeSavedProgramme = useCallback(
    async (programmeId: string): Promise<boolean> => {
      setIsSyncing(true)
      try {
        await studentDashboardApi.removeSavedProgramme(activeStudentId, activeStudentId, programmeId)
        setSavedProgrammeIds((prev) => prev.filter((id) => id !== programmeId))
        showToast('Removed from Shortlist', 'Programme was removed from your saved list.', 'info')
        return true
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : 'Could not remove programme.'
        showToast('Action Failed', msg, 'error')
        return false
      } finally {
        setIsSyncing(false)
      }
    },
    [activeStudentId, showToast]
  )

  const toggleSaveProgramme = useCallback(
    async (programmeId: string): Promise<boolean> => {
      if (savedProgrammeIds.includes(programmeId)) {
        await removeSavedProgramme(programmeId)
        return false
      } else {
        await saveProgramme(programmeId)
        return true
      }
    },
    [savedProgrammeIds, removeSavedProgramme, saveProgramme]
  )

  const isProgrammeSaved = useCallback(
    (programmeId: string): boolean => {
      return savedProgrammeIds.includes(programmeId)
    },
    [savedProgrammeIds]
  )

  const clearAllSavedProgrammes = useCallback(async () => {
    setIsSyncing(true)
    try {
      await studentDashboardApi.clearSavedProgrammes(activeStudentId, activeStudentId)
      setSavedProgrammeIds([])
      showToast('Shortlist Cleared', 'All saved programmes have been removed.', 'info')
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to clear programmes.'
      showToast('Error', msg, 'error')
    } finally {
      setIsSyncing(false)
    }
  }, [activeStudentId, showToast])

  // ==========================================================================
  // UNIVERSITY BOOKMARK OPERATIONS
  // ==========================================================================

  const saveUniversity = useCallback(
    async (universityId: string): Promise<boolean> => {
      if (savedUniversityIds.includes(universityId)) {
        showToast('Already Bookmarked', 'This university is already bookmarked.', 'info')
        return true
      }
      setIsSyncing(true)
      try {
        await studentDashboardApi.saveUniversity(activeStudentId, activeStudentId, universityId)
        setSavedUniversityIds((prev) => [universityId, ...prev])
        showToast('University Bookmarked', 'University added to your bookmarks.', 'success')
        return true
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : 'Could not bookmark university.'
        showToast('Save Failed', msg, 'error')
        return false
      } finally {
        setIsSyncing(false)
      }
    },
    [activeStudentId, savedUniversityIds, showToast]
  )

  const removeSavedUniversity = useCallback(
    async (universityId: string): Promise<boolean> => {
      setIsSyncing(true)
      try {
        await studentDashboardApi.removeSavedUniversity(activeStudentId, activeStudentId, universityId)
        setSavedUniversityIds((prev) => prev.filter((id) => id !== universityId))
        showToast('University Removed', 'University removed from your saved list.', 'info')
        return true
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : 'Could not remove university.'
        showToast('Action Failed', msg, 'error')
        return false
      } finally {
        setIsSyncing(false)
      }
    },
    [activeStudentId, showToast]
  )

  const toggleSaveUniversity = useCallback(
    async (universityId: string): Promise<boolean> => {
      if (savedUniversityIds.includes(universityId)) {
        await removeSavedUniversity(universityId)
        return false
      } else {
        await saveUniversity(universityId)
        return true
      }
    },
    [savedUniversityIds, removeSavedUniversity, saveUniversity]
  )

  const isUniversitySaved = useCallback(
    (universityId: string): boolean => {
      return savedUniversityIds.includes(universityId)
    },
    [savedUniversityIds]
  )

  const clearAllSavedUniversities = useCallback(async () => {
    setIsSyncing(true)
    try {
      await studentDashboardApi.clearSavedUniversities(activeStudentId, activeStudentId)
      setSavedUniversityIds([])
      showToast('Saved Universities Cleared', 'All saved universities have been removed.', 'info')
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to clear universities.'
      showToast('Error', msg, 'error')
    } finally {
      setIsSyncing(false)
    }
  }, [activeStudentId, showToast])

  // ==========================================================================
  // PROGRAMME COMPARISON OPERATIONS
  // ==========================================================================

  const addToCompare = useCallback(
    async (programmeId: string): Promise<boolean> => {
      if (compareProgrammeIds.length >= 4) {
        showToast(
          'Comparison Limit Reached',
          'You can compare a maximum of 4 programmes simultaneously. Remove one first.',
          'warning'
        )
        return false
      }
      if (compareProgrammeIds.includes(programmeId)) {
        return true
      }
      const next = [...compareProgrammeIds, programmeId]
      setIsSyncing(true)
      try {
        await studentDashboardApi.updateComparison(activeStudentId, activeStudentId, next)
        setCompareProgrammeIds(next)
        showToast('Added to Compare', 'Programme added to your comparison matrix.', 'success')
        return true
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : 'Failed to add to comparison.'
        showToast('Error', msg, 'error')
        return false
      } finally {
        setIsSyncing(false)
      }
    },
    [activeStudentId, compareProgrammeIds, showToast]
  )

  const removeFromCompare = useCallback(
    async (programmeId: string) => {
      const next = compareProgrammeIds.filter((id) => id !== programmeId)
      setIsSyncing(true)
      try {
        await studentDashboardApi.updateComparison(activeStudentId, activeStudentId, next)
        setCompareProgrammeIds(next)
        showToast('Removed from Compare', 'Programme removed from comparison view.', 'info')
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : 'Failed to update comparison.'
        showToast('Error', msg, 'error')
      } finally {
        setIsSyncing(false)
      }
    },
    [activeStudentId, compareProgrammeIds, showToast]
  )

  const toggleCompareProgramme = useCallback(
    async (programmeId: string): Promise<boolean> => {
      if (compareProgrammeIds.includes(programmeId)) {
        await removeFromCompare(programmeId)
        return false
      } else {
        return await addToCompare(programmeId)
      }
    },
    [compareProgrammeIds, removeFromCompare, addToCompare]
  )

  const isInCompare = useCallback(
    (programmeId: string): boolean => {
      return compareProgrammeIds.includes(programmeId)
    },
    [compareProgrammeIds]
  )

  const clearCompare = useCallback(async () => {
    setIsSyncing(true)
    try {
      await studentDashboardApi.updateComparison(activeStudentId, activeStudentId, [])
      setCompareProgrammeIds([])
      showToast('Comparison Cleared', 'All programmes cleared from comparison.', 'info')
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to clear comparison.'
      showToast('Error', msg, 'error')
    } finally {
      setIsSyncing(false)
    }
  }, [activeStudentId, showToast])

  // ==========================================================================
  // RECENT VIEWS & AUDIT LOG
  // ==========================================================================

  const recordHistory = useCallback(
    async (item: Omit<SearchHistoryItem, 'id' | 'timestamp'>) => {
      try {
        const recorded = await studentDashboardApi.recordRecentView(
          activeStudentId,
          activeStudentId,
          item
        )
        setHistory((prev) => [recorded, ...prev.filter((h) => h.path !== item.path)].slice(0, 20))
      } catch {
        // Silently tolerate view logging failure
      }
    },
    [activeStudentId]
  )

  const clearHistory = useCallback(async () => {
    setIsSyncing(true)
    try {
      await studentDashboardApi.clearRecentViews(activeStudentId, activeStudentId)
      setHistory([])
      showToast('History Cleared', 'Your recent search and view history has been cleared.', 'info')
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Failed to clear history.'
      showToast('Error', msg, 'error')
    } finally {
      setIsSyncing(false)
    }
  }, [activeStudentId, showToast])

  // ==========================================================================
  // RECOMMENDATION SESSIONS (Requirement D)
  // ==========================================================================

  const saveRecommendationSession = useCallback(
    async (
      sessionData: Omit<RecommendationSessionRecord, 'id' | 'createdAt' | 'studentId'>
    ): Promise<RecommendationSessionRecord | null> => {
      setIsSyncing(true)
      try {
        const created = await studentDashboardApi.saveRecommendationSession(
          activeStudentId,
          activeStudentId,
          sessionData
        )
        setSessions((prev) => [created, ...prev])
        setActiveSessionId(created.id)
        showToast('Session Saved', 'Recommendation session snapshot preserved in your history.', 'success')
        return created
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : 'Could not save session.'
        showToast('Session Error', msg, 'error')
        return null
      } finally {
        setIsSyncing(false)
      }
    },
    [activeStudentId, showToast]
  )

  const loadSession = useCallback((sessionId: string | null) => {
    setActiveSessionId(sessionId)
  }, [])

  const refreshRecommendationSession = useCallback(async (): Promise<RecommendationSessionRecord | null> => {
    setIsSyncing(true)
    try {
      // Evaluate live recommendations against latest profile
      const evaluated = evaluateStudentRecommendations(profile, mockProgrammes)

      const sessionItems: RecommendationSessionItem[] = evaluated.map((rec, index) => ({
        rank: index + 1,
        programmeId: rec.programme.id,
        programmeName: rec.programme.name,
        universityName: rec.programme.universityName,
        universityShortName: rec.programme.universityShortName,
        matchCategory: rec.matchCategory,
        recommendationScore: rec.recommendationScore,
        studentEstimatedAggregate: rec.studentEstimatedAggregate,
        targetClosingCutoff: rec.targetClosingCutoff,
        aggregateDelta: rec.aggregateDelta,
        annualTuitionFeePKR: rec.programme.annualTuitionFeePKR,
        distanceKm: rec.distanceKm,
        meetsMinimumEligibility: rec.meetsMinimumEligibility,
        eligibilityNotes: rec.eligibilityNotes,
      }))

      const top = sessionItems[0]?.programmeName || 'Undergraduate Degree'

      const newSessionRecord = await studentDashboardApi.saveRecommendationSession(
        activeStudentId,
        activeStudentId,
        {
          profileSnapshot: {
            fullName: profile.fullName,
            hscGroup: profile.hscGroup,
            board: profile.board,
            sscPercentage: profile.sscPercentage,
            hscPart1Percentage: profile.hscPart1Percentage,
            hscTotalPredictedPercentage: profile.hscTotalPredictedPercentage,
            homeLocation: profile.preferences.homeLocation,
            maxAnnualBudgetPKR: profile.preferences.maxAnnualBudgetPKR,
          },
          criteriaWeights: {
            merit: profile.preferences.priorities?.merit ?? 50,
            affordability: profile.preferences.priorities?.affordability ?? 30,
            distance: profile.preferences.priorities?.distance ?? 20,
          },
          resultsCount: sessionItems.length,
          topRecommendationTitle: top,
          results: sessionItems,
        }
      )

      setSessions((prev) => [newSessionRecord, ...prev])
      setActiveSessionId(newSessionRecord.id)
      showToast(
        'Recommendations Refreshed',
        `Created fresh session with ${sessionItems.length} evaluated degrees based on your ${profile.hscTotalPredictedPercentage}% aggregate.`,
        'success'
      )
      return newSessionRecord
    } catch (err) {
      const msg = err instanceof ApiError ? err.message : 'Could not refresh recommendations.'
      showToast('Refresh Failed', msg, 'error')
      return null
    } finally {
      setIsSyncing(false)
    }
  }, [activeStudentId, profile, showToast])

  const activeSession = sessions.find((s) => s.id === activeSessionId) || null

  const value: StudentDashboardContextValue = {
    isLoading,
    isSyncing,
    savedProgrammeIds,
    saveProgramme,
    removeSavedProgramme,
    toggleSaveProgramme,
    isProgrammeSaved,
    clearAllSavedProgrammes,
    savedUniversityIds,
    saveUniversity,
    removeSavedUniversity,
    toggleSaveUniversity,
    isUniversitySaved,
    clearAllSavedUniversities,
    compareProgrammeIds,
    addToCompare,
    removeFromCompare,
    toggleCompareProgramme,
    isInCompare,
    clearCompare,
    history,
    recordHistory,
    clearHistory,
    sessions,
    activeSessionId,
    activeSession,
    saveRecommendationSession,
    loadSession,
    refreshRecommendationSession,
    toasts,
    showToast,
    dismissToast,
  }

  return (
    <StudentDashboardContext.Provider value={value}>
      {children}
    </StudentDashboardContext.Provider>
  )
}
