import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { preferencesSchema, PreferencesFormValues } from '@/schemas/studentProfileSchema'
import { useStudentProfile } from '@/hooks/useStudentProfile'
import { DiscoveryStepper } from '@/features/student/DiscoveryStepper'
import { KARACHI_LOCATIONS } from '@/services/mock/distanceService'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DisciplinePreference } from '@/types/student'
import {
  ArrowLeft,
  ArrowRight,
  Wallet,
  MapPin,
  Sliders,
  Sparkles,
  Layers,
  Info,
} from 'lucide-react'

const disciplineOptions: DisciplinePreference[] = [
  'Computer Science & AI',
  'Software Engineering',
  'Electrical & Mechanical Engineering',
  'Business Administration & Management',
  'Medicine & Allied Health',
  'Data Science & Cyber Security',
  'Architecture & Design',
]

export const PreferencesPage: React.FC = () => {
  const navigate = useNavigate()
  const { profile, updateProfile } = useStudentProfile()

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      disciplines: profile.preferences.disciplines,
      budgetPeriod: profile.preferences.budgetPeriod || 'annual',
      maxAnnualBudgetPKR: profile.preferences.maxAnnualBudgetPKR || 500000,
      homeLocation: profile.preferences.homeLocation || 'Gulshan-e-Iqbal',
      sector: profile.preferences.sector || 'all',
      shift: profile.preferences.shift || 'morning',
      priorities: profile.preferences.priorities || {
        merit: 50,
        affordability: 30,
        distance: 20,
      },
    },
  })

  const selectedDisciplines = watch('disciplines') || []
  const budgetPeriod = watch('budgetPeriod')
  const homeLocation = watch('homeLocation')
  const meritWeight = watch('priorities.merit') || 0
  const affordWeight = watch('priorities.affordability') || 0
  const distWeight = watch('priorities.distance') || 0

  // Calculate normalized percentage weights for display
  const totalWeight = meritWeight + affordWeight + distWeight
  const normMerit = totalWeight > 0 ? Math.round((meritWeight / totalWeight) * 100) : 0
  const normAfford = totalWeight > 0 ? Math.round((affordWeight / totalWeight) * 100) : 0
  const normDist = totalWeight > 0 ? 100 - normMerit - normAfford : 0

  const handleDisciplineToggle = (disc: DisciplinePreference) => {
    if (selectedDisciplines.includes(disc)) {
      if (selectedDisciplines.length > 1) {
        setValue(
          'disciplines',
          selectedDisciplines.filter((d) => d !== disc),
          { shouldValidate: true }
        )
      }
    } else {
      setValue('disciplines', [...selectedDisciplines, disc], {
        shouldValidate: true,
      })
    }
  }

  const onSubmit = (data: PreferencesFormValues) => {
    updateProfile({
      preferences: {
        ...profile.preferences,
        ...data,
      },
    })
    navigate('/recommendations')
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Visual Stepper */}
      <DiscoveryStepper currentStep={2} />

      {/* Header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <Badge variant="default" className="text-xs bg-brand-50 text-brand-700 border-brand-200">
            Step 2 of 3: Preferences, Budget & Priorities
          </Badge>
          <span className="text-xs text-slate-400">• Budget, Location & Recommendation Weights</span>
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
          Financial Budget & Recommendation Priorities
        </h1>
        <p className="text-xs text-slate-600 sm:text-sm">
          Tailor how programmes are ranked. UniRaah balances academic merit closing aggregates, tuition budget limits, and Karachi transit distance based on your explicit weights.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Financial Budget Card */}
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Wallet className="h-4 w-4 text-brand-600" />
              <CardTitle className="text-sm font-bold text-slate-900">
                1. Tuition Fee Budget & Billing Cycle
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Clearly define whether your budget ceiling is budgeted per academic year or per semester.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {/* Budget Period Selector */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                Budget Billing Period
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => setValue('budgetPeriod', 'annual')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    budgetPeriod === 'annual'
                      ? 'border-brand-600 bg-brand-50/70 shadow-xs ring-1 ring-brand-600'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-900">Annual Tuition Budget</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Calculated over 2 semesters / full year</p>
                </button>

                <button
                  type="button"
                  onClick={() => setValue('budgetPeriod', 'semester')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    budgetPeriod === 'semester'
                      ? 'border-brand-600 bg-brand-50/70 shadow-xs ring-1 ring-brand-600'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <p className="text-xs font-bold text-slate-900">Per-Semester Budget</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Single semester installment basis</p>
                </button>
              </div>
            </div>

            {/* Budget Amount Input */}
            <div className="max-w-md">
              <Input
                label={`Maximum ${budgetPeriod === 'annual' ? 'Annual' : 'Semester'} Tuition Budget (PKR)`}
                type="number"
                step="25000"
                placeholder={budgetPeriod === 'annual' ? '500000' : '250000'}
                error={errors.maxAnnualBudgetPKR?.message}
                helperText={
                  budgetPeriod === 'annual'
                    ? 'Typical ranges: Public (PKR 70k–100k), Private (PKR 250k–1.2M+)'
                    : 'Typical ranges: Public (PKR 35k–50k), Private (PKR 125k–600k+)'
                }
                {...register('maxAnnualBudgetPKR', { valueAsNumber: true })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Karachi Residential Location Card */}
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-brand-600" />
              <CardTitle className="text-sm font-bold text-slate-900">
                2. Home Area & Karachi Transit Proximity
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              We calculate realistic transit distances to campus corridors (University Road, National Highway Malir, Saddar, etc.).
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-3">
            <div className="max-w-md">
              <Select
                label="Select Your Karachi Residential Neighborhood"
                error={errors.homeLocation?.message}
                {...register('homeLocation')}
              >
                {KARACHI_LOCATIONS.map((loc) => (
                  <option key={loc.value} value={loc.value}>
                    {loc.label}
                  </option>
                ))}
                <option value="unspecified">Unspecified / Other Area (Skip distance ranking)</option>
              </Select>
            </div>

            {homeLocation === 'unspecified' ? (
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-xs text-amber-800 flex items-start gap-2">
                <Info className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                <span>
                  <strong>Distance disabled:</strong> Campus distances will be marked as "Unspecified" and transit proximity weight will be automatically redistributed between Merit and Affordability.
                </span>
              </div>
            ) : (
              <p className="text-[11px] text-slate-500">
                Selected area: <strong>{homeLocation}</strong>. Proximity scores favor campuses within comfortable daily transit radius.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Recommendation Priority Weights */}
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sliders className="h-4 w-4 text-brand-600" />
                <CardTitle className="text-sm font-bold text-slate-900">
                  3. Recommendation Priority Weights
                </CardTitle>
              </div>
              <Badge variant="outline" className="text-xs font-semibold text-brand-700 bg-brand-50 border-brand-200">
                Normalized Total: 100%
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Assign relative weights to Academic Merit, Tuition Affordability, and Transit Distance. The recommendation engine normalizes these weights consistently.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-6">
            {/* Visual Weight Distribution Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-brand-700">Merit ({normMerit}%)</span>
                <span className="text-emerald-700">Affordability ({normAfford}%)</span>
                <span className="text-amber-700">Distance ({normDist}%)</span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden flex shadow-inner">
                <div style={{ width: `${normMerit}%` }} className="bg-brand-600 transition-all" />
                <div style={{ width: `${normAfford}%` }} className="bg-emerald-600 transition-all" />
                <div style={{ width: `${normDist}%` }} className="bg-amber-500 transition-all" />
              </div>
            </div>

            {/* Weight Sliders / Controls */}
            <div className="grid gap-6 sm:grid-cols-3 pt-2">
              {/* Merit Weight */}
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Academic Merit</span>
                  <span className="font-extrabold text-sm text-brand-700">{meritWeight}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  className="w-full accent-brand-600 cursor-pointer"
                  {...register('priorities.merit', { valueAsNumber: true })}
                />
                <p className="text-[11px] text-slate-500 leading-tight">
                  Prioritizes programmes where your score safely exceeds the closing cutoff.
                </p>
              </div>

              {/* Affordability Weight */}
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Affordability</span>
                  <span className="font-extrabold text-sm text-emerald-700">{affordWeight}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  className="w-full accent-emerald-600 cursor-pointer"
                  {...register('priorities.affordability', { valueAsNumber: true })}
                />
                <p className="text-[11px] text-slate-500 leading-tight">
                  Favors degrees comfortably inside your stated tuition budget ceiling.
                </p>
              </div>

              {/* Distance Weight */}
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Transit Distance</span>
                  <span className="font-extrabold text-sm text-amber-700">{distWeight}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  className="w-full accent-amber-600 cursor-pointer"
                  {...register('priorities.distance', { valueAsNumber: true })}
                />
                <p className="text-[11px] text-slate-500 leading-tight">
                  Boosts campuses closer to your selected Karachi neighborhood.
                </p>
              </div>
            </div>

            {errors.priorities && (
              <p className="text-xs text-rose-600 font-medium">{errors.priorities.message}</p>
            )}
          </CardContent>
        </Card>

        {/* Target Academic Disciplines & Filters Card */}
        <Card className="border-slate-200 bg-white shadow-xs">
          <CardHeader className="pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-brand-600" />
              <CardTitle className="text-sm font-bold text-slate-900">
                4. Target Degree Disciplines & Sector
              </CardTitle>
            </div>
            <CardDescription className="text-xs">
              Select one or more fields of study you wish to explore.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                Preferred Academic Disciplines <span className="text-rose-500">*</span>
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
                          ? 'bg-brand-600 text-white border-brand-600 font-semibold shadow-2xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {isSelected ? '✓ ' : '+ '}
                      {disc}
                    </button>
                  )
                })}
              </div>
              {errors.disciplines && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.disciplines.message}</p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2 pt-2">
              <Select
                label="Institution Sector Preference"
                error={errors.sector?.message}
                {...register('sector')}
              >
                <option value="all">Any Sector (Public & Private)</option>
                <option value="public">Public Sector Only (NED, KU, DUHS)</option>
                <option value="private">Private Sector Only (SSUET, Habib)</option>
                <option value="semi-government">Semi-Government (FAST-NUCES)</option>
              </Select>

              <Select
                label="Campus Shift Preference"
                error={errors.shift?.message}
                {...register('shift')}
              >
                <option value="morning">Morning Shift (Open Merit)</option>
                <option value="evening">Evening / Self-Finance</option>
                <option value="any">Any Shift</option>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Navigation & Action Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <Link to="/discover">
            <Button type="button" variant="outline" className="gap-2 w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Step 1: Academic Info</span>
            </Button>
          </Link>

          <Button type="submit" className="gap-2 font-bold w-full sm:w-auto px-6 shadow-sm">
            <Sparkles className="h-4 w-4" />
            <span>Generate Step 3: Ranked Recommendations</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  )
}
