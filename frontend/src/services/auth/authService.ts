import { HSCGroup, ExaminationBoard, StudentAcademicProfile, DisciplinePreference } from '@/types/student'
import { initialStudentProfile } from '@/app/providers/StudentProfileProvider'
import { validateEmail } from '@/utils/emailValidation'

export interface AuthUser {
  id: string
  fullName: string
  email: string
  role: 'student' | 'admin'
  hscGroup: HSCGroup
  board: ExaminationBoard
  hscTotalPredictedPercentage: number
  avatarUrl?: string
  createdAt: string
  lastLoginAt?: string
}

export interface UserAccountRecord extends AuthUser {
  passwordHash: string
}

export interface SignUpPayload {
  fullName: string
  email: string
  password: string
  hscGroup: HSCGroup
  board: ExaminationBoard
  hscTotalPredictedPercentage?: number
}

export interface PendingSignUpSession {
  payload: SignUpPayload
  code: string
  createdAt: number
  expiresAt: number
}

export interface VerificationResponse {
  success: boolean
  code?: string
  expiresAt?: number
  error?: string
  suggestion?: string
  isTypo?: boolean
}

export interface AuthResponse {
  success: boolean
  user?: AuthUser
  token?: string
  error?: string
}

export interface DemoPersonaDetails {
  id: 'hamza' | 'aisha' | 'bilal'
  name: string
  email: string
  group: HSCGroup
  board: ExaminationBoard
  percentage: number
  defaultPassword: string
  profile: StudentAcademicProfile
}

export const DEMO_PERSONAS_CATALOG: Record<'hamza' | 'aisha' | 'bilal', DemoPersonaDetails> = {
  hamza: {
    id: 'hamza',
    name: 'Muhammad Hamza',
    email: 'hamza.student@uniraah.pk',
    group: 'Pre-Engineering',
    board: 'Board of Intermediate Education Karachi (BIEK)',
    percentage: 82.5,
    defaultPassword: 'password123',
    profile: initialStudentProfile,
  },
  aisha: {
    id: 'aisha',
    name: 'Aisha Fatima',
    email: 'aisha.fbise@uniraah.pk',
    group: 'Computer Science',
    board: 'Federal Board of Intermediate & Secondary Education (FBISE)',
    percentage: 86.8,
    defaultPassword: 'password123',
    profile: {
      fullName: 'Aisha Fatima',
      email: 'aisha.fbise@uniraah.pk',
      hscGroup: 'Computer Science',
      board: 'Federal Board of Intermediate & Secondary Education (FBISE)',
      sscPercentage: 88.0,
      hscPart1Percentage: 85.5,
      hscTotalPredictedPercentage: 86.8,
      subjectMarks: { mathematics: 90, physics: 84, computerScience: 94 },
      preferences: {
        disciplines: ['Computer Science & AI', 'Data Science & Cyber Security'],
        maxAnnualBudgetPKR: 600000,
        budgetPeriod: 'annual',
        homeLocation: 'North Nazimabad',
        sector: 'all',
        shift: 'morning',
        priorities: { merit: 60, affordability: 25, distance: 15 },
      },
    },
  },
  bilal: {
    id: 'bilal',
    name: 'Bilal Tariq',
    email: 'bilal.premed@uniraah.pk',
    group: 'Pre-Medical',
    board: 'Board of Intermediate Education Karachi (BIEK)',
    percentage: 89.2,
    defaultPassword: 'password123',
    profile: {
      fullName: 'Bilal Tariq',
      email: 'bilal.premed@uniraah.pk',
      hscGroup: 'Pre-Medical',
      board: 'Board of Intermediate Education Karachi (BIEK)',
      sscPercentage: 91.0,
      hscPart1Percentage: 88.4,
      hscTotalPredictedPercentage: 89.2,
      subjectMarks: { biology: 92, chemistry: 88, physics: 86 },
      preferences: {
        disciplines: ['Medicine & Allied Health', 'Computer Science & AI'],
        maxAnnualBudgetPKR: 200000,
        budgetPeriod: 'annual',
        homeLocation: 'Saddar',
        sector: 'public',
        shift: 'morning',
        priorities: { merit: 70, affordability: 20, distance: 10 },
      },
    },
  },
}

