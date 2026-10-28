import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { studentProfileSchema, StudentProfileFormValues } from '@/schemas/studentProfileSchema'
import { useStudentProfile } from '@/hooks/useStudentProfile'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Alert } from '@/components/ui/alert'
import { Check, RotateCcw } from 'lucide-react'
import { HSCGroup, ExaminationBoard, DisciplinePreference } from '@/types/student'

const hscGroups: { value: HSCGroup; label: string }[] = [
  { value: 'Pre-Engineering', label: 'Pre-Engineering (Maths, Physics, Chemistry)' },
  { value: 'Pre-Medical', label: 'Pre-Medical (Biology, Physics, Chemistry)' },
  { value: 'Computer Science', label: 'Computer Science / ICS (Maths, Physics, Computer)' },
  { value: 'General Science', label: 'General Science (Maths, Statistics, Economics/Physics)' },
  { value: 'Commerce', label: 'Commerce (Accounting, Banking, Business Math)' },
  { value: 'Arts & Humanities', label: 'Arts & Humanities / Civics' },
]

const examinationBoards: { value: ExaminationBoard; label: string }[] = [
  { value: 'Board of Intermediate Education Karachi (BIEK)', label: 'BIEK — Karachi Intermediate Board' },
  { value: 'Federal Board of Intermediate & Secondary Education (FBISE)', label: 'FBISE — Federal Board Islamabad' },
  { value: 'Aga Khan University Examination Board (AKU-EB)', label: 'AKU-EB — Aga Khan Board' },
  { value: 'Cambridge International (A-Levels)', label: 'Cambridge International (A-Levels / IB Equivalent)' },
  { value: 'Sindh Board', label: 'Sindh Board (Hyderabad / Mirpurkhas / Sukkur)' },
]

const disciplineOptions: DisciplinePreference[] = [
  'Computer Science & AI',
  'Software Engineering',
  'Electrical & Mechanical Engineering',
  'Business Administration & Management',
  'Medicine & Allied Health',
  'Data Science & Cyber Security',
  'Architecture & Design',
]

