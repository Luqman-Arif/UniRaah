import React, { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { X, Check, Save, Sparkles, User, GraduationCap, Calculator, AlertTriangle } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useStudentProfile } from '@/hooks/useStudentProfile'
import { useStudentDashboard } from '@/hooks/useStudentDashboard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { HSCGroup, ExaminationBoard } from '@/types/student'
import { cn } from '@/lib/utils'

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

const examinationBoards: { value: ExaminationBoard; label: string }[] = [
  {
    value: 'Board of Intermediate Education Karachi (BIEK)',
    label: 'BIEK — Board of Intermediate Education Karachi',
  },
  {
    value: 'Federal Board of Intermediate & Secondary Education (FBISE)',
    label: 'FBISE — Federal Board Islamabad (Karachi Colleges)',
  },
  {
    value: 'Aga Khan University Examination Board (AKU-EB)',
    label: 'AKU-EB — Aga Khan University Examination Board',
  },
  {
    value: 'Cambridge International (A-Levels)',
    label: 'Cambridge International (GCE A-Levels / IB Equivalent)',
  },
  {
    value: 'Sindh Board',
    label: 'Sindh Board (Hyderabad / Mirpurkhas / Sukkur)',
  },
]

const hscGroups: { value: HSCGroup; label: string; subjects: string }[] = [
  { value: 'Pre-Engineering', label: 'Pre-Engineering', subjects: 'Maths, Physics, Chemistry' },
  { value: 'Pre-Medical', label: 'Pre-Medical', subjects: 'Biology, Physics, Chemistry' },
  { value: 'Computer Science', label: 'Computer Science / ICS', subjects: 'Maths, Physics, CS' },
  { value: 'General Science', label: 'General Science', subjects: 'Maths, Stats, Economics' },
  { value: 'Commerce', label: 'Commerce', subjects: 'Accounting, Banking, Business Maths' },
  { value: 'Arts & Humanities', label: 'Arts & Humanities', subjects: 'Civics, History, General Maths' },
]

const karachiLocations = [
  'Gulshan-e-Iqbal',
  'Clifton & DHA',
  'North Nazimabad',
  'Gulistan-e-Johar',
  'PECHS & Jamshed Road',
  'Federal B Area',
  'Malir & Airport Corridor',
  'Nazimabad',
  'Saddar & Downtown',
  'Korangi & Landhi',
  'Scheme 33 & Safoora',
  'North Karachi & Surjani',
]

