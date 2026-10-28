import { useContext } from 'react'
import { StudentDashboardContext } from '@/app/providers/StudentDashboardProvider'
import { StudentDashboardContextValue } from '@/types/dashboard'

export function useStudentDashboard(): StudentDashboardContextValue {
  const context = useContext(StudentDashboardContext)
  if (!context) {
    throw new Error('useStudentDashboard must be used within a StudentDashboardProvider')
  }
  return context
}