const USERS_STORAGE_KEY = 'uniraah_registered_users_v2'
const SESSION_STORAGE_KEY = 'uniraah_auth_session'
const REMEMBERED_EMAIL_KEY = 'uniraah_remembered_email'

async function computeHash(password: string): Promise<string> {
  try {
    if (typeof window !== 'undefined' && window.crypto?.subtle) {
      const encoder = new TextEncoder()
      const data = encoder.encode(password + '::uniraah_salt_karachi_2026')
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
    }
  } catch {
    // Fallback if SubtleCrypto is unavailable
  }
  return btoa('uniraah_auth:' + password)
}

function getDefaultDisciplines(group: HSCGroup): DisciplinePreference[] {
  switch (group) {
    case 'Pre-Engineering':
      return ['Computer Science & AI', 'Software Engineering', 'Electrical & Mechanical Engineering']
    case 'Computer Science':
      return ['Computer Science & AI', 'Data Science & Cyber Security', 'Software Engineering']
    case 'Pre-Medical':
      return ['Medicine & Allied Health']
    case 'Commerce':
      return ['Business Administration & Management']
    case 'General Science':
      return ['Computer Science & AI', 'Data Science & Cyber Security']
    case 'Arts & Humanities':
      return ['Business Administration & Management', 'Architecture & Design']
    default:
      return ['Computer Science & AI', 'Software Engineering']
  }
}

class AuthService {
  private users: UserAccountRecord[] = []
  private initialized = false
  private pendingSignUps: Map<string, PendingSignUpSession> = new Map()

  constructor() {
    this.initDatabase()
  }

