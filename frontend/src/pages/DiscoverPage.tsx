import React, { useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { academicInfoSchema, AcademicInfoFormValues } from '@/schemas/studentProfileSchema'
import { useStudentProfile } from '@/hooks/useStudentProfile'
import { DiscoveryStepper } from '@/features/student/DiscoveryStepper'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, Check, BookOpen, Calculator, Award } from 'lucide-react'
import { HSCGroup, ExaminationBoard } from '@/types/student'

const hscGroups: { value: HSCGroup; label: string; subjects: string }[] = [
  {
    value: 'Pre-Engineering',
    label: 'Pre-Engineering',
    subjects: 'Mathematics, Physics, Chemistry',
  },
  {
    value: 'Pre-Medical',
    label: 'Pre-Medical',
    subjects: 'Biology, Physics, Chemistry',
  },
  {
    value: 'Computer Science',
    label: 'Computer Science / ICS',
    subjects: 'Mathematics, Physics, Computer Science',
  },
  {
    value: 'General Science',
    label: 'General Science',
    subjects: 'Mathematics, Statistics, Economics / Physics',
  },
  {
    value: 'Commerce',
    label: 'Commerce',
    subjects: 'Accounting, Banking, Business Mathematics',
  },
  {
    value: 'Arts & Humanities',
    label: 'Arts & Humanities',
    subjects: 'Civics, History, General Mathematics',
  },
]

const examinationBoards: { value: ExaminationBoard; label: string; badge: string }[] = [
  {
    value: 'Board of Intermediate Education Karachi (BIEK)',
    label: 'BIEK — Board of Intermediate Education Karachi (Primary Karachi Board)',
    badge: 'Karachi Official',
  },
  {
    value: 'Federal Board of Intermediate & Secondary Education (FBISE)',
    label: 'FBISE — Federal Board Islamabad (Karachi Cantonment & Federal Colleges)',
    badge: 'Federal',
  },
  {
    value: 'Aga Khan University Examination Board (AKU-EB)',
    label: 'AKU-EB — Aga Khan University Examination Board',
    badge: 'Private Board',
  },
  {
    value: 'Cambridge International (A-Levels)',
    label: 'Cambridge International (GCE A-Levels / IB Equivalent)',
    badge: 'Equivalence Required',
  },
  {
    value: 'Sindh Board',
    label: 'Sindh Board (Hyderabad / Mirpurkhas / Sukkur Board)',
    badge: 'Provincial',
  },
]

