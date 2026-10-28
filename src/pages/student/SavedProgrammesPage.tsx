import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useStudentDashboard } from '@/hooks/useStudentDashboard'
import { useProgrammes } from '@/hooks/useProgrammes'
import { useRecommendations } from '@/hooks/useRecommendations'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { MatchBadge } from '@/components/shared/MatchBadge'
import { formatPKR } from '@/lib/utils'
import {
  Bookmark,
  Search,
  Scale,
  Trash2,
  Building2,
  Compass,
  ArrowRight,
  Filter,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react'

export const SavedProgrammesPage: React.FC = () => {
  const {
    savedProgrammeIds,
    removeSavedProgramme,
    clearAllSavedProgrammes,
    toggleCompareProgramme,
    isInCompare,
    compareProgrammeIds,
  } = useStudentDashboard()

  const { programmes, isLoading } = useProgrammes()
  const { recommendations } = useRecommendations()

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState('')
  const [sectorFilter, setSectorFilter] = useState('all')
  const [disciplineFilter, setDisciplineFilter] = useState('all')
  const [programmeToRemove, setProgrammeToRemove] = useState<string | null>(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  // Filter saved programmes
  const savedProgrammes = useMemo(() => {
    const list = programmes.filter((p) => savedProgrammeIds.includes(p.id))

    return list.filter((p) => {
      // Sector filter
      if (sectorFilter !== 'all' && p.universitySector !== sectorFilter) {
        return false
      }
      // Discipline filter
      if (disciplineFilter !== 'all' && p.discipline !== disciplineFilter) {
        return false
      }
      // Search Query filter
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase()
        const matchesName = p.name.toLowerCase().includes(query)
        const matchesUni =
          p.universityName.toLowerCase().includes(query) ||
          p.universityShortName.toLowerCase().includes(query)
        const matchesDisc = p.discipline.toLowerCase().includes(query)
        if (!matchesName && !matchesUni && !matchesDisc) return false
      }
      return true
    })
  }, [programmes, savedProgrammeIds, sectorFilter, disciplineFilter, searchQuery])

  // Get recommendation data map for matching badges
  const recMap = useMemo(() => {
    const map = new Map<string, (typeof recommendations)[0]>()
    recommendations.forEach((r) => map.set(r.programme.id, r))
    return map
  }, [recommendations])

  // Unique disciplines for filter dropdown
  const uniqueDisciplines = useMemo(() => {
    const set = new Set<string>()
    programmes.forEach((p) => set.add(p.discipline))
    return Array.from(set)
  }, [programmes])

  const handleConfirmRemove = (id: string) => {
    removeSavedProgramme(id)
    setProgrammeToRemove(null)
  }

  const handleConfirmClearAll = () => {
    clearAllSavedProgrammes()
    setShowClearConfirm(false)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-brand" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-navy tracking-tight">
              Saved Degree Programmes
            </h2>
            <Badge variant="outline" className="text-xs font-bold text-brand bg-brand-50 border-brand-200">
              {savedProgrammeIds.length} Shortlisted
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review and organize your shortlisted degrees. You can open any saved degree directly or compare them side-by-side.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {savedProgrammeIds.length >= 2 && (
            <Link to="/student/compare">
              <Button size="sm" className="gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer">
                <Scale className="h-3.5 w-3.5" />
                <span>Compare Selected ({compareProgrammeIds.length})</span>
              </Button>
            </Link>
          )}

          {savedProgrammeIds.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowClearConfirm(true)}
              className="gap-1.5 text-xs text-rose-600 hover:bg-rose-50 hover:border-rose-300 border-slate-200 cursor-pointer"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear Shortlist</span>
            </Button>
          )}
        </div>
      </div>

      {/* Confirmation Modal: Clear All */}
      {showClearConfirm && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in-50">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-rose-900">Are you sure you want to clear your entire shortlist?</p>
              <p className="text-[11px] text-rose-700">This will remove all {savedProgrammeIds.length} saved degree records.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button size="sm" variant="outline" onClick={() => setShowClearConfirm(false)} className="h-8 text-xs">
              Cancel
            </Button>
            <Button size="sm" onClick={handleConfirmClearAll} className="h-8 text-xs bg-rose-600 hover:bg-rose-700 text-white">
              Yes, Clear All
            </Button>
          </div>
        </div>
      )}

      {/* Search & Filter Toolbar */}
      {savedProgrammeIds.length > 0 && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-3">
          <div className="grid gap-3 sm:grid-cols-12">
            <div className="sm:col-span-6 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search saved degree or university..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="sm:col-span-3">
              <Select
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                className="h-9 text-xs"
              >
                <option value="all">All University Sectors</option>
                <option value="Public">Public Universities</option>
                <option value="Semi-Government">Semi-Government</option>
                <option value="Private">Private Universities</option>
              </Select>
            </div>

            <div className="sm:col-span-3">
              <Select
                value={disciplineFilter}
                onChange={(e) => setDisciplineFilter(e.target.value)}
                className="h-9 text-xs"
              >
                <option value="all">All Academic Disciplines</option>
                {uniqueDisciplines.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Saved Programmes Grid / List */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-44 rounded-2xl bg-slate-100 animate-pulse" />
          <div className="h-44 rounded-2xl bg-slate-100 animate-pulse" />
        </div>
      ) : savedProgrammes.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {savedProgrammes.map((programme) => {
            const rec = recMap.get(programme.id)
            const inCompare = isInCompare(programme.id)
            const isConfirmingRemove = programmeToRemove === programme.id

            return (
              <Card
                key={programme.id}
                className="border-slate-200/90 bg-white hover:border-brand-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <CardContent className="p-5 space-y-4">
                  {/* Top: University + Match Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1">
                          <Building2 className="h-3.5 w-3.5 text-slate-400" />
                          {programme.universityShortName}
                        </span>
                        <span className="text-slate-300">•</span>
                        <Badge variant="outline" className="text-[10px] py-0 px-1.5 font-semibold text-slate-600">
                          {programme.universitySector}
                        </Badge>
                      </div>

                      <Link
                        to={`/student/programmes/${programme.id}`}
                        className="text-base font-extrabold text-navy hover:text-brand transition-colors block truncate"
                      >
                        {programme.name}
                      </Link>
                    </div>

                    {rec && (
                      <div className="shrink-0">
                        <MatchBadge category={rec.matchCategory} score={rec.recommendationScore} />
                      </div>
                    )}
                  </div>

                  {/* Criteria Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-100">
                    <div className="p-2 rounded-lg bg-slate-50 space-y-0.5">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">Annual Tuition</span>
                      <p className="font-bold text-slate-800">{formatPKR(programme.annualTuitionFeePKR)}</p>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 space-y-0.5">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">Min HSC Required</span>
                      <p className="font-bold text-slate-800">{programme.minHscPercentage}% Marks</p>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 space-y-0.5">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">Entry Formula</span>
                      <p className="font-bold text-slate-800 truncate" title={programme.testWeightage.testName}>
                        {programme.testWeightage.testName}
                      </p>
                    </div>

                    <div className="p-2 rounded-lg bg-slate-50 space-y-0.5">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">Accreditation</span>
                      <p className="font-bold text-slate-800 truncate" title={programme.accreditationBody}>
                        {programme.accreditationBody}
                      </p>
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    {/* Remove Action with confirm guard */}
                    {isConfirmingRemove ? (
                      <div className="flex items-center gap-1.5 animate-in fade-in-50">
                        <span className="text-[11px] font-bold text-rose-700">Remove?</span>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleConfirmRemove(programme.id)}
                          className="h-7 px-2 text-[11px] bg-rose-600 hover:bg-rose-700"
                        >
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setProgrammeToRemove(null)}
                          className="h-7 px-2 text-[11px]"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setProgrammeToRemove(programme.id)}
                        className="h-8 px-2 text-xs text-slate-400 hover:text-rose-600 gap-1 cursor-pointer"
                        title="Remove from saved shortlist"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remove</span>
                      </Button>
                    )}

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleCompareProgramme(programme.id)}
                        className={`h-8 px-2.5 text-xs gap-1 cursor-pointer ${
                          inCompare ? 'border-emerald-300 bg-emerald-50 text-emerald-700' : 'text-slate-600'
                        }`}
                        title={inCompare ? 'Remove from compare' : 'Add to side-by-side comparison'}
                      >
                        <Scale className="h-3.5 w-3.5" />
                        <span>{inCompare ? 'In Compare' : 'Compare'}</span>
                      </Button>

                      <Link to={`/student/programmes/${programme.id}`}>
                        <Button size="sm" className="h-8 px-3 text-xs gap-1 bg-navy hover:bg-slate-800 text-white cursor-pointer">
                          <span>Details</span>
                          <ArrowRight className="h-3 w-3" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : savedProgrammeIds.length > 0 ? (
        /* Empty matching query */
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center space-y-3">
          <Filter className="h-8 w-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-extrabold text-navy">No saved programmes match your filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your search query or selecting &quot;All University Sectors&quot;.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSearchQuery('')
              setSectorFilter('all')
              setDisciplineFilter('all')
            }}
            className="text-xs gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            Reset Filters
          </Button>
        </div>
      ) : (
        /* Clean Empty State when 0 items saved */
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-brand-50 text-brand mx-auto flex items-center justify-center border border-brand-200">
            <Bookmark className="h-8 w-8 text-brand" />
          </div>

          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-extrabold text-navy">Your Shortlist is Empty</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              You haven&apos;t bookmarked any degree programmes yet. Explore our intelligent recommendations matched to your intermediate marks and save target options to track them here.
            </p>
          </div>

          <div className="pt-2">
            <Link to="/student/recommendations">
              <Button size="lg" className="gap-2 font-bold bg-brand hover:bg-brand-700 text-white cursor-pointer shadow-xs">
                <Compass className="h-4 w-4" />
                <span>Explore Degree Recommendations</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
