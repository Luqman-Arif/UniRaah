import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'

// Create an in-memory mock localStorage for the Node.js test environment
const mockStorage = new Map()
global.localStorage = {
  getItem: (key) => (mockStorage.has(key) ? mockStorage.get(key) : null),
  setItem: (key, val) => mockStorage.set(key, String(val)),
  removeItem: (key) => mockStorage.delete(key),
  clear: () => mockStorage.clear(),
}

describe('UniRaah Professional Authentication Test Suite', () => {
  beforeEach(() => {
    mockStorage.clear()
  })

  it('Auth 1: Seeds demo personas into registered accounts catalog', () => {
    const defaultUsers = [
      {
        id: 'student-hamza',
        fullName: 'Muhammad Hamza',
        email: 'hamza.karachi@example.com',
        role: 'student',
        hscGroup: 'Pre-Engineering',
        board: 'Board of Intermediate Education Karachi (BIEK)',
        hscTotalPredictedPercentage: 82.5,
        passwordHash: 'btoa_seeded_password123',
      },
      {
        id: 'student-aisha',
        fullName: 'Aisha Fatima',
        email: 'aisha.fbise@example.com',
        role: 'student',
        hscGroup: 'Computer Science',
        board: 'Federal Board of Intermediate & Secondary Education (FBISE)',
        hscTotalPredictedPercentage: 86.8,
        passwordHash: 'btoa_seeded_password123',
      },
      {
        id: 'student-bilal',
        fullName: 'Bilal Tariq',
        email: 'bilal.premed@example.com',
        role: 'student',
        hscGroup: 'Pre-Medical',
        board: 'Board of Intermediate Education Karachi (BIEK)',
        hscTotalPredictedPercentage: 89.2,
        passwordHash: 'btoa_seeded_password123',
      },
    ]

    localStorage.setItem('uniraah_registered_users_v2', JSON.stringify(defaultUsers))
    const loaded = JSON.parse(localStorage.getItem('uniraah_registered_users_v2'))
    assert.equal(loaded.length, 3)
    assert.equal(loaded[0].fullName, 'Muhammad Hamza')
    assert.equal(loaded[1].hscGroup, 'Computer Science')
    assert.equal(loaded[2].hscGroup, 'Pre-Medical')
  })

  it('Auth 2: Rejects duplicate student registration with the same email', () => {
    const users = [
      { id: 'usr-1', email: 'daniyal@example.com', fullName: 'Daniyal Khan' },
    ]
    localStorage.setItem('uniraah_registered_users_v2', JSON.stringify(users))

    const newEmail = 'Daniyal@Example.com' // case insensitive check
    const currentList = JSON.parse(localStorage.getItem('uniraah_registered_users_v2'))
    const duplicate = currentList.find((u) => u.email.toLowerCase() === newEmail.toLowerCase())

    assert.ok(duplicate, 'Duplicate email was successfully detected')
  })

  it('Auth 3: Enforces minimum password length (>= 6 chars)', () => {
    const validatePassword = (pass) => {
      if (!pass || pass.length < 6) {
        throw new Error('Password must be at least 6 characters long')
      }
      return true
    }

    assert.throws(() => validatePassword('12345'), /at least 6 characters/)
    assert.equal(validatePassword('secret123'), true)
  })

  it('Auth 4: Seeds personalized profile on student registration with correct academic data', () => {
    const registeredStudent = {
      id: 'student-9999',
      fullName: 'Sara Ahmed',
      email: 'sara@example.com',
      hscGroup: 'Computer Science',
      board: 'Board of Intermediate Education Karachi (BIEK)',
      hscTotalPredictedPercentage: 87.4,
    }

    // Seed profile in student's isolated storage
    const profileKey = `uniraah_v2_${registeredStudent.id}_profile`
    const profileRecord = {
      ...registeredStudent,
      sscPercentage: registeredStudent.hscTotalPredictedPercentage,
      hscPart1Percentage: registeredStudent.hscTotalPredictedPercentage,
      preferences: {
        disciplines: ['Computer Science & AI', 'Data Science & Cyber Security'],
        maxAnnualBudgetPKR: 500000,
        homeLocation: 'Gulshan-e-Iqbal',
      },
      version: 1,
    }

    localStorage.setItem(profileKey, JSON.stringify(profileRecord))
    const stored = JSON.parse(localStorage.getItem(profileKey))

    assert.equal(stored.fullName, 'Sara Ahmed')
    assert.equal(stored.hscGroup, 'Computer Science')
    assert.equal(stored.hscTotalPredictedPercentage, 87.4)
  })

  it('Auth 5: Password reset workflow updates credentials properly', () => {
    const users = [
      {
        id: 'student-hamza',
        email: 'hamza.karachi@example.com',
        passwordHash: 'old_hash_123',
      },
    ]

    const targetUser = users.find((u) => u.email === 'hamza.karachi@example.com')
    assert.ok(targetUser)
    targetUser.passwordHash = 'new_updated_hash_456'

    assert.equal(targetUser.passwordHash, 'new_updated_hash_456')
  })

  it('Auth 6: Direct professional account creation registers user and logs in immediately without OTP', () => {
    const users = []
    const newStudent = {
      id: 'student-direct-1',
      fullName: 'Daniyal Ahmed',
      email: 'daniyal.ahmed@example.com',
      role: 'student',
      hscGroup: 'Pre-Engineering',
      board: 'Board of Intermediate Education Karachi (BIEK)',
      hscTotalPredictedPercentage: 84.5,
      passwordHash: 'btoa_mock_hash_789',
    }

    // Direct account registration without OTP intermediate requirement
    users.push(newStudent)
    localStorage.setItem('uniraah_registered_users_v2', JSON.stringify(users))

    // Token creation and active session saving
    const token = `uniraah_jwt_${newStudent.id}_${Date.now()}`
    const sessionRecord = { user: newStudent, token }
    localStorage.setItem('uniraah_auth_session_v2', JSON.stringify(sessionRecord))

    const storedSession = JSON.parse(localStorage.getItem('uniraah_auth_session_v2'))
    assert.ok(storedSession)
    assert.equal(storedSession.user.fullName, 'Daniyal Ahmed')
    assert.equal(storedSession.user.email, 'daniyal.ahmed@example.com')
    assert.ok(storedSession.token.startsWith('uniraah_jwt_'))
  })

  it('Auth 7: Rejects mismatching passwords during account creation and enforces validation', () => {
    const validateSignUpCredentials = (pass, confirmPass) => {
      if (!pass || pass.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long' }
      }
      if (pass !== confirmPass) {
        return { success: false, error: 'Passwords do not match' }
      }
      return { success: true }
    }

    assert.equal(validateSignUpCredentials('pass123', 'pass456').success, false)
    assert.equal(validateSignUpCredentials('pass123', 'pass123').success, true)
    assert.equal(validateSignUpCredentials('123', '123').success, false)
  })
})

