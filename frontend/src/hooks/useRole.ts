import { useContext } from 'react'
import { RoleContext, RoleContextValue } from '@/app/providers/RoleProvider'

export function useRole(): RoleContextValue {
  const context = useContext(RoleContext)
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider')
  }
  return context
}
