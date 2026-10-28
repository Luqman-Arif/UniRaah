/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { StudentAcademicProfile } from '@/types/student'
import { useAuth } from '@/hooks/useAuth'
import { studentDashboardApi, ApiError } from '@/services/api/studentDashboardApi'

export const initialStudentProfile: StudentAcademicProfile = {
  fullName: 'Muhammad Hamza',
  email: 'hamza.karachi@example.com',
  hscGroup: 'Pre-Engineering',
  board: 'Board of Intermediate Education Karachi (BIEK)',
  sscPercentage: 84.5,
  hscPart1Percentage: 81.2,
  hscTotalPredictedPercentage: 82.5,
  subjectMarks: {
    mathematics: 85,
    physics: 80,
    chemistry: 82,
  },
  preferences: {
    disciplines: ['Computer Science & AI', 'Software Engineering'],
    maxAnnualBudgetPKR: 500000,
    budgetPeriod: 'annual',
    homeLocation: 'Gulshan-e-Iqbal',
    sector: 'all',
    shift: 'morning',
    priorities: {
      merit: 50,
      affordability: 30,
      distance: 20,
    },
  },
}

export interface StudentProfileContextValue {
  profile: StudentAcademicProfile
  isLoading: boolean
  isSaving: boolean
  error: string | null
  profileVersion: number
  updateProfile: (updated: Partial<StudentAcademicProfile>) => void
  saveProfile: (updated: Partial<StudentAcademicProfile>) => Promise<boolean>
  reloadProfile: () => Promise<void>
  resetProfile: () => void
  setFullProfile: (profile: StudentAcademicProfile) => void
}

export const StudentProfileContext = createContext<StudentProfileContextValue | undefined>(undefined)

export const StudentProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth()
  const activeStudentId = user?.id || 'student-hamza'

  const [profile, setProfileState] = useState<StudentAcademicProfile>(initialStudentProfile)
  const [profileVersion, setProfileVersion] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  // Asynchronously load the authenticated student's profile from the API layer
  const reloadProfile = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const record = await studentDashboardApi.getProfile(activeStudentId, activeStudentId)
      setProfileState({
        fullName: record.fullName,
        email: record.email,
        hscGroup: record.hscGroup,
        board: record.board,
        sscPercentage: record.sscPercentage,
        hscPart1Percentage: record.hscPart1Percentage,
        hscTotalPredictedPercentage: record.hscTotalPredictedPercentage,
        subjectMarks: record.subjectMarks,
        preferences: record.preferences,
      })
      setProfileVersion(record.version)
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message)
      } else {
        setError('Failed to fetch profile from server.')
      }
    } finally {
      setIsLoading(false)
    }
  }, [activeStudentId])

  // Reload when authenticated user changes
  useEffect(() => {
    reloadProfile()
  }, [reloadProfile])

  // Save edits to the backend record with optimistic concurrency validation
  const saveProfile = useCallback(
    async (updated: Partial<StudentAcademicProfile>): Promise<boolean> => {
      setIsSaving(true)
      setError(null)
      try {
        const savedRecord = await studentDashboardApi.updateProfile(
          activeStudentId,
          activeStudentId,
          updated,
          profileVersion
        )

        setProfileState({
          fullName: savedRecord.fullName,
          email: savedRecord.email,
          hscGroup: savedRecord.hscGroup,
          board: savedRecord.board,
          sscPercentage: savedRecord.sscPercentage,
          hscPart1Percentage: savedRecord.hscPart1Percentage,
          hscTotalPredictedPercentage: savedRecord.hscTotalPredictedPercentage,
          subjectMarks: savedRecord.subjectMarks,
          preferences: savedRecord.preferences,
        })
        setProfileVersion(savedRecord.version)
        return true
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message)
        } else {
          setError('Failed to save profile changes.')
        }
        return false
      } finally {
        setIsSaving(false)
      }
    },
    [activeStudentId, profileVersion]
  )

  // Synchronous optimistic update
  const updateProfile = useCallback((updated: Partial<StudentAcademicProfile>) => {
    setProfileState((prev) => ({
      ...prev,
      ...updated,
      preferences: {
        ...prev.preferences,
        ...(updated.preferences || {}),
        priorities: {
          ...prev.preferences.priorities,
          ...(updated.preferences?.priorities || {}),
        },
      },
      subjectMarks: {
        ...prev.subjectMarks,
        ...(updated.subjectMarks || {}),
      },
    }))
  }, [])

  const setFullProfile = useCallback((full: StudentAcademicProfile) => {
    setProfileState(full)
  }, [])

  const resetProfile = useCallback(() => {
    setProfileState(initialStudentProfile)
    setProfileVersion(1)
  }, [])

  return (
    <StudentProfileContext.Provider
      value={{
        profile,
        isLoading,
        isSaving,
        error,
        profileVersion,
        updateProfile,
        saveProfile,
        reloadProfile,
        resetProfile,
        setFullProfile,
      }}
    >
      {children}
    </StudentProfileContext.Provider>
  )
}
