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

// In-memory implementation of the PrototypeDashboardAdapter logic for headless unit testing
class TestDashboardAdapter {
  constructor() {
    this.validProgrammes = ['ned-cs', 'fast-cs', 'ku-cs', 'iba-cs', 'duhs-mbbs']
    this.validUniversities = ['ned-uet', 'fast-nuces', 'ku-uok', 'iba-karachi', 'duhs-karachi']
  }

  checkAuthorization(studentId, authUserId) {
    if (!authUserId) {
      const err = new Error('Unauthorized: Authentication required.')
      err.statusCode = 401
      throw err
    }
    if (authUserId !== studentId) {
      const err = new Error(`Forbidden: Student '${authUserId}' cannot access records of '${studentId}'`)
      err.statusCode = 403
      throw err
    }
  }

  getProfile(studentId, authUserId) {
    this.checkAuthorization(studentId, authUserId)
    const key = `uniraah_v2_${studentId}_profile`
    const raw = localStorage.getItem(key)
    if (!raw) {
      const initial = {
        studentId,
        fullName: 'Muhammad Hamza',
        email: 'hamza.karachi@example.com',
        hscGroup: 'Pre-Engineering',
        board: 'Board of Intermediate Education Karachi (BIEK)',
        sscPercentage: 84.5,
        hscPart1Percentage: 81.2,
        hscTotalPredictedPercentage: 82.5,
        preferences: {
          disciplines: ['Computer Science & AI'],
          maxAnnualBudgetPKR: 500000,
          homeLocation: 'Gulshan-e-Iqbal',
        },
        version: 1,
      }
      localStorage.setItem(key, JSON.stringify(initial))
      return initial
    }
    return JSON.parse(raw)
  }