export const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUser } = useAuth()
  const { profile, saveProfile, isSaving, error: serverProfileError } = useStudentProfile()
  const { showToast } = useStudentDashboard()

  // Form states
  const [fullName, setFullName] = useState(user?.fullName || profile.fullName || '')
  const [email, setEmail] = useState(user?.email || profile.email || '')
  const [board, setBoard] = useState<ExaminationBoard>(
    user?.board || profile.board || 'Board of Intermediate Education Karachi (BIEK)'
  )
  const [hscGroup, setHscGroup] = useState<HSCGroup>(
    user?.hscGroup || profile.hscGroup || 'Pre-Engineering'
  )
  const [sscPercentage, setSscPercentage] = useState<number>(profile.sscPercentage || 84.5)
  const [hscPart1Percentage, setHscPart1Percentage] = useState<number>(profile.hscPart1Percentage || 81.2)
  const [hscTotalPredictedPercentage, setHscTotalPredictedPercentage] = useState<number>(
    user?.hscTotalPredictedPercentage || profile.hscTotalPredictedPercentage || 82.5
  )
  const [homeLocation, setHomeLocation] = useState(profile.preferences?.homeLocation || 'Gulshan-e-Iqbal')
  const [maxAnnualBudgetPKR, setMaxAnnualBudgetPKR] = useState<number>(
    profile.preferences?.maxAnnualBudgetPKR || 500000
  )

  // Subject marks
  const [mathMarks, setMathMarks] = useState<string>(
    profile.subjectMarks?.mathematics !== undefined ? String(profile.subjectMarks.mathematics) : '85'
  )
  const [physicsMarks, setPhysicsMarks] = useState<string>(
    profile.subjectMarks?.physics !== undefined ? String(profile.subjectMarks.physics) : '80'
  )
  const [chemMarks, setChemMarks] = useState<string>(
    profile.subjectMarks?.chemistry !== undefined ? String(profile.subjectMarks.chemistry) : '82'
  )
  const [csMarks, setCsMarks] = useState<string>(
    profile.subjectMarks?.computerScience !== undefined ? String(profile.subjectMarks.computerScience) : ''
  )
  const [bioMarks, setBioMarks] = useState<string>(
    profile.subjectMarks?.biology !== undefined ? String(profile.subjectMarks.biology) : ''
  )

  const [activeTab, setActiveTab] = useState<'academic' | 'personal' | 'subjects'>('academic')
  const [isSaved, setIsSaved] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [showDiscardConfirm, setShowDiscardConfirm] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFullName(user?.fullName || profile.fullName || '')
      setEmail(user?.email || profile.email || '')
      setBoard(user?.board || profile.board || 'Board of Intermediate Education Karachi (BIEK)')
      setHscGroup(user?.hscGroup || profile.hscGroup || 'Pre-Engineering')
      setSscPercentage(profile.sscPercentage || 84.5)
      setHscPart1Percentage(profile.hscPart1Percentage || 81.2)
      setHscTotalPredictedPercentage(
        user?.hscTotalPredictedPercentage || profile.hscTotalPredictedPercentage || 82.5
      )
      setHomeLocation(profile.preferences?.homeLocation || 'Gulshan-e-Iqbal')
      setMaxAnnualBudgetPKR(profile.preferences?.maxAnnualBudgetPKR || 500000)
      setMathMarks(profile.subjectMarks?.mathematics !== undefined ? String(profile.subjectMarks.mathematics) : '85')
      setPhysicsMarks(profile.subjectMarks?.physics !== undefined ? String(profile.subjectMarks.physics) : '80')
      setChemMarks(profile.subjectMarks?.chemistry !== undefined ? String(profile.subjectMarks.chemistry) : '82')
      setCsMarks(profile.subjectMarks?.computerScience !== undefined ? String(profile.subjectMarks.computerScience) : '')
      setBioMarks(profile.subjectMarks?.biology !== undefined ? String(profile.subjectMarks.biology) : '')
      setIsSaved(false)
      setShowDiscardConfirm(false)
      setValidationErrors({})
    }
  }, [isOpen, user, profile])

  // Track if changes have been made (isDirty)
  const isDirty = useMemo(() => {
    const origFullName = user?.fullName || profile.fullName || ''
    const origEmail = user?.email || profile.email || ''
    const origBoard = user?.board || profile.board
    const origGroup = user?.hscGroup || profile.hscGroup
    const origSsc = profile.sscPercentage || 84.5
    const origHsc1 = profile.hscPart1Percentage || 81.2
    const origHscPred = user?.hscTotalPredictedPercentage || profile.hscTotalPredictedPercentage || 82.5
    const origLocation = profile.preferences?.homeLocation || 'Gulshan-e-Iqbal'
    const origBudget = profile.preferences?.maxAnnualBudgetPKR || 500000

    return (
      fullName !== origFullName ||
      email !== origEmail ||
      board !== origBoard ||
      hscGroup !== origGroup ||
      Number(sscPercentage) !== origSsc ||
      Number(hscPart1Percentage) !== origHsc1 ||
      Number(hscTotalPredictedPercentage) !== origHscPred ||
      homeLocation !== origLocation ||
      Number(maxAnnualBudgetPKR) !== origBudget
    )
  }, [
    fullName,
    email,
    board,
    hscGroup,
    sscPercentage,
    hscPart1Percentage,
    hscTotalPredictedPercentage,
    homeLocation,
    maxAnnualBudgetPKR,
    user,
    profile,
  ])

  // Handle Safe Close
  const handleAttemptClose = () => {
    if (isDirty && !isSaved) {
      setShowDiscardConfirm(true)
    } else {
      onClose()
    }
  }

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (showDiscardConfirm) {
          setShowDiscardConfirm(false)
        } else if (isDirty) {
          setShowDiscardConfirm(true)
        } else {
          onClose()
        }
      }
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isDirty, showDiscardConfirm, onClose])

  // Prevent background scroll when modal is open
  useEffect(() => {
    if (!isOpen) return

    const originalOverflow = document.body.style.overflow
    const originalPaddingRight = document.body.style.paddingRight
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth

    document.body.style.overflow = 'hidden'
    if (scrollBarWidth > 0) {
      document.body.style.paddingRight = `${scrollBarWidth}px`
    }

    return () => {
      document.body.style.overflow = originalOverflow
      document.body.style.paddingRight = originalPaddingRight
    }
  }, [isOpen])

  if (!isOpen) return null

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    if (!fullName.trim() || fullName.trim().length < 2) {
      errors.fullName = 'Full name must be at least 2 characters'
    }
    if (!email.trim() || !email.includes('@')) {
      errors.email = 'Please provide a valid email address'
    }
    if (sscPercentage < 33 || sscPercentage > 100) {
      errors.sscPercentage = 'SSC percentage must be between 33% and 100%'
    }
    if (hscPart1Percentage < 33 || hscPart1Percentage > 100) {
      errors.hscPart1Percentage = 'HSC Part-1 percentage must be between 33% and 100%'
    }
    if (hscTotalPredictedPercentage < 33 || hscTotalPredictedPercentage > 100) {
      errors.hscTotalPredictedPercentage = 'Predicted percentage must be between 33% and 100%'
    }
    if (maxAnnualBudgetPKR < 10000) {
      errors.maxAnnualBudgetPKR = 'Budget must be at least 10,000 PKR'
    }

    // Validate subject marks if entered
    const validateMark = (val: string, name: string) => {
      if (val !== '') {
        const num = Number(val)
        if (isNaN(num) || num < 0 || num > 100) {
          errors[name] = 'Marks must be between 0 and 100'
        }
      }
    }
    validateMark(mathMarks, 'mathMarks')
    validateMark(physicsMarks, 'physicsMarks')
    validateMark(chemMarks, 'chemMarks')
    validateMark(csMarks, 'csMarks')
    validateMark(bioMarks, 'bioMarks')

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveError(null)

    if (!validateForm()) {
      return
    }

    const predicted = Number(hscTotalPredictedPercentage) || Number(hscPart1Percentage) || 80

    const updatedSubjectMarks = {
      mathematics: mathMarks !== '' ? Number(mathMarks) : undefined,
      physics: physicsMarks !== '' ? Number(physicsMarks) : undefined,
      chemistry: chemMarks !== '' ? Number(chemMarks) : undefined,
      computerScience: csMarks !== '' ? Number(csMarks) : undefined,
      biology: bioMarks !== '' ? Number(bioMarks) : undefined,
    }

    const updates = {
      fullName: fullName.trim() || 'Student',
      email: email.trim(),
      board,
      hscGroup,
      sscPercentage: Number(sscPercentage) || 80,
      hscPart1Percentage: Number(hscPart1Percentage) || 80,
      hscTotalPredictedPercentage: predicted,
      subjectMarks: updatedSubjectMarks,
      preferences: {
        ...profile.preferences,
        homeLocation,
        maxAnnualBudgetPKR: Number(maxAnnualBudgetPKR) || 500000,
      },
    }

    // 1. Call persistent async save with optimistic concurrency check
    const success = await saveProfile(updates)
    if (!success) {
      setSaveError(serverProfileError || 'Unable to persist changes. A concurrent update or validation conflict occurred.')
      return
    }

    // 2. Update Auth Context & user header
    updateUser({
      fullName: fullName.trim() || 'Student',
      email: email.trim(),
      hscGroup,
      board,
      hscTotalPredictedPercentage: predicted,
    })

    setIsSaved(true)
    showToast('Profile Saved', 'Academic credentials and preferences persisted to server.', 'success')

    // Close after short visual feedback
    setTimeout(() => {
      setIsSaved(false)
      onClose()
    }, 450)
  }

  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'ST'

  const modalContent = (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-navy/60 backdrop-blur-xs animate-in fade-in-50 duration-200"
      onClick={handleAttemptClose}
      aria-modal="true"
      role="dialog"
      aria-labelledby="edit-profile-modal-title"
    >
      <div className="min-h-full flex items-center justify-center p-3 sm:p-6 text-center">
        <div
          className="relative w-full max-w-2xl rounded-3xl bg-white text-left shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-[calc(100vh-3.5rem)] my-auto animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Unsaved Changes Confirmation Overlay */}
          {showDiscardConfirm && (
            <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-xs p-6 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in-50">
              <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div className="space-y-1 max-w-sm">
                <h4 className="text-base font-extrabold text-navy">Discard Unsaved Changes?</h4>
                <p className="text-xs text-slate-500">
                  You have modified your academic profile details. If you close now, your edits will not be saved.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDiscardConfirm(false)}
                  className="cursor-pointer"
                >
                  Keep Editing
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setShowDiscardConfirm(false)
                    onClose()
                  }}
                  className="bg-rose-600 hover:bg-rose-700 text-white cursor-pointer"
                >
                  Discard & Close
                </Button>
              </div>
            </div>
          )}

          {/* Modal Header */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-brand-50/70 via-slate-50 to-white border-b border-slate-200/80 flex items-start justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-brand-700 via-brand to-indigo-600 text-white font-extrabold text-base shadow-sm ring-2 ring-white">
                {initials}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 id="edit-profile-modal-title" className="text-lg font-extrabold text-navy">
                    Edit Student Profile
                  </h3>
                  <Badge variant="outline" className="text-[10px] text-brand-700 bg-brand-50 border-brand-200">
                    Karachi HSC
                  </Badge>
                  {isDirty && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                      Unsaved Changes
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Update your academic marks, intermediate group, and location to recalculate merit fit.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAttemptClose}
              className="rounded-xl p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer"
              aria-label="Close profile editor"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Tab Switcher */}
          <div className="flex border-b border-slate-200 px-4 sm:px-6 bg-slate-50/60 shrink-0 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('academic')}
              className={cn(
                'py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap',
                activeTab === 'academic'
                  ? 'border-brand text-brand bg-white rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-navy hover:bg-slate-100/50'
              )}
            >
              <GraduationCap className="h-4 w-4" />
              <span>Academic Background</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('subjects')}
              className={cn(
                'py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap',
                activeTab === 'subjects'
                  ? 'border-brand text-brand bg-white rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-navy hover:bg-slate-100/50'
              )}
            >
              <Calculator className="h-4 w-4" />
              <span>Subject Marks</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('personal')}
              className={cn(
                'py-3 px-3 sm:px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap',
                activeTab === 'personal'
                  ? 'border-brand text-brand bg-white rounded-t-lg'
                  : 'border-transparent text-slate-500 hover:text-navy hover:bg-slate-100/50'
              )}
            >
              <User className="h-4 w-4" />
              <span>Personal & Location</span>
            </button>
          </div>

          {/* Form with Scrollable Body and Pinned Action Footer */}
          <form onSubmit={handleSave} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
          {saveError && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-800 flex items-start gap-2.5 animate-in fade-in-50">
              <AlertTriangle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold">Failed to Save Profile</p>
                <p>{saveError}</p>
              </div>
            </div>
          )}

          {/* TAB 1: ACADEMIC BACKGROUND */}
          {activeTab === 'academic' && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  label="Examination Board *"
                  value={board}
                  onChange={(e) => setBoard(e.target.value as ExaminationBoard)}
                  helperText="Primary intermediate board"
                >
                  {examinationBoards.map((b) => (
                    <option key={b.value} value={b.value}>
                      {b.label}
                    </option>
                  ))}
                </Select>

                <Select
                  label="Intermediate Faculty / HSC Group *"
                  value={hscGroup}
                  onChange={(e) => setHscGroup(e.target.value as HSCGroup)}
                  helperText="Determines degree eligibility"
                >
                  {hscGroups.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label} ({g.subjects})
                    </option>
                  ))}
                </Select>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Input
                  label="SSC / Matric Percentage *"
                  type="number"
                  step="0.1"
                  min="33"
                  max="100"
                  value={sscPercentage}
                  onChange={(e) => setSscPercentage(parseFloat(e.target.value) || 0)}
                  error={validationErrors.sscPercentage}
                  helperText="Matriculation total score %"
                />

                <Input
                  label="HSC Part-1 Percentage *"
                  type="number"
                  step="0.1"
                  min="33"
                  max="100"
                  value={hscPart1Percentage}
                  onChange={(e) => setHscPart1Percentage(parseFloat(e.target.value) || 0)}
                  error={validationErrors.hscPart1Percentage}
                  helperText="1st Year official result %"
                />

                <Input
                  label="Target Aggregate % *"
                  type="number"
                  step="0.1"
                  min="33"
                  max="100"
                  value={hscTotalPredictedPercentage}
                  onChange={(e) => setHscTotalPredictedPercentage(parseFloat(e.target.value) || 0)}
                  error={validationErrors.hscTotalPredictedPercentage}
                  helperText="Overall predicted cutoff benchmark"
                />
              </div>

              <div className="rounded-2xl border border-brand-200 bg-brand-50/50 p-4 text-xs text-slate-700 flex items-start gap-2.5">
                <Sparkles className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                <p>
                  <strong>Why this matters:</strong> Universities like NED, FAST, and KU calculate your composite merit using precise combinations of your HSC Part-1 and SSC scores paired with their entry test weightage.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: SUBJECT MARKS */}
          {activeTab === 'subjects' && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <p className="text-xs text-slate-500">
                Enter your key discipline subject percentages (0–100) to check specialized departmental eligibility rules (e.g. minimum 60% in Mathematics for Computing).
              </p>

              <div className="grid gap-4 sm:grid-cols-3">
                <Input
                  label="Mathematics Marks %"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g. 85"
                  value={mathMarks}
                  onChange={(e) => setMathMarks(e.target.value)}
                  error={validationErrors.mathMarks}
                  helperText="Crucial for Engineering & CS"
                />

                <Input
                  label="Physics Marks %"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g. 80"
                  value={physicsMarks}
                  onChange={(e) => setPhysicsMarks(e.target.value)}
                  error={validationErrors.physicsMarks}
                  helperText="Core natural science"
                />

                <Input
                  label="Chemistry Marks %"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="e.g. 82"
                  value={chemMarks}
                  onChange={(e) => setChemMarks(e.target.value)}
                  error={validationErrors.chemMarks}
                  helperText="Engineering & Medical"
                />

                <Input
                  label="Computer Science %"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Optional"
                  value={csMarks}
                  onChange={(e) => setCsMarks(e.target.value)}
                  error={validationErrors.csMarks}
                  helperText="ICS students score"
                />

                <Input
                  label="Biology Marks %"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Optional"
                  value={bioMarks}
                  onChange={(e) => setBioMarks(e.target.value)}
                  error={validationErrors.bioMarks}
                  helperText="Pre-Medical students score"
                />
              </div>
            </div>
          )}

          {/* TAB 3: PERSONAL & LOCATION */}
          {activeTab === 'personal' && (
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Full Name *"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  error={validationErrors.fullName}
                  helperText="Student primary name"
                />

                <Input
                  label="Email Address *"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={validationErrors.email}
                  helperText="Student contact email"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Select
                  label="Karachi Residential Area *"
                  value={homeLocation}
                  onChange={(e) => setHomeLocation(e.target.value)}
                  helperText="Used for daily transit distance scoring"
                >
                  {karachiLocations.map((loc) => (
                    <option key={loc} value={loc}>
                      {loc}
                    </option>
                  ))}
                </Select>

                <Input
                  label="Annual Tuition Budget Ceiling (PKR) *"
                  type="number"
                  step="25000"
                  min="10000"
                  max="5000000"
                  value={maxAnnualBudgetPKR}
                  onChange={(e) => setMaxAnnualBudgetPKR(parseInt(e.target.value, 10) || 500000)}
                  error={validationErrors.maxAnnualBudgetPKR}
                  helperText={`Approx. PKR ${Math.round(maxAnnualBudgetPKR / 2).toLocaleString()} per semester`}
                />
              </div>
            </div>
          )}

          </div>

          {/* Modal Footer Controls (Pinned at bottom) */}
          <div className="p-4 sm:px-6 bg-slate-50/90 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
            <Button type="button" variant="outline" onClick={handleAttemptClose} className="cursor-pointer">
              Cancel
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="submit"
                disabled={isSaved || isSaving}
                className={cn(
                  'gap-2 font-bold px-6 shadow-sm transition-all cursor-pointer',
                  isSaved ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-brand hover:bg-brand-700 text-white'
                )}
              >
                {isSaving ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    <span>Saving Changes...</span>
                  </>
                ) : isSaved ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Profile Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Save Changes</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
  )

  return typeof document !== 'undefined'
    ? createPortal(modalContent, document.body)
    : null
}
