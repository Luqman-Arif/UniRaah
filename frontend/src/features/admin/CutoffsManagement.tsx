import React, { useState } from 'react'
import { useCutoffs } from '@/hooks/useCutoffs'
import { CutoffPrediction } from '@/types/admission'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { Edit2, TrendingUp } from 'lucide-react'

export const CutoffsManagement: React.FC = () => {
  const { cutoffs, isLoading, updateCutoff } = useCutoffs()
  const [editingCutoff, setEditingCutoff] = useState<CutoffPrediction | null>(null)
  const [formData, setFormData] = useState<{
    projectedAggregate: number
    minRange: number
    maxRange: number
  }>({ projectedAggregate: 80, minRange: 78, maxRange: 82 })

  const handleOpenEdit = (item: CutoffPrediction) => {
    setEditingCutoff(item)
    setFormData({
      projectedAggregate: item.predictedCutoffRange.projectedAggregate,
      minRange: item.predictedCutoffRange.min,
      maxRange: item.predictedCutoffRange.max,
    })
  }

  const handleSave = async () => {
    if (!editingCutoff) return
    await updateCutoff({
      programmeId: editingCutoff.programmeId,
      updates: {
        predictedCutoffRange: {
          projectedAggregate: formData.projectedAggregate,
          min: formData.minRange,
          max: formData.maxRange,
        },
      },
    })
    setEditingCutoff(null)
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Degree Programme</TableHead>
            <TableHead>University</TableHead>
            <TableHead>2024 Cutoff</TableHead>
            <TableHead>2023 Cutoff</TableHead>
            <TableHead>2025 Projected</TableHead>
            <TableHead>Confidence</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cutoffs.map((item) => {
            const cut2024 = item.historicalCutoffs.find((h) => h.year === 2024)?.closingAggregate
            const cut2023 = item.historicalCutoffs.find((h) => h.year === 2023)?.closingAggregate

            return (
              <TableRow key={item.programmeId}>
                <TableCell className="font-semibold text-slate-900">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="h-3.5 w-3.5 text-brand-600 shrink-0" />
                    <span>{item.programmeName}</span>
                  </div>
                </TableCell>

                <TableCell className="text-xs text-slate-700">
                  {item.universityShortName}
                </TableCell>

                <TableCell className="font-medium text-slate-800">
                  {cut2024 ? `${cut2024}%` : '—'}
                </TableCell>

                <TableCell className="text-slate-500">
                  {cut2023 ? `${cut2023}%` : '—'}
                </TableCell>

                <TableCell>
                  <Badge variant="default" className="font-bold text-brand-700 bg-brand-50">
                    {item.predictedCutoffRange.projectedAggregate}% ({item.predictedCutoffRange.min}%–{item.predictedCutoffRange.max}%)
                  </Badge>
                </TableCell>

                <TableCell>
                  <Badge
                    variant={item.confidenceLevel === 'High' ? 'success' : 'secondary'}
                  >
                    {item.confidenceLevel}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(item)}
                    className="gap-1.5 h-7 text-xs"
                  >
                    <Edit2 className="h-3 w-3" />
                    Calibrate
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>

      <Dialog
        isOpen={!!editingCutoff}
        onClose={() => setEditingCutoff(null)}
        title={`Calibrate Cutoff: ${editingCutoff?.programmeName}`}
        description="Adjust machine learning projection thresholds and acceptable variance bounds for Round 1."
        maxWidth="md"
      >
        <div className="space-y-4 pt-2">
          <Input
            label="Projected 2025 Aggregate (%)"
            type="number"
            step="0.1"
            value={formData.projectedAggregate}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                projectedAggregate: Number(e.target.value),
              }))
            }
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Minimum Bound (%)"
              type="number"
              step="0.1"
              value={formData.minRange}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  minRange: Number(e.target.value),
                }))
              }
            />

            <Input
              label="Maximum Bound (%)"
              type="number"
              step="0.1"
              value={formData.maxRange}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  maxRange: Number(e.target.value),
                }))
              }
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setEditingCutoff(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save Calibration
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