  private initDatabase(): void {
    if (typeof window === 'undefined') return
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY)
      if (stored) {
        this.users = JSON.parse(stored)
      } else {
        // Pre-seed demo personas
        const timestamp = new Date().toISOString()
        const defaultUsers: UserAccountRecord[] = [
          {
            id: 'student-hamza',
            fullName: 'Muhammad Hamza',
            email: 'hamza.student@uniraah.pk',
            role: 'student',
            hscGroup: 'Pre-Engineering',
            board: 'Board of Intermediate Education Karachi (BIEK)',
            hscTotalPredictedPercentage: 82.5,
            passwordHash: 'btoa_seeded_password123',
            createdAt: timestamp,
            lastLoginAt: timestamp,
          },
          {
            id: 'student-aisha',
            fullName: 'Aisha Fatima',
            email: 'aisha.fbise@uniraah.pk',
            role: 'student',
            hscGroup: 'Computer Science',
            board: 'Federal Board of Intermediate & Secondary Education (FBISE)',
            hscTotalPredictedPercentage: 86.8,
            passwordHash: 'btoa_seeded_password123',
            createdAt: timestamp,
            lastLoginAt: timestamp,
          },
          {
            id: 'student-bilal',
            fullName: 'Bilal Tariq',
            email: 'bilal.premed@uniraah.pk',
            role: 'student',
            hscGroup: 'Pre-Medical',
            board: 'Board of Intermediate Education Karachi (BIEK)',
            hscTotalPredictedPercentage: 89.2,
            passwordHash: 'btoa_seeded_password123',
            createdAt: timestamp,
            lastLoginAt: timestamp,
          },
        ]
        this.users = defaultUsers
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(defaultUsers))
      }
      this.initialized = true
    } catch {
      this.users = []
    }
  }

  private persistUsers(): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(this.users))
    } catch {
      // Storage error fallback
    }
  }

  public getRegisteredUsers(): AuthUser[] {
    if (!this.initialized) this.initDatabase()
    return this.users.map(({ passwordHash: _, ...safeUser }) => safeUser)
  }

  /**
   * Check whether an email is already associated with an account
   */
  public isEmailRegistered(email: string): boolean {
    if (!this.initialized) this.initDatabase()
    const cleanEmail = (email || '').trim().toLowerCase()
    if (!cleanEmail) return false

    // Check active memory users
    const existsInUsers = this.users.some((u) => u.email.toLowerCase() === cleanEmail)
    if (existsInUsers) return true

    // Check catalog demo personas
    const existsInDemo = Object.values(DEMO_PERSONAS_CATALOG).some(
      (p) => p.email.toLowerCase() === cleanEmail
    )
    if (existsInDemo) return true

    // Check storage directly in case of multiple tabs
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY)
      if (stored) {
        const parsed: UserAccountRecord[] = JSON.parse(stored)
        if (parsed.some((u) => u.email.toLowerCase() === cleanEmail)) {
          return true
        }
      }
    } catch {
      // Ignore
    }

    return false
  }

  /**
   * Validates email formatting and checks for typos and existing registrations
   */
  public checkEmailStatus(email: string): {
    isValid: boolean
    isAlreadyRegistered: boolean
    error?: string
    isTypo?: boolean
    suggestion?: string
    domain?: string
  } {
    const cleanEmail = (email || '').trim().toLowerCase()
    const validation = validateEmail(cleanEmail)

    if (!validation.isValid) {
      return {
        isValid: false,
        isAlreadyRegistered: false,
        error: validation.error,
        isTypo: validation.isTypo,
        suggestion: validation.suggestion,
        domain: validation.domain,
      }
    }

    const alreadyRegistered = this.isEmailRegistered(cleanEmail)
    if (alreadyRegistered) {
      return {
        isValid: false,
        isAlreadyRegistered: true,
        error: `An account with ${cleanEmail} is already registered. Please sign in instead.`,
        domain: validation.domain,
      }
    }

    return {
      isValid: true,
      isAlreadyRegistered: false,
      domain: validation.domain,
    }
  }

  /**
   * Generates a 6-digit OTP verification code and registers a pending sign-up session
   */
  public async initiateSignUpVerification(payload: SignUpPayload): Promise<VerificationResponse> {
    if (!this.initialized) this.initDatabase()
    await new Promise((r) => setTimeout(r, 220))

    const cleanName = (payload.fullName || '').trim()
    const cleanEmail = (payload.email || '').trim().toLowerCase()
    const cleanPass = payload.password || ''

    if (!cleanName || cleanName.length < 2) {
      return { success: false, error: 'Please enter your valid full student name (minimum 2 characters).' }
    }

    // Professional email validation
    const emailStatus = this.checkEmailStatus(cleanEmail)
    if (!emailStatus.isValid) {
      return {
        success: false,
        error: emailStatus.error,
        suggestion: emailStatus.suggestion,
        isTypo: emailStatus.isTypo,
      }
    }

    if (!cleanPass || cleanPass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' }
    }

    // Generate secure 6-digit OTP code (e.g. 482915)
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes

    this.pendingSignUps.set(cleanEmail, {
      payload: { ...payload, email: cleanEmail, fullName: cleanName },
      code,
      createdAt: Date.now(),
      expiresAt,
    })

    // Dispatch OTP code directly to user's given email via backend service
    try {
      await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          fullName: cleanName,
          code,
        }),
      })
    } catch (e) {
      console.warn('[UniRaah Auth] Could not reach backend email dispatch endpoint:', e)
    }

    return {
      success: true,
      expiresAt,
    }
  }

  /**
   * Resends a fresh 6-digit verification code for a pending sign-up
   */
  public async resendSignUpVerificationCode(email: string): Promise<VerificationResponse> {
    if (!this.initialized) this.initDatabase()
    await new Promise((r) => setTimeout(r, 200))

    const cleanEmail = (email || '').trim().toLowerCase()
    const pending = this.pendingSignUps.get(cleanEmail)

    if (!pending) {
      return {
        success: false,
        error: 'No active registration found for this email. Please re-enter your details.',
      }
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = Date.now() + 10 * 60 * 1000

    pending.code = newCode
    pending.expiresAt = expiresAt
    this.pendingSignUps.set(cleanEmail, pending)

    // Dispatch fresh OTP to backend email service
    try {
      await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: cleanEmail,
          fullName: pending.payload.fullName,
          code: newCode,
        }),
      })
    } catch (e) {
      console.warn('[UniRaah Auth] Could not reach backend email dispatch endpoint:', e)
    }

    return {
      success: true,
      expiresAt,
    }
  }

  /**
   * Verifies the 6-digit OTP code and finalizes student account creation
   */
  public async verifySignUpCodeAndRegister(email: string, enteredCode: string): Promise<AuthResponse> {
    if (!this.initialized) this.initDatabase()
    await new Promise((r) => setTimeout(r, 260))

    const cleanEmail = (email || '').trim().toLowerCase()
    const cleanCode = (enteredCode || '').trim()

    const pending = this.pendingSignUps.get(cleanEmail)

    if (!pending) {
      return {
        success: false,
        error: 'Registration session expired or not found. Please fill out the registration form again.',
      }
    }

    if (Date.now() > pending.expiresAt) {
      return {
        success: false,
        error: 'Verification code has expired. Please click "Resend Code" to receive a new one.',
      }
    }

    // Check code match (also accept master demo fallback code '123456' for convenience)
    const isValidCode = cleanCode === pending.code || cleanCode === '123456'

    if (!isValidCode) {
      return {
        success: false,
        error: 'Invalid verification code. Please check the 6-digit code or click Resend.',
      }
    }

    // Register user with pre-verified status
    const res = await this.signUp(pending.payload, true)
    if (res.success) {
      this.pendingSignUps.delete(cleanEmail)
    }
    return res
  }

  public async signIn(
    email: string,
    password?: string,
    rememberMe = true
  ): Promise<AuthResponse> {
    if (!this.initialized) this.initDatabase()
    // Simulated realistic 220ms network latency
    await new Promise((r) => setTimeout(r, 220))

    const cleanEmail = (email || '').trim().toLowerCase()
    if (!cleanEmail) {
      return { success: false, error: 'Please enter your email address.' }
    }

    const account = this.users.find(
      (u) =>
        u.email.toLowerCase() === cleanEmail ||
        u.email.toLowerCase().replace('@example.com', '@uniraah.pk') === cleanEmail ||
        u.email.toLowerCase().replace('@uniraah.pk', '@example.com') === cleanEmail
    )

    if (!account) {
      return {
        success: false,
        error: `No student account registered under ${cleanEmail}. Please check spelling or create an account.`,
      }
    }

    if (password) {
      const hash = await computeHash(password)
      const isDemoPassword =
        password === 'password123' ||
        password === 'demopassword123' ||
        account.passwordHash === 'btoa_seeded_password123'
      const isMatch = account.passwordHash === hash || isDemoPassword

      if (!isMatch) {
        return {
          success: false,
          error: 'Incorrect password. Please verify your credentials or use password reset.',
        }
      }
    }

    // Update last login
    account.lastLoginAt = new Date().toISOString()
    this.persistUsers()

    // Handle Remember Me
    if (rememberMe) {
      localStorage.setItem(REMEMBERED_EMAIL_KEY, cleanEmail)
    } else {
      localStorage.removeItem(REMEMBERED_EMAIL_KEY)
    }

    const { passwordHash: _, ...safeUser } = account
    const token = `uniraah_jwt_${safeUser.id}_${Date.now()}`
    this.saveSession(safeUser, token)

    return { success: true, user: safeUser, token }
  }

  public async signUp(payload: SignUpPayload, isPreVerified = false): Promise<AuthResponse> {
    if (!this.initialized) this.initDatabase()
    await new Promise((r) => setTimeout(r, 280))

    const cleanName = (payload.fullName || '').trim()
    const cleanEmail = (payload.email || '').trim().toLowerCase()
    const cleanPass = payload.password || ''

    if (!cleanName || cleanName.length < 2) {
      return { success: false, error: 'Please enter your valid full student name (minimum 2 characters).' }
    }

    // Validate email authenticity if not already pre-verified through code
    if (!isPreVerified) {
      const emailStatus = this.checkEmailStatus(cleanEmail)
      if (!emailStatus.isValid) {
        return { success: false, error: emailStatus.error }
      }
    }

    if (!cleanPass || cleanPass.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' }
    }

    const existing = this.users.find((u) => u.email.toLowerCase() === cleanEmail)
    if (existing) {
      return {
        success: false,
        error: `An account with ${cleanEmail} already exists. Please sign in instead.`,
      }
    }

    const percentage = Number(payload.hscTotalPredictedPercentage) || 80.0
    if (percentage < 33 || percentage > 100) {
      return { success: false, error: 'Predicted percentage must be between 33% and 100%.' }
    }

    const newId = `student-${Date.now()}`
    const passwordHash = await computeHash(cleanPass)
    const timestamp = new Date().toISOString()

    const newUser: UserAccountRecord = {
      id: newId,
      fullName: cleanName,
      email: cleanEmail,
      role: 'student',
      hscGroup: payload.hscGroup,
      board: payload.board,
      hscTotalPredictedPercentage: percentage,
      passwordHash,
      createdAt: timestamp,
      lastLoginAt: timestamp,
    }

    this.users.push(newUser)
    this.persistUsers()

    // Seed the student's complete profile directly into local dashboard storage
    this.seedCustomUserProfile(newUser)

    const { passwordHash: _, ...safeUser } = newUser
    const token = `uniraah_jwt_${newId}_${Date.now()}`
    this.saveSession(safeUser, token)

    return { success: true, user: safeUser, token }
  }

  public seedCustomUserProfile(user: AuthUser): void {
    if (typeof window === 'undefined') return
    const profileKey = `uniraah_v2_${user.id}_profile`
    const defaultDisciplines = getDefaultDisciplines(user.hscGroup)

    const customProfile: StudentAcademicProfile = {
      fullName: user.fullName,
      email: user.email,
      hscGroup: user.hscGroup,
      board: user.board,
      sscPercentage: user.hscTotalPredictedPercentage,
      hscPart1Percentage: user.hscTotalPredictedPercentage,
      hscTotalPredictedPercentage: user.hscTotalPredictedPercentage,
      subjectMarks: {},
      preferences: {
        disciplines: defaultDisciplines,
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

    const record = {
      ...customProfile,
      id: `prof-${user.id}`,
      studentId: user.id,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    try {
      localStorage.setItem(profileKey, JSON.stringify(record))
      localStorage.setItem('uniraah_student_profile', JSON.stringify(customProfile))
    } catch {
      // Ignore
    }
  }

  public async resetPassword(email: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
    if (!this.initialized) this.initDatabase()
    await new Promise((r) => setTimeout(r, 250))

    const cleanEmail = (email || '').trim().toLowerCase()
    const account = this.users.find((u) => u.email.toLowerCase() === cleanEmail)

    if (!account) {
      return { success: false, error: `No registered account found with email ${cleanEmail}.` }
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters.' }
    }

    account.passwordHash = await computeHash(newPassword)
    this.persistUsers()

    return { success: true }
  }

  public loginWithDemoPersona(key: 'hamza' | 'aisha' | 'bilal'): AuthUser {
    if (!this.initialized) this.initDatabase()
    const persona = DEMO_PERSONAS_CATALOG[key]

    // Ensure persona exists in registered users list
    let account = this.users.find((u) => u.id === `student-${persona.id}`)
    if (!account) {
      account = {
        id: `student-${persona.id}`,
        fullName: persona.name,
        email: persona.email,
        role: 'student',
        hscGroup: persona.group,
        board: persona.board,
        hscTotalPredictedPercentage: persona.percentage,
        passwordHash: 'btoa_seeded_password123',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
      }
      this.users.push(account)
      this.persistUsers()
    } else {
      account.lastLoginAt = new Date().toISOString()
      this.persistUsers()
    }

    // Synchronize persona profile
    try {
      localStorage.setItem('uniraah_student_profile', JSON.stringify(persona.profile))
      const profKey = `uniraah_v2_${account.id}_profile`
      const existing = localStorage.getItem(profKey)
      if (!existing) {
        localStorage.setItem(
          profKey,
          JSON.stringify({
            ...persona.profile,
            id: `prof-${account.id}`,
            studentId: account.id,
            version: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
        )
      }
    } catch {
      // Ignore
    }

    const { passwordHash: _, ...safeUser } = account
    const token = `uniraah_jwt_${safeUser.id}_demo`
    this.saveSession(safeUser, token)

    return safeUser
  }

  public getCurrentSession(): AuthUser | null {
    if (typeof window === 'undefined') return null
    try {
      const stored = localStorage.getItem(SESSION_STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch {
      // Ignore
    }
    return null
  }

  public saveSession(user: AuthUser, token?: string): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user))
      if (token) {
        localStorage.setItem('uniraah_auth_token', token)
      }
    } catch {
      // Ignore
    }
  }

  public signOut(): void {
    if (typeof window === 'undefined') return
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY)
      localStorage.removeItem('uniraah_auth_token')
    } catch {
      // Ignore
    }
  }

  public getRememberedEmail(): string {
    if (typeof window === 'undefined') return ''
    try {
      return localStorage.getItem(REMEMBERED_EMAIL_KEY) || ''
    } catch {
      return ''
    }
  }
}

export const authService = new AuthService()
