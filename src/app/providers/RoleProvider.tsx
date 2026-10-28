/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, ReactNode } from 'react'
import { UserRole } from '@/types'

export interface RoleContextValue {
  role: UserRole
  setRole: (role: UserRole) => void
  toggleRole: () => void
}

export const RoleContext = createContext<RoleContextValue | undefined>(undefined)

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('student')

  const toggleRole = () => {
    setRole((prev) => (prev === 'student' ? 'admin' : 'student'))
  }

  return (
    <RoleContext.Provider value={{ role, setRole, toggleRole }}>
      {children}
    </RoleContext.Provider>
  )
}