export const AcademicProfileForm: React.FC = () => {
  const { profile, updateProfile, resetProfile } = useStudentProfile()
  const [saveSuccess, setSaveSuccess] = React.useState(false)

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<StudentProfileFormValues>({
    resolver: zodResolver(studentProfileSchema),
    defaultValues: {
      fullName: profile.fullName,
      email: profile.email,
      hscGroup: profile.hscGroup,
      board: profile.board,
      sscPercentage: profile.sscPercentage,
      hscPart1Percentage: profile.hscPart1Percentage,
      hscTotalPredictedPercentage: profile.hscTotalPredictedPercentage,
      subjectMarks: profile.subjectMarks,
      preferences: profile.preferences,
    },
  })

  const selectedDisciplines = watch('preferences.disciplines') || []

  const handleDisciplineToggle = (disc: DisciplinePreference) => {
    if (selectedDisciplines.includes(disc)) {
      setValue(
        'preferences.disciplines',
        selectedDisciplines.filter((d) => d !== disc),
        { shouldValidate: true }
      )
    } else {
      setValue('preferences.disciplines', [...selectedDisciplines, disc], {
        shouldValidate: true,
      })
    }
  }

  const onSubmit = (data: StudentProfileFormValues) => {
    updateProfile(data)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 4000)
  }

  const handleReset = () => {
    resetProfile()
    reset({
      fullName: 'Muhammad Hamza',
      email: 'hamza.karachi@example.com',
      hscGroup: 'Pre-Engineering',
      board: 'Board of Intermediate Education Karachi (BIEK)',
      sscPercentage: 84.5,
      hscPart1Percentage: 81.2,
      hscTotalPredictedPercentage: 82.5,
      subjectMarks: { mathematics: 85, physics: 80, chemistry: 82 },
      preferences: {
        disciplines: ['Computer Science & AI', 'Software Engineering'],
        maxAnnualBudgetPKR: 500000,
        sector: 'all',
        shift: 'morning',
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {saveSuccess && (
        <Alert type="success" title="Academic Profile Saved">
          Your profile and admission criteria were updated. Recommendations have been recalculated.
        </Alert>
      )}

      {/* Basic Student Credentials */}
      <Card>
        <CardHeader>
          <CardTitle>Student Identification & Examination Board</CardTitle>
          <CardDescription>
            Specify your Intermediate Board and enrollment details for eligibility mapping across Karachi universities.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Full Name"
            placeholder="e.g. Syed Daniyal Ali"
            error={errors.fullName?.message}
            {...register('fullName')}
          />
          <Input
            label="Email Address"
            type="email"
            placeholder="e.g. daniyal@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Select
            label="HSC Group / Faculty"
            error={errors.hscGroup?.message}
            {...register('hscGroup')}
          >
            {hscGroups.map((g) => (
              <option key={g.value} value={g.value}>
                {g.label}
              </option>
            ))}
          </Select>

          <Select
            label="Examination Board"
            error={errors.board?.message}
            {...register('board')}
          >
            {examinationBoards.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </Select>
        </CardContent>
      </Card>

      {/* Academic Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Academic Scores & Predicted Percentages</CardTitle>
          <CardDescription>
            Most Karachi universities evaluate Round-1 admissions based on HSC Part-1 and SSC marks.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-3">
          <Input
            label="SSC / Matric Percentage (%)"
            type="number"
            step="0.1"
            placeholder="e.g. 85.0"
            error={errors.sscPercentage?.message}
            helperText="10th grade overall percentage"
            {...register('sscPercentage', { valueAsNumber: true })}
          />

          <Input
            label="HSC Part-1 (11th) Percentage (%)"
            type="number"
            step="0.1"
            placeholder="e.g. 81.2"
            error={errors.hscPart1Percentage?.message}
            helperText="Official first-year board result"
            {...register('hscPart1Percentage', { valueAsNumber: true })}
          />

          <Input
            label="Predicted Final HSC Percentage (%)"
            type="number"
            step="0.1"
            placeholder="e.g. 82.5"
            error={errors.hscTotalPredictedPercentage?.message}
            helperText="Estimated final 12th percentage"
            {...register('hscTotalPredictedPercentage', { valueAsNumber: true })}
          />
        </CardContent>
      </Card>

      {/* Subject Marks Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Key Subject Scores (Out of 100)</CardTitle>
          <CardDescription>
            Used for specialized department eligibility (e.g., Mathematics requirement for Computer Science).
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          <Input
            label="Mathematics"
            type="number"
            placeholder="85"
            {...register('subjectMarks.mathematics', { valueAsNumber: true })}
          />
          <Input
            label="Physics"
            type="number"
            placeholder="80"
            {...register('subjectMarks.physics', { valueAsNumber: true })}
          />
          <Input
            label="Chemistry"
            type="number"
            placeholder="82"
            {...register('subjectMarks.chemistry', { valueAsNumber: true })}
          />
          <Input
            label="Computer"
            type="number"
            placeholder="90"
            {...register('subjectMarks.computerScience', { valueAsNumber: true })}
          />
          <Input
            label="Biology"
            type="number"
            placeholder="75"
            {...register('subjectMarks.biology', { valueAsNumber: true })}
          />
        </CardContent>
      </Card>

      {/* Preferences & Budget */}
      <Card>
        <CardHeader>
          <CardTitle>Degree & Financial Preferences</CardTitle>
          <CardDescription>
            Filter programmes by target fields, annual tuition budget, and campus shifts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
              Preferred Academic Disciplines (Choose one or more)
            </label>
            <div className="flex flex-wrap gap-2">
              {disciplineOptions.map((disc) => {
                const isSelected = selectedDisciplines.includes(disc)
                return (
                  <button
                    key={disc}
                    type="button"
                    onClick={() => handleDisciplineToggle(disc)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors border cursor-pointer ${
                      isSelected
                        ? 'bg-brand-600 text-white border-brand-600 font-semibold'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {isSelected && '✓ '}
                    {disc}
                  </button>
                )
              })}
            </div>
            {errors.preferences?.disciplines && (
              <p className="mt-1 text-xs font-medium text-rose-600">
                {errors.preferences.disciplines.message}
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-3 pt-2">
            <Input
              label="Maximum Annual Budget (PKR)"
              type="number"
              step="10000"
              placeholder="500000"
              error={errors.preferences?.maxAnnualBudgetPKR?.message}
              helperText="E.g., 100,000 for Public, 500,000+ for Private"
              {...register('preferences.maxAnnualBudgetPKR', { valueAsNumber: true })}
            />

            <Select
              label="University Sector Preference"
              {...register('preferences.sector')}
            >
              <option value="all">Any Sector (Public & Private)</option>
              <option value="public">Public Sector Only (NED, KU, DUHS)</option>
              <option value="private">Private Sector Only (SSUET, Habib)</option>
              <option value="semi-government">Semi-Government (FAST-NUCES)</option>
            </Select>

            <Select
              label="Shift Preference"
              {...register('preferences.shift')}
            >
              <option value="any">Any Shift</option>
              <option value="morning">Morning Only</option>
              <option value="evening">Evening / Self-Finance</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
          className="gap-1.5"
        >
          <RotateCcw className="h-4 w-4" />
          Reset to Sample Data
        </Button>
        <Button type="submit" isLoading={isSubmitting} className="gap-1.5">
          <Check className="h-4 w-4" />
          Save Academic Profile
        </Button>
      </div>
    </form>
  )
}
