import React from 'react'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Tabs } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'

interface FilterBarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedDiscipline: string
  onDisciplineChange: (discipline: string) => void
  selectedSector: string
  onSectorChange: (sector: string) => void
  activeCategoryTab: string
  onCategoryTabChange: (tabId: string) => void
  categoryCounts: {
    all: number
    safety: number
    target: number
    reach: number
  }
  onResetFilters: () => void
}

export const ProgrammeFilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedDiscipline,
  onDisciplineChange,
  selectedSector,
  onSectorChange,
  activeCategoryTab,
  onCategoryTabChange,
  categoryCounts,
  onResetFilters,
}) => {
  const tabs = [
    { id: 'all', label: 'All Ranked', count: categoryCounts.all },
    { id: 'Safety', label: 'Safety', count: categoryCounts.safety },
    { id: 'Target', label: 'Target', count: categoryCounts.target },
    { id: 'Reach', label: 'Reach', count: categoryCounts.reach },
  ]

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    selectedDiscipline !== 'all' ||
    selectedSector !== 'all' ||
    activeCategoryTab !== 'all'

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 shadow-xs">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Category Tabs */}
        <Tabs
          tabs={tabs}
          activeTab={activeCategoryTab}
          onChange={onCategoryTabChange}
          className="w-full sm:w-auto"
        />

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onResetFilters}
            className="text-xs text-slate-500 hover:text-slate-800 self-start lg:self-auto gap-1"
          >
            <X className="h-3.5 w-3.5" />
            Clear Filters
          </Button>
        )}
      </div>

      {/* Search and Dropdowns */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div className="relative">
          <Input
            placeholder="Search by degree or university..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        </div>

        <Select
          value={selectedDiscipline}
          onChange={(e) => onDisciplineChange(e.target.value)}
        >
          <option value="all">All Disciplines</option>
          <option value="Computer Science & AI">Computer Science & AI</option>
          <option value="Software Engineering">Software Engineering</option>
          <option value="Electrical & Mechanical Engineering">Engineering</option>
          <option value="Business Administration & Management">Business & Management</option>
          <option value="Medicine & Allied Health">Medicine & Health</option>
        </Select>

        <Select
          value={selectedSector}
          onChange={(e) => onSectorChange(e.target.value)}
        >
          <option value="all">All Sectors</option>
          <option value="Public">Public (NED, KU, DUHS)</option>
          <option value="Private">Private (SSUET, Habib)</option>
          <option value="Semi-Government">Semi-Government (FAST-NUCES)</option>
        </Select>
      </div>
    </div>
  )
}