export const DiscoverPage: React.FC = () => {
  const navigate = useNavigate()
  const { profile, updateProfile } = useStudentProfile()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AcademicInfoFormValues>({
    resolver: zodResolver(academicInfoSchema),
    defaultValues: {
      fullName: profile.fullName,
      email: profile.email,
      hscGroup: profile.hscGroup,
      board: profile.board,
      sscPercentage: profile.sscPercentage,
      hscPart1Percentage: profile.hscPart1Percentage,
      hscTotalPredictedPercentage: profile.hscTotalPredictedPercentage,
      subjectMarks: profile.subjectMarks,
    },
  })

  const selectedGroup = watch('hscGroup')
  const hscPart1 = watch('hscPart1Percentage')

  // Auto-sync predicted percentage if student hasn't manually edited it
  useEffect(() => {
    if (hscPart1 && !isNaN(hscPart1)) {
      // Suggest realistic predicted percentage
      const predictedVal = watch('hscTotalPredictedPercentage')
      if (!predictedVal || isNaN(predictedVal)) {
        setValue('hscTotalPredictedPercentage', Number(hscPart1))
      }
    }
  }, [hscPart1, setValue, watch])

  const onSubmit = (data: AcademicInfoFormValues) => {
    updateProfile(data)
    navigate('/discover/preferences')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Visual Stepper */}
      <DiscoveryStepper currentStep={1} />

      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Badge variant="default" className="text-xs bg-brand-50 text-brand-700 border-brand-200">
            Step 1 of 3: Academic Background & Scores
          </Badge>
          <span className="text-xs text-slate-400">• Higher Secondary Credentials</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Academic Information & Board Scores
        </h1>
        <p className="text-xs text-slate-600 sm:text-sm">
          Enter your intermediate qualification details. In Karachi, universities evaluate Round-1 admissions primarily on HSC Part-1 percentage and SSC record.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Student Identification & Board Card */}
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-brand-600" />
              <CardTitle className="text-sm font-bold text-slate-900">
                1. Educational Board & Intermediate Group
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Selecting your verified board and HSC group ensures eligibility checks reflect Karachi university standards.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Student Full Name"
                placeholder="e.g. Muhammad Hamza"
                error={errors.fullName?.message}
                helperText="As printed on your intermediate enrollment card"
                {...register('fullName')}
              />

              <Input
                label="Student Email Address"
                type="email"
                placeholder="e.g. candidate@gmail.com"
                error={errors.email?.message}
                helperText="Used for session notifications & report export"
                {...register('email')}
              />
            </div>

            {/* Board Selection */}
            <div className="space-y-1.5 pt-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Educational Examination Board <span className="text-rose-500">*</span>
              </label>
              <Select
                error={errors.board?.message}
                {...register('board')}
              >
                {examinationBoards.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </Select>
              <p className="text-[11px] text-slate-500">
                Supports Karachi local boards (BIEK Karachi), Federal Board (FBISE), AKU-EB, and Cambridge A-Levels equivalence.
              </p>
            </div>

            {/* Academic Group Selection */}
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Academic Faculty / HSC Group <span className="text-rose-500">*</span>
              </label>
              <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                {hscGroups.map((group) => {
                  const isSelected = selectedGroup === group.value
                  return (
                    <button
                      key={group.value}
                      type="button"
                      onClick={() => setValue('hscGroup', group.value, { shouldValidate: true })}
                      className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-brand-600 bg-brand-50/70 shadow-xs ring-1 ring-brand-600'
                          : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-bold ${isSelected ? 'text-brand-900' : 'text-slate-900'}`}>
                          {group.label}
                        </span>
                        {isSelected && <Check className="h-4 w-4 text-brand-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 leading-tight">
                        {group.subjects}
                      </p>
                    </button>
                  )
                })}
              </div>
              {errors.hscGroup && (
                <p className="text-xs text-rose-600 font-medium">{errors.hscGroup.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Academic Performance & Scores Card */}
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Calculator className="h-4 w-4 text-brand-600" />
              <CardTitle className="text-sm font-bold text-slate-900">
                2. Intermediate & Matriculation Marks
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Universities calculate admission merit percentages based on your official first-year result and matric record.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <Input
                label="SSC / Matric Percentage (%)"
                type="number"
                step="0.1"
                placeholder="e.g. 84.5"
                error={errors.sscPercentage?.message}
                helperText="10th grade overall board result percentage"
                {...register('sscPercentage', { valueAsNumber: true })}
              />

              <Input
                label="HSC Part-1 (11th) Percentage (%)"
                type="number"
                step="0.1"
                placeholder="e.g. 81.2"
                error={errors.hscPart1Percentage?.message}
                helperText="Primary benchmark for Round-1 admissions"
                {...register('hscPart1Percentage', { valueAsNumber: true })}
              />

              <Input
                label="Predicted Final HSC Percentage (%)"
                type="number"
                step="0.1"
                placeholder="e.g. 82.5"
                error={errors.hscTotalPredictedPercentage?.message}
                helperText="Expected aggregate upon completing 12th grade"
                {...register('hscTotalPredictedPercentage', { valueAsNumber: true })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Relevant Subject Scores Card */}
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-brand-600" />
              <CardTitle className="text-sm font-bold text-slate-900">
                3. Key Subject Scores (Out of 100)
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Provide specific subject marks if known. Used to evaluate special prerequisite policies (e.g. Mathematics threshold for BS Computer Science).
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
              <Input
                label="Mathematics"
                type="number"
                placeholder="85"
                helperText="Out of 100"
                error={errors.subjectMarks?.mathematics?.message}
                {...register('subjectMarks.mathematics', { valueAsNumber: true })}
              />

              <Input
                label="Physics"
                type="number"
                placeholder="80"
                helperText="Out of 100"
                error={errors.subjectMarks?.physics?.message}
                {...register('subjectMarks.physics', { valueAsNumber: true })}
              />

              <Input
                label="Chemistry"
                type="number"
                placeholder="82"
                helperText="Out of 100"
                error={errors.subjectMarks?.chemistry?.message}
                {...register('subjectMarks.chemistry', { valueAsNumber: true })}
              />

              <Input
                label="Computer Science"
                type="number"
                placeholder="90"
                helperText="Out of 100"
                error={errors.subjectMarks?.computerScience?.message}
                {...register('subjectMarks.computerScience', { valueAsNumber: true })}
              />

              <Input
                label="Biology"
                type="number"
                placeholder="75"
                helperText="Out of 100"
                error={errors.subjectMarks?.biology?.message}
                {...register('subjectMarks.biology', { valueAsNumber: true })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Navigation & Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <Link to="/">
            <Button type="button" variant="outline" className="gap-2 w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4" />
              Back to Overview
            </Button>
          </Link>

          <Button type="submit" className="gap-2 font-bold w-full sm:w-auto px-6 shadow-sm">
            <span>Continue to Step 2: Preferences & Priorities</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
