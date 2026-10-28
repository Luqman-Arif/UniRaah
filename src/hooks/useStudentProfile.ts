import { useContext } from 'react'
import {
  StudentProfileContext,
  StudentProfileContextValue,
} from '@/app/providers/StudentProfileProvider'

export function useStudentProfile(): StudentProfileContextValue {
  const context = useContext(StudentProfileContext)
  if (!context) {
    throw new Error('useStudentProfile must be used within a StudentProfileProvider')
  }
  return context
}
