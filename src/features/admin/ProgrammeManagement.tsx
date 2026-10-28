import React, { useState } from 'react'
import { useProgrammes } from '@/hooks/useProgrammes'
import { Programme } from '@/types/programme'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { formatPKR } from '@/lib/utils'
import { Plus, Edit2, BookOpen } from 'lucide-react'

export const ProgrammeManagement: React.FC = () => {
  const { programmes, isLoading, updateProgramme, createProgramme } = useProgrammes()
  const [editingProg, setEditingProg] = useState<Programme | null>(null)
  const [isCreating, setIsCreating] = useState(false)

  const [formData, setFormData] = useState<Partial<Programme>>({
    name: '',
    universityName: 'NED University of Engineering & Technology',
    universityShortName: 'NED UET',
    universitySector: 'Public',
    degreeType: 'Undergraduate BS',
    discipline: 'Computer Science & AI',
    minHscPercentage: 60,
    annualTuitionFeePKR: 100000,
    durationYears: 4,
    totalSeats: 100,
    shifts: ['Morning'],
    eligibleHSCGroups: ['Pre-Engineering', 'Computer Science'],
    testWeightage: {
      entryTestPercentage: 50,
      hscPercentage: 50,
      sscPercentage: 0,
      testName: 'General Pre-Admission Entry Test',
    },
    accreditationBody: 'NCEAC / HEC',
    overview: 'Undergraduate academic degree in Karachi.',
  })

  const handleOpenEdit = (prog: Programme) => {
    setEditingProg(prog)
    setFormData(prog)
  }

  const handleSave = async () => {
    if (editingProg) {
      await updateProgramme({ id: editingProg.id, updates: formData })
      setEditingProg(null)
    } else if (isCreating) {
      await createProgramme({
        universityId: 'ned-uet',
        universityName: formData.universityName || 'NED University',
        universityShortName: formData.universityShortName || 'NED UET',
        universitySector: formData.universitySector || 'Public',
        name: formData.name || 'New Degree Programme',
        degreeType: formData.degreeType || 'Undergraduate BS',
        discipline: formData.discipline || 'Computer Science & AI',
        eligibleHSCGroups: formData.eligibleHSCGroups || ['Pre-Engineering'],
        minHscPercentage: formData.minHscPercentage || 60,
        annualTuitionFeePKR: formData.annualTuitionFeePKR || 100000,
        durationYears: formData.durationYears || 4,
        totalSeats: formData.totalSeats || 100,
        shifts: formData.shifts || ['Morning'],
        testWeightage: formData.testWeightage || {
          entryTestPercentage: 50,
          hscPercentage: 50,
          sscPercentage: 0,
          testName: 'Admission Test',
        },
        accreditationBody: formData.accreditationBody || 'HEC Recognized',
        overview: formData.overview || '',
      })
      setIsCreating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500 font-medium">
          Showing {programmes.length} degree programmes across Karachi universities
        </p>
        <Button size="sm" onClick={() => setIsCreating(true)} className="gap-1.5 h-8 text-xs">
          <Plus className="h-3.5 w-3.5" />
          Add Programme
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Programme</TableHead>
            <TableHead>University</TableHead>
            <TableHead>Min HSC %</TableHead>
            <TableHead>Annual Tuition</TableHead>
            <TableHead>Seats</TableHead>
            <TableHead>Formula</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {programmes.map((prog) => (
            <TableRow key={prog.id}>
              <TableCell className="font-semibold text-slate-900">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-brand-600 shrink-0" />
                  <span>{prog.name}</span>
                </div>
                <span className="text-[11px] font-normal text-slate-500">{prog.degreeType}</span>
              </TableCell>

              <TableCell className="text-xs text-slate-700">
                {prog.universityShortName}
              </TableCell>

              <TableCell>
                <Badge variant="outline" className="font-bold text-slate-800">
                  {prog.minHscPercentage}%
                </Badge>
              </TableCell>

              <TableCell className="text-xs font-medium text-slate-800">
                {formatPKR(prog.annualTuitionFeePKR)}
              </TableCell>

              <TableCell className="text-xs text-slate-600">{prog.totalSeats}</TableCell>

              <TableCell className="text-[11px] text-slate-500 max-w-xs truncate">
                {prog.testWeightage.entryTestPercentage}% Test + {prog.testWeightage.hscPercentage}% HSC
              </TableCell>

              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(prog)}
                  className="gap-1.5 h-7 text-xs"
                >
                  <Edit2 className="h-3 w-3" />
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit or Create Dialog */}
      <Dialog
        isOpen={!!editingProg || isCreating}
        onClose={() => {
          setEditingProg(null)
          setIsCreating(false)
        }}
        title={editingProg ? `Edit ${editingProg.name}` : 'Add New Degree Programme'}
        description="Configure academic requirements, entry test weightage, and annual fees."
        maxWidth="lg"
      >
        <div className="space-y-4 pt-2">
          <Input
            label="Programme Title"
            value={formData.name || ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="e.g. BS Data Science"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Minimum HSC Percentage (%)"
              type="number"
              value={formData.minHscPercentage || 60}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  minHscPercentage: Number(e.target.value),
                }))
              }
            />

            <Input
              label="Annual Tuition Fee (PKR)"
              type="number"
              step="5000"
              value={formData.annualTuitionFeePKR || 100000}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  annualTuitionFeePKR: Number(e.target.value),
                }))
              }
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Total Available Seats"
              type="number"
              value={formData.totalSeats || 100}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  totalSeats: Number(e.target.value),
                }))
              }
            />

            <Input
              label="Duration (Years)"
              type="number"
              value={formData.durationYears || 4}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  durationYears: Number(e.target.value),
                }))
              }
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setEditingProg(null)
                setIsCreating(false)
              }}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save Programme
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