  updateProfile(studentId, authUserId, updates, expectedVersion) {
    this.checkAuthorization(studentId, authUserId)
    const current = this.getProfile(studentId, authUserId)

    if (expectedVersion !== undefined && current.version !== expectedVersion) {
      const err = new Error('Optimistic Lock Conflict: Record was modified by another transaction.')
      err.statusCode = 409
      throw err
    }

    if (updates.fullName !== undefined && (!updates.fullName.trim() || updates.fullName.trim().length < 2)) {
      const err = new Error('Invalid fullName: Must be at least 2 characters.')
      err.statusCode = 422
      throw err
    }

    if (updates.email !== undefined && (!updates.email.trim() || !updates.email.includes('@'))) {
      const err = new Error('Invalid email: Must be a valid email address.')
      err.statusCode = 422
      throw err
    }

    if (updates.sscPercentage !== undefined && (updates.sscPercentage < 33 || updates.sscPercentage > 100)) {
      const err = new Error('Invalid SSC percentage: Must be between 33 and 100.')
      err.statusCode = 422
      throw err
    }

    if (updates.hscPart1Percentage !== undefined && (updates.hscPart1Percentage < 33 || updates.hscPart1Percentage > 100)) {
      const err = new Error('Invalid HSC percentage: Must be between 33 and 100.')
      err.statusCode = 422
      throw err
    }

    if (updates.preferences?.maxAnnualBudgetPKR !== undefined && updates.preferences.maxAnnualBudgetPKR < 10000) {
      const err = new Error('Invalid budget: Must be at least 10,000 PKR.')
      err.statusCode = 422
      throw err
    }

    const next = {
      ...current,
      ...updates,
      version: current.version + 1,
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem(`uniraah_v2_${studentId}_profile`, JSON.stringify(next))
    return next
  }

  getSavedProgrammes(studentId, authUserId) {
    this.checkAuthorization(studentId, authUserId)
    const key = `uniraah_v2_${studentId}_saved_progs`
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  }

  saveProgramme(studentId, authUserId, programmeId) {
    this.checkAuthorization(studentId, authUserId)
    if (!this.validProgrammes.includes(programmeId)) {
      const err = new Error(`Foreign Key Violation: Programme '${programmeId}' not in catalog`)
      err.statusCode = 422
      throw err
    }

    const key = `uniraah_v2_${studentId}_saved_progs`
    const raw = localStorage.getItem(key)
    const list = raw ? JSON.parse(raw) : []

    if (list.includes(programmeId)) {
      const err = new Error('Duplicate entry: Programme already saved')
      err.statusCode = 409
      throw err
    }

    const updated = [programmeId, ...list]
    localStorage.setItem(key, JSON.stringify(updated))
    return { programmeId, studentId, savedAt: new Date().toISOString() }
  }

  removeSavedProgramme(studentId, authUserId, programmeId) {
    this.checkAuthorization(studentId, authUserId)
    const key = `uniraah_v2_${studentId}_saved_progs`
    const raw = localStorage.getItem(key)
    const list = raw ? JSON.parse(raw) : []

    const updated = list.filter((id) => id !== programmeId)
    localStorage.setItem(key, JSON.stringify(updated))
    return true
  }

  getSavedUniversities(studentId, authUserId) {
    this.checkAuthorization(studentId, authUserId)
    const key = `uniraah_v2_${studentId}_saved_unis`
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  }

  saveUniversity(studentId, authUserId, universityId) {
    this.checkAuthorization(studentId, authUserId)
    if (!this.validUniversities.includes(universityId)) {
      const err = new Error(`Foreign Key Violation: University '${universityId}' not in catalog`)
      err.statusCode = 422
      throw err
    }

    const key = `uniraah_v2_${studentId}_saved_unis`
    const raw = localStorage.getItem(key)
    const list = raw ? JSON.parse(raw) : []

    if (list.includes(universityId)) {
      const err = new Error('Duplicate entry: University already bookmarked')
      err.statusCode = 409
      throw err
    }

    const updated = [universityId, ...list]
    localStorage.setItem(key, JSON.stringify(updated))
    return { universityId, studentId, savedAt: new Date().toISOString() }
  }

  removeSavedUniversity(studentId, authUserId, universityId) {
    this.checkAuthorization(studentId, authUserId)
    const key = `uniraah_v2_${studentId}_saved_unis`
    const raw = localStorage.getItem(key)
    const list = raw ? JSON.parse(raw) : []

    const updated = list.filter((id) => id !== universityId)
    localStorage.setItem(key, JSON.stringify(updated))
    return true
  }

  updateComparison(studentId, authUserId, programmeIds) {
    this.checkAuthorization(studentId, authUserId)
    const bounded = Array.from(new Set(programmeIds)).slice(0, 4)
    for (const pid of bounded) {
      if (!this.validProgrammes.includes(pid)) {
        const err = new Error(`Foreign Key Violation: Programme '${pid}' not in catalog`)
        err.statusCode = 422
        throw err
      }
    }
    localStorage.setItem(`uniraah_v2_${studentId}_compare`, JSON.stringify(bounded))
    return bounded
  }

  getRecommendationSessions(studentId, authUserId) {
    this.checkAuthorization(studentId, authUserId)
    const key = `uniraah_v2_${studentId}_sessions`
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : []
  }

  saveRecommendationSession(studentId, authUserId, session) {
    this.checkAuthorization(studentId, authUserId)
    const key = `uniraah_v2_${studentId}_sessions`
    const raw = localStorage.getItem(key)
    const current = raw ? JSON.parse(raw) : []

    const record = {
      ...session,
      id: `recsess-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      studentId,
      createdAt: new Date().toISOString(),
    }
    // Prepend new session and maintain chronological history
    const updated = [record, ...current].slice(0, 10)
    localStorage.setItem(key, JSON.stringify(updated))
    return record
  }
}

describe('UniRaah Student Dashboard Comprehensive QA & Persistence Test Suite', () => {
  let adapter

  beforeEach(() => {
    mockStorage.clear()
    adapter = new TestDashboardAdapter()
  })

  describe('1 & 4. Student Profile Loading, Editing & Session Persistence', () => {
    beforeEach(() => {
      mockStorage.clear()
      adapter = new TestDashboardAdapter()
    })

    it('Workflow 1: allows student to open dashboard and load correct profile', () => {
      const profile = adapter.getProfile('student-hamza', 'student-hamza')
      assert.equal(profile.fullName, 'Muhammad Hamza')
      assert.equal(profile.hscGroup, 'Pre-Engineering')
      assert.equal(profile.version, 1)
    })

    it('Workflow 2: saves valid profile changes and increments version', () => {
      const updated = adapter.updateProfile(
        'student-hamza',
        'student-hamza',
        {
          fullName: 'Muhammad Hamza Khan',
          preferences: { maxAnnualBudgetPKR: 650000, homeLocation: 'North Nazimabad' },
        },
        1
      )
      assert.equal(updated.fullName, 'Muhammad Hamza Khan')
      assert.equal(updated.preferences.maxAnnualBudgetPKR, 650000)
      assert.equal(updated.version, 2)
    })

    it('Workflow 4: persisted profile remains identical after simulated page refresh', () => {
      const v1 = adapter.getProfile('student-hamza', 'student-hamza')
      adapter.updateProfile('student-hamza', 'student-hamza', { hscTotalPredictedPercentage: 86.5 }, v1.version)
      // Simulate new session/mount
      const freshAdapter = new TestDashboardAdapter()
      const loaded = freshAdapter.getProfile('student-hamza', 'student-hamza')
      assert.equal(loaded.hscTotalPredictedPercentage, 86.5)
      assert.equal(loaded.version, 2)
    })
  })

  describe('3. Validation Errors for Invalid Inputs', () => {
    beforeEach(() => {
      mockStorage.clear()
      adapter = new TestDashboardAdapter()
    })
    it('Workflow 3a: rejects marks < 33 with 422 Validation Error', () => {
      assert.throws(
        () => adapter.updateProfile('student-hamza', 'student-hamza', { sscPercentage: 20 }, 1),
        (err) => err.statusCode === 422
      )
    })

    it('Workflow 3b: rejects marks > 100 with 422 Validation Error', () => {
      assert.throws(
        () => adapter.updateProfile('student-hamza', 'student-hamza', { hscPart1Percentage: 105 }, 1),
        (err) => err.statusCode === 422
      )
    })

    it('Workflow 3c: rejects annual budget < 10,000 PKR with 422 Validation Error', () => {
      assert.throws(
        () => adapter.updateProfile('student-hamza', 'student-hamza', { preferences: { maxAnnualBudgetPKR: 500 } }, 1),
        (err) => err.statusCode === 422
      )
    })

    it('Workflow 3d: rejects missing or too short full name (<2 chars)', () => {
      assert.throws(
        () => adapter.updateProfile('student-hamza', 'student-hamza', { fullName: 'M' }, 1),
        (err) => err.statusCode === 422
      )
    })

    it('Workflow 3e: rejects invalid email missing @', () => {
      assert.throws(
        () => adapter.updateProfile('student-hamza', 'student-hamza', { email: 'invalid-email-address' }, 1),
        (err) => err.statusCode === 422
      )
    })
  })

  describe('5, 6, 7, 8. Saved Programmes Management', () => {
    beforeEach(() => {
      mockStorage.clear()
      adapter = new TestDashboardAdapter()
    })

    it('Workflow 5 & 6: saves a programme and retrieves it consistently', () => {
      adapter.saveProgramme('student-hamza', 'student-hamza', 'ned-cs')
      const saved = adapter.getSavedProgrammes('student-hamza', 'student-hamza')
      assert.equal(saved.length, 1)
      assert.equal(saved[0], 'ned-cs')
    })

    it('Workflow 7: duplicate saves do not create duplicate records (throws 409 Conflict)', () => {
      adapter.saveProgramme('student-hamza', 'student-hamza', 'fast-cs')
      assert.throws(
        () => adapter.saveProgramme('student-hamza', 'student-hamza', 'fast-cs'),
        (err) => err.statusCode === 409
      )
      const list = adapter.getSavedProgrammes('student-hamza', 'student-hamza')
      assert.equal(list.length, 1)
    })

    it('Workflow 8: removes saved programme and updates shortlist state', () => {
      adapter.saveProgramme('student-hamza', 'student-hamza', 'ku-cs')
      adapter.saveProgramme('student-hamza', 'student-hamza', 'iba-cs')
      assert.equal(adapter.getSavedProgrammes('student-hamza', 'student-hamza').length, 2)

      adapter.removeSavedProgramme('student-hamza', 'student-hamza', 'ku-cs')
      const remaining = adapter.getSavedProgrammes('student-hamza', 'student-hamza')
      assert.equal(remaining.length, 1)
      assert.equal(remaining[0], 'iba-cs')
    })
  })

  describe('9. Saved Universities Management', () => {
    beforeEach(() => {
      mockStorage.clear()
      adapter = new TestDashboardAdapter()
    })

    it('Workflow 9: saves a university independently from programmes', () => {
      adapter.saveUniversity('student-hamza', 'student-hamza', 'ned-uet')
      const saved = adapter.getSavedUniversities('student-hamza', 'student-hamza')
      assert.equal(saved.length, 1)
      assert.equal(saved[0], 'ned-uet')

      // Programmes list remains empty
      assert.equal(adapter.getSavedProgrammes('student-hamza', 'student-hamza').length, 0)
    })

    it('Workflow 9b: removes a saved university cleanly', () => {
      adapter.saveUniversity('student-hamza', 'student-hamza', 'fast-nuces')
      adapter.removeSavedUniversity('student-hamza', 'student-hamza', 'fast-nuces')
      assert.equal(adapter.getSavedUniversities('student-hamza', 'student-hamza').length, 0)
    })
  })

  describe('10 & 11. Recommendation Sessions & History Preservation', () => {
    beforeEach(() => {
      mockStorage.clear()
      adapter = new TestDashboardAdapter()
    })

    it('Workflow 11: refreshing recommendations creates a new session without deleting old ones', () => {
      const sess1 = adapter.saveRecommendationSession('student-hamza', 'student-hamza', {
        profileSnapshot: { hscGroup: 'Pre-Engineering', hscTotalPredictedPercentage: 82.5 },
        criteriaWeights: { merit: 50, affordability: 30, distance: 20 },
        resultsCount: 5,
        topRecommendationTitle: 'BS Computer Science — NED UET',
        results: [{ programmeId: 'ned-cs', matchCategory: 'Safety', recommendationScore: 92 }],
      })

      const sess2 = adapter.saveRecommendationSession('student-hamza', 'student-hamza', {
        profileSnapshot: { hscGroup: 'Pre-Engineering', hscTotalPredictedPercentage: 85.0 },
        criteriaWeights: { merit: 60, affordability: 20, distance: 20 },
        resultsCount: 8,
        topRecommendationTitle: 'BS Software Engineering — FAST-NUCES',
        results: [{ programmeId: 'fast-cs', matchCategory: 'Safety', recommendationScore: 94 }],
      })

      const allSessions = adapter.getRecommendationSessions('student-hamza', 'student-hamza')
      assert.equal(allSessions.length, 2)
      // Most recent is first
      assert.equal(allSessions[0].id, sess2.id)
      assert.equal(allSessions[1].id, sess1.id)
    })

    it('Workflow 10: retrieves earlier recommendation session and associated ranked results', () => {
      const sess1 = adapter.saveRecommendationSession('student-hamza', 'student-hamza', {
        profileSnapshot: { hscGroup: 'Pre-Engineering', hscTotalPredictedPercentage: 82.5 },
        criteriaWeights: { merit: 50, affordability: 30, distance: 20 },
        resultsCount: 1,
        topRecommendationTitle: 'BS Computer Science — NED UET',
        results: [{ programmeId: 'ned-cs', matchCategory: 'Safety', recommendationScore: 92 }],
      })

      const sessions = adapter.getRecommendationSessions('student-hamza', 'student-hamza')
      const targetSession = sessions.find((s) => s.id === sess1.id)
      assert.ok(targetSession)
      assert.equal(targetSession.profileSnapshot.hscTotalPredictedPercentage, 82.5)
      assert.equal(targetSession.results[0].programmeId, 'ned-cs')
    })
  })

  describe('12. Programme Comparison Bounds & Logic', () => {
    beforeEach(() => {
      mockStorage.clear()
      adapter = new TestDashboardAdapter()
    })

    it('Workflow 12: handles duplicates, caps at 4, and rejects invalid foreign keys', () => {
      // Duplicates removed, capped at 4
      const input = ['ned-cs', 'fast-cs', 'ku-cs', 'iba-cs', 'ned-cs', 'duhs-mbbs']
      const compared = adapter.updateComparison('student-hamza', 'student-hamza', input)
      assert.equal(compared.length, 4)
      assert.deepEqual(compared, ['ned-cs', 'fast-cs', 'ku-cs', 'iba-cs'])

      // Invalid foreign key throws 422
      assert.throws(
        () => adapter.updateComparison('student-hamza', 'student-hamza', ['fictitious-degree']),
        (err) => err.statusCode === 422
      )
    })
  })

  describe('13 & 14. Authentication, Expired Sessions & Multi-Tenant Authorization', () => {
    beforeEach(() => {
      mockStorage.clear()
      adapter = new TestDashboardAdapter()
    })

    it('Workflow 13: unauthorized request without authUserId throws 401', () => {
      assert.throws(
        () => adapter.getProfile('student-hamza', null),
        (err) => err.statusCode === 401
      )
      assert.throws(
        () => adapter.saveProgramme('student-hamza', undefined, 'ned-cs'),
        (err) => err.statusCode === 401
      )
    })

    it('Workflow 14: one student cannot access another student records (403 Forbidden)', () => {
      // Aisha attempting to access Hamza profile
      assert.throws(
        () => adapter.getProfile('student-hamza', 'student-aisha'),
        (err) => err.statusCode === 403
      )
      // Aisha attempting to save into Hamza shortlist
      assert.throws(
        () => adapter.saveProgramme('student-hamza', 'student-aisha', 'ned-cs'),
        (err) => err.statusCode === 403
      )
      // Aisha attempting to view Hamza sessions
      assert.throws(
        () => adapter.getRecommendationSessions('student-hamza', 'student-aisha'),
        (err) => err.statusCode === 403
      )
    })
  })

  describe('15. Optimistic Concurrency & Network Conflict Protection', () => {
    beforeEach(() => {
      mockStorage.clear()
      adapter = new TestDashboardAdapter()
    })
    it('Workflow 15: prevents accidental overwrites when stale version is supplied (409 Conflict)', () => {
      const v1 = adapter.getProfile('student-hamza', 'student-hamza')
      // Transaction A succeeds
      adapter.updateProfile('student-hamza', 'student-hamza', { sscPercentage: 88.0 }, v1.version)
      // Transaction B with outdated v1 version fails
      assert.throws(
        () => adapter.updateProfile('student-hamza', 'student-hamza', { sscPercentage: 89.0 }, v1.version),
        (err) => err.statusCode === 409
      )
    })
  })
})
