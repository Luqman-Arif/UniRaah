import React, { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useStudentDashboard } from '@/hooks/useStudentDashboard'
import { useUniversities } from '@/hooks/useUniversities'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import {
  Building2,
  Search,
  Trash2,
  ExternalLink,
  MapPin,
  Phone,
  AlertTriangle,
  RotateCcw,
  Compass,
  ArrowRight,
  Filter,
} from 'lucide-react'

export const SavedUniversitiesPage: React.FC = () => {
  const {
    savedUniversityIds,
    removeSavedUniversity,
    clearAllSavedUniversities,
  } = useStudentDashboard()

  const { universities, isLoading } = useUniversities()

  const [searchQuery, setSearchQuery] = useState('')
  const [sectorFilter, setSectorFilter] = useState('all')
  const [uniToRemove, setUniToRemove] = useState<string | null>(null)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  // Filter saved universities
  const savedUnis = useMemo(() => {
    const list = universities.filter((u) => savedUniversityIds.includes(u.id))

    return list.filter((u) => {
      if (sectorFilter !== 'all' && u.sector !== sectorFilter) {
        return false
      }
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase()
        const matchesName = u.name.toLowerCase().includes(query) || u.shortName.toLowerCase().includes(query)
        const matchesZone = u.locationZone.toLowerCase().includes(query)
        if (!matchesName && !matchesZone) return false
      }
      return true
    })
  }, [universities, savedUniversityIds, sectorFilter, searchQuery])

  const handleConfirmRemove = (id: string) => {
    removeSavedUniversity(id)
    setUniToRemove(null)
  }

  const handleConfirmClearAll = () => {
    clearAllSavedUniversities()
    setShowClearConfirm(false)
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-brand" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-navy tracking-tight">
              Saved Karachi Universities
            </h2>
            <Badge variant="outline" className="text-xs font-bold text-brand bg-brand-50 border-brand-200">
              {savedUniversityIds.length} Bookmarked
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track accredited Karachi higher education institutions, contact helplines, official portals, and admission statuses.
          </p>
        </div>

        {savedUniversityIds.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowClearConfirm(true)}
            className="gap-1.5 text-xs text-rose-600 hover:bg-rose-50 hover:border-rose-300 border-slate-200 cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear Saved Universities</span>
          </Button>
        )}
      </div>

      {/* Confirmation Modal: Clear All */}
      {showClearConfirm && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in-50">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-rose-900">Remove all saved universities?</p>
              <p className="text-[11px] text-rose-700">This will remove all {savedUniversityIds.length} institutions from your saved list.</p>
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
      {savedUniversityIds.length > 0 && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-3">
          <div className="grid gap-3 sm:grid-cols-12">
            <div className="sm:col-span-8 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search university by name or location zone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="sm:col-span-4">
              <Select
                value={sectorFilter}
                onChange={(e) => setSectorFilter(e.target.value)}
                className="h-9 text-xs"
              >
                <option value="all">All University Sectors</option>
                <option value="Public">Public Sector</option>
                <option value="Semi-Government">Semi-Government</option>
                <option value="Private">Private Sector</option>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Saved Universities Cards */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-48 rounded-2xl bg-slate-100 animate-pulse" />
          <div className="h-48 rounded-2xl bg-slate-100 animate-pulse" />
        </div>
      ) : savedUnis.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {savedUnis.map((uni) => {
            const isConfirmingRemove = uniToRemove === uni.id

            return (
              <Card
                key={uni.id}
                className="border-slate-200/90 bg-white hover:border-brand-300 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                <CardContent className="p-5 space-y-4">
                  {/* Top Bar: Name, Sector, Status */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="text-[10px] py-0 px-2 font-bold uppercase tracking-wider text-slate-700 bg-slate-50">
                          {uni.sector}
                        </Badge>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-500 font-medium">Est. {uni.establishedYear}</span>
                      </div>

                      <h3 className="text-base font-extrabold text-navy leading-snug">
                        {uni.name} ({uni.shortName})
                      </h3>
                    </div>

                    <Badge
                      variant={uni.status === 'admissions_open' ? 'success' : 'default'}
                      className="text-[10px] shrink-0 font-bold"
                    >
                      {uni.status === 'admissions_open' ? 'Admissions Open' : 'Academic Active'}
                    </Badge>
                  </div>

                  {/* Overview snippet */}
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {uni.overview}
                  </p>

                  {/* Location & Contact Meta */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-2 truncate">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{uni.address}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Phone className="h-3 w-3 text-slate-400" />
                        <span>{uni.admissionsHelpline}</span>
                      </div>

                      <a
                        href={uni.websiteUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-brand hover:underline inline-flex items-center gap-1"
                      >
                        Official Portal <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                  {/* Accreditations Pills */}
                  <div className="flex flex-wrap items-center gap-1 pt-1">
                    {uni.accreditations.map((acc, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700"
                      >
                        {acc}
                      </span>
                    ))}
                  </div>

                  {/* Card Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    {isConfirmingRemove ? (
                      <div className="flex items-center gap-1.5 animate-in fade-in-50">
                        <span className="text-[11px] font-bold text-rose-700">Remove?</span>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleConfirmRemove(uni.id)}
                          className="h-7 px-2 text-[11px] bg-rose-600 hover:bg-rose-700"
                        >
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setUniToRemove(null)}
                          className="h-7 px-2 text-[11px]"
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setUniToRemove(uni.id)}
                        className="h-8 px-2 text-xs text-slate-400 hover:text-rose-600 gap-1 cursor-pointer"
                        title="Remove from saved universities"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Remove</span>
                      </Button>
                    )}

                    <Link to="/student/recommendations">
                      <Button size="sm" className="h-8 px-3 text-xs gap-1 bg-brand hover:bg-brand-700 text-white cursor-pointer">
                        <span>View Programmes</span>
                        <ArrowRight className="h-3 w-3" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      ) : savedUniversityIds.length > 0 ? (
        /* Empty matching query */
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center space-y-3">
          <Filter className="h-8 w-8 text-slate-400 mx-auto" />
          <h3 className="text-base font-extrabold text-navy">No saved universities match your filter</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your search query or selecting &quot;All University Sectors&quot;.
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSearchQuery('')
              setSectorFilter('all')
            }}
            className="text-xs gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            Reset Filters
          </Button>
        </div>
      ) : (
        /* Empty state */
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-brand-50 text-brand mx-auto flex items-center justify-center border border-brand-200">
            <Building2 className="h-8 w-8 text-brand" />
          </div>

          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-extrabold text-navy">No Universities Saved Yet</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Bookmark target Karachi institutions to easily monitor admission calendars, contact information, and degree catalogs in one place.
            </p>
          </div>

          <div className="pt-2">
            <Link to="/student/recommendations">
              <Button size="lg" className="gap-2 font-bold bg-brand hover:bg-brand-700 text-white cursor-pointer shadow-xs">
                <Compass className="h-4 w-4" />
                <span>Explore Karachi Universities</span>
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
