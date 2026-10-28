import React from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { StatCard } from '@/components/shared/StatCard'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import {
  Building2,
  BookOpen,
  TrendingUp,
  FileText,
  ArrowRight,
} from 'lucide-react'

export const AdminDashboardPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Administrator Control Center"
        description="Manage Karachi higher education institutional profiles, degree criteria, cutoffs, and verified gazettes."
        badge={
          <span className="rounded-full bg-indigo-100 px-3 py-1 text-xs font-bold text-indigo-900 border border-indigo-200">
            System Admin
          </span>
        }
      />

      {/* KPI Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Monitored Institutions"
          value="8"
          subtitle="Public, Semi-Gov & Private"
          icon={<Building2 className="h-4 w-4 text-brand-600" />}
        />
        <StatCard
          title="Active Degree Catalog"
          value="12"
          subtitle="Undergraduate & Professional"
          icon={<BookOpen className="h-4 w-4 text-brand-600" />}
        />
        <StatCard
          title="Calibrated Cutoffs"
          value="9"
          subtitle="2021–2025 Multi-year records"
          icon={<TrendingUp className="h-4 w-4 text-brand-600" />}
        />
        <StatCard
          title="Verified Documents"
          value="6"
          subtitle="Official prospectuses & gazettes"
          icon={<FileText className="h-4 w-4 text-brand-600" />}
        />
      </div>

      {/* Quick Access Modules */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:border-slate-300 transition-all">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-brand-600" />
              <CardTitle className="text-base">University Directory Management</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Configure university contact helplines, official portals, accreditation statuses, and admission open/closed states.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/admin/universities">
              <Button variant="outline" size="sm" className="gap-1.5 w-full sm:w-auto">
                Manage Universities
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-all">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-brand-600" />
              <CardTitle className="text-base">Programme Catalog & Criteria</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Define allowed HSC intermediate groups, minimum percentage requirements, entry test weightage percentages, and fees.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/admin/programmes">
              <Button variant="outline" size="sm" className="gap-1.5 w-full sm:w-auto">
                Manage Programmes
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-all">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-brand-600" />
              <CardTitle className="text-base">Admission Cutoffs & Calibration</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Maintain closing aggregate thresholds from past sessions and calibrate projected 2025 cutoff boundaries.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/admin/cutoffs">
              <Button variant="outline" size="sm" className="gap-1.5 w-full sm:w-auto">
                Calibrate Cutoffs
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:border-slate-300 transition-all">
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-brand-600" />
              <CardTitle className="text-base">Official Document Archive</CardTitle>
            </div>
            <CardDescription className="text-xs">
              Upload and index official prospectuses, syndicate notices, fee structures, and merit list gazettes for students.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link to="/admin/documents">
              <Button variant="outline" size="sm" className="gap-1.5 w-full sm:w-auto">
                Manage Document Repository
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
