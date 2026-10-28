/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { HSCGroup, ExaminationBoard, StudentAcademicProfile } from '@/types/student'
import { initialStudentProfile } from './StudentProfileProvider'
import {
  authService,
  AuthUser,
  AuthResponse,
  SignUpPayload,
  VerificationResponse,
  DEMO_PERSONAS_CATALOG,
} from '@/services/auth/authService'

export type { AuthUser, AuthResponse, SignUpPayload, VerificationResponse }

export interface DemoPersona {
  id: 'hamza' | 'aisha' | 'bilal'
  name: string
  email: string
  group: HSCGroup
  board: ExaminationBoard
  percentage: number
  profile: StudentAcademicProfile
}

export const DEMO_PERSONAS: Record<'hamza' | 'aisha' | 'bilal', DemoPersona> = {
  hamza: {
    id: 'hamza',
    name: DEMO_PERSONAS_CATALOG.hamza.name,
    email: DEMO_PERSONAS_CATALOG.hamza.email,
    group: DEMO_PERSONAS_CATALOG.hamza.group,
    board: DEMO_PERSONAS_CATALOG.hamza.board,
    percentage: DEMO_PERSONAS_CATALOG.hamza.percentage,
    profile: initialStudentProfile,
  },
  aisha: {
    id: 'aisha',
    name: DEMO_PERSONAS_CATALOG.aisha.name,
    email: DEMO_PERSONAS_CATALOG.aisha.email,
    group: DEMO_PERSONAS_CATALOG.aisha.group,
    board: DEMO_PERSONAS_CATALOG.aisha.board,
    percentage: DEMO_PERSONAS_CATALOG.aisha.percentage,
    profile: DEMO_PERSONAS_CATALOG.aisha.profile,
  },
  bilal: {
    id: 'bilal',
    name: DEMO_PERSONAS_CATALOG.bilal.name,
    email: DEMO_PERSONAS_CATALOG.bilal.email,
    group: DEMO_PERSONAS_CATALOG.bilal.group,
    board: DEMO_PERSONAS_CATALOG.bilal.board,
    percentage: DEMO_PERSONAS_CATALOG.bilal.percentage,
    profile: DEMO_PERSONAS_CATALOG.bilal.profile,
  },
}

export interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (
    userDataOrCredentials?:
      | Partial<AuthUser>
      | { email: string; password?: string; rememberMe?: boolean }
  ) => Promise<AuthResponse>
  loginWithPersona: (personaKey: 'hamza' | 'aisha' | 'bilal') => void
  signUp: (userData: {
    fullName: string
    email: string
    password?: string
    hscGroup: HSCGroup
    board: ExaminationBoard
    hscTotalPredictedPercentage?: number
  }) => Promise<AuthResponse>
  checkEmailStatus: (email: string) => {
    isValid: boolean
    isAlreadyRegistered: boolean
    error?: string
    isTypo?: boolean
    suggestion?: string
    domain?: string
  }
  isEmailRegistered: (email: string) => boolean
  initiateSignUpVerification: (payload: SignUpPayload) => Promise<VerificationResponse>
  resendSignUpVerificationCode: (email: string) => Promise<VerificationResponse>
  verifySignUpCodeAndRegister: (email: string, code: string) => Promise<AuthResponse>
  resetPassword: (email: string, newPassword: string) => Promise<{ success: boolean; error?: string }>
  updateUser: (updatedData: Partial<AuthUser>) => void
  logout: () => void
  // Modal state & navigation
  isAuthModalOpen: boolean
  authModalMode: 'signin' | 'signup' | 'forgot'
  authModalMessage: string | null
  openAuthModal: (mode?: 'signin' | 'signup' | 'forgot', redirectUrl?: string, message?: string) => void
  closeAuthModal: () => void
  redirectAfterAuth: string | null
  setRedirectAfterAuth: (url: string | null) => void
  rememberedEmail: string
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize auth state from authService session
  const [user, setUser] = useState<AuthUser | null>(() => authService.getCurrentSession())
  const [isLoading, setIsLoading] = useState(false)
  const [rememberedEmail, setRememberedEmail] = useState(() => authService.getRememberedEmail())

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup' | 'forgot'>('signin')
  const [authModalMessage, setAuthModalMessage] = useState<string | null>(null)
  const [redirectAfterAuth, setRedirectAfterAuth] = useState<string | null>(null)

  const isAuthenticated = !!user

  // Synchronize active user into persistent storage
  useEffect(() => {
    if (user) {
      authService.saveSession(user)
    } else {
      authService.signOut()
    }
  }, [user])

  const login = useCallback(
    async (
      userDataOrCredentials?:
        | Partial<AuthUser>
        | { email: string; password?: string; rememberMe?: boolean }
    ): Promise<AuthResponse> => {
      setIsLoading(true)
      try {
        // If an email is supplied, perform verified authentication through authService
        if (userDataOrCredentials && 'email' in userDataOrCredentials && userDataOrCredentials.email) {
          const email = userDataOrCredentials.email
          const password = 'password' in userDataOrCredentials ? userDataOrCredentials.password : undefined
          const rememberMe =
            'rememberMe' in userDataOrCredentials ? !!userDataOrCredentials.rememberMe : true

          const res = await authService.signIn(email, password, rememberMe)
          if (res.success && res.user) {
            setUser(res.user)
            if (rememberMe) {
              setRememberedEmail(email)
            }
            setIsAuthModalOpen(false)
            return res
          }
          return res
        }

        // Fallback for direct object mock passing (e.g. legacy callers)
        const userMock = (userDataOrCredentials || {}) as Partial<AuthUser>
        const fallbackUser: AuthUser = {
          id: userMock.id || 'student-hamza',
          fullName: userMock.fullName || 'Muhammad Hamza',
          email: userMock.email || 'hamza.student@uniraah.pk',
          role: userMock.role || 'student',
          hscGroup: userMock.hscGroup || 'Pre-Engineering',
          board: userMock.board || 'Board of Intermediate Education Karachi (BIEK)',
          hscTotalPredictedPercentage: userMock.hscTotalPredictedPercentage || 82.5,
          avatarUrl: userMock.avatarUrl,
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        }

        authService.saveSession(fallbackUser)
        setUser(fallbackUser)
        setIsAuthModalOpen(false)
        return { success: true, user: fallbackUser }
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const loginWithPersona = useCallback((personaKey: 'hamza' | 'aisha' | 'bilal') => {
    const personaUser = authService.loginWithDemoPersona(personaKey)
    setUser(personaUser)
    setIsAuthModalOpen(false)
  }, [])

  const signUp = useCallback(
    async (userData: {
      fullName: string
      email: string
      password?: string
      hscGroup: HSCGroup
      board: ExaminationBoard
      hscTotalPredictedPercentage?: number
    }): Promise<AuthResponse> => {
      setIsLoading(true)
      try {
        const payload: SignUpPayload = {
          fullName: userData.fullName,
          email: userData.email,
          password: userData.password || 'password123',
          hscGroup: userData.hscGroup,
          board: userData.board,
          hscTotalPredictedPercentage: userData.hscTotalPredictedPercentage || 80.0,
        }

        const res = await authService.signUp(payload)
        if (res.success && res.user) {
          setUser(res.user)
          setIsAuthModalOpen(false)
        }
        return res
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const checkEmailStatus = useCallback((email: string) => {
    return authService.checkEmailStatus(email)
  }, [])

  const isEmailRegistered = useCallback((email: string) => {
    return authService.isEmailRegistered(email)
  }, [])

  const initiateSignUpVerification = useCallback(
    async (payload: SignUpPayload): Promise<VerificationResponse> => {
      setIsLoading(true)
      try {
        return await authService.initiateSignUpVerification(payload)
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const resendSignUpVerificationCode = useCallback(
    async (email: string): Promise<VerificationResponse> => {
      setIsLoading(true)
      try {
        return await authService.resendSignUpVerificationCode(email)
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const verifySignUpCodeAndRegister = useCallback(
    async (email: string, code: string): Promise<AuthResponse> => {
      setIsLoading(true)
      try {
        const res = await authService.verifySignUpCodeAndRegister(email, code)
        if (res.success && res.user) {
          setUser(res.user)
          setIsAuthModalOpen(false)
        }
        return res
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const resetPassword = useCallback(
    async (email: string, newPass: string): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true)
      try {
        return await authService.resetPassword(email, newPass)
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  const updateUser = useCallback((updatedData: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return null
      const updated: AuthUser = {
        ...prev,
        ...updatedData,
      }
      authService.saveSession(updated)
      return updated
    })
  }, [])

  const logout = useCallback(() => {
    authService.signOut()
    setUser(null)
  }, [])

  const openAuthModal = useCallback(
    (
      mode: 'signin' | 'signup' | 'forgot' = 'signin',
      redirectUrl?: string,
      message?: string
    ) => {
      setAuthModalMode(mode)
      if (redirectUrl) {
        setRedirectAfterAuth(redirectUrl)
      }
      setAuthModalMessage(message || null)
      setIsAuthModalOpen(true)
    },
    []
  )

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false)
    setAuthModalMessage(null)
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        loginWithPersona,
        signUp,
        checkEmailStatus,
        isEmailRegistered,
        initiateSignUpVerification,
        resendSignUpVerificationCode,
        verifySignUpCodeAndRegister,
        resetPassword,
        updateUser,
        logout,
        isAuthModalOpen,
        authModalMode,
        authModalMessage,
        openAuthModal,
        closeAuthModal,
        redirectAfterAuth,
        setRedirectAfterAuth,
        rememberedEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
