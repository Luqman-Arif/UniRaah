import React from 'react'
import { Link } from 'react-router-dom'
import { Programme } from '@/types/programme'
import { Dialog } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatPKR } from '@/lib/utils'
import {
  Calendar,
  Clock,
  Coins,
  GraduationCap,
  Users,
  Award,
  ExternalLink,
} from 'lucide-react'

interface ProgrammeDetailModalProps {
  programme: Programme | null
  isOpen: boolean
  onClose: () => void
}

export const ProgrammeDetailModal: React.FC<ProgrammeDetailModalProps> = ({
  programme,
  isOpen,
  onClose,
}) => {
  if (!programme) return null

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={programme.name}
      description={`${programme.universityName} (${programme.universityShortName})`}
      maxWidth="xl"
    >
      <div className="space-y-6 pt-2">
        {/* Programme badges */}
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default" className="gap-1">
            <GraduationCap className="h-3 w-3" />
            {programme.degreeType}
          </Badge>
          <Badge variant="secondary">Sector: {programme.universitySector}</Badge>
          <Badge variant="success" className="gap-1">
            <Award className="h-3 w-3" />
            {programme.accreditationBody}
          </Badge>
        </div>

        {/* Overview */}
        <div className="rounded-lg bg-slate-50 p-3.5 text-xs text-slate-700 leading-relaxed border border-slate-200">
          <p className="font-semibold text-slate-900 mb-1">Academic Overview</p>
          {programme.overview}
        </div>

        {/* Quick Facts Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-white p-3 text-center">
            <Coins className="mx-auto h-4 w-4 text-brand-600 mb-1" />
            <p className="text-[10px] uppercase font-semibold text-slate-400">Annual Tuition</p>
            <p className="text-sm font-bold text-slate-900">{formatPKR(programme.annualTuitionFeePKR)}</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-3 text-center">
            <Clock className="mx-auto h-4 w-4 text-brand-600 mb-1" />
            <p className="text-[10px] uppercase font-semibold text-slate-400">Duration</p>
            <p className="text-sm font-bold text-slate-900">{programme.durationYears} Years</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-3 text-center">
            <Users className="mx-auto h-4 w-4 text-brand-600 mb-1" />
            <p className="text-[10px] uppercase font-semibold text-slate-400">Total Seats</p>
            <p className="text-sm font-bold text-slate-900">{programme.totalSeats}</p>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-3 text-center">
            <Calendar className="mx-auto h-4 w-4 text-brand-600 mb-1" />
            <p className="text-[10px] uppercase font-semibold text-slate-400">Shifts</p>
            <p className="text-sm font-bold text-slate-900">{programme.shifts.join(' / ')}</p>
          </div>
        </div>

        {/* Eligibility & Merit Formula */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Eligibility & Merit Determination
          </h4>

          <div className="rounded-lg border border-slate-200 p-4 space-y-3">
            <div className="flex items-start justify-between text-xs">
              <span className="text-slate-500">Allowed Intermediate Groups:</span>
              <span className="font-semibold text-slate-800 text-right max-w-xs">
                {programme.eligibleHSCGroups.join(', ')}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-2">
              <span className="text-slate-500">Minimum HSC Part-1 Threshold:</span>
              <span className="font-bold text-brand-700">{programme.minHscPercentage}%</span>
            </div>

            <div className="flex items-start justify-between text-xs border-t border-slate-100 pt-2">
              <span className="text-slate-500">Entry Test Formula:</span>
              <div className="text-right">
                <span className="font-semibold text-slate-900 block">
                  {programme.testWeightage.testName}
                </span>
                <span className="text-slate-500 text-[11px]">
                  {programme.testWeightage.entryTestPercentage}% Test +{' '}
                  {programme.testWeightage.hscPercentage}% HSC{' '}
                  {programme.testWeightage.sscPercentage
                    ? `+ ${programme.testWeightage.sscPercentage}% SSC`
                    : ''}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
          <Link
            to={`/student/programmes/${programme.id}`}
            onClick={onClose}
            className="text-xs font-semibold text-brand hover:underline flex items-center gap-1"
          >
            <span>Open Dedicated Programme Page</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Dialog>
  )
}
