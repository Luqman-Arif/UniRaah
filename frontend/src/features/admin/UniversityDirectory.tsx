import React, { useState } from 'react'
import { useUniversities } from '@/hooks/useUniversities'
import { University } from '@/types/university'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Edit2, Building2 } from 'lucide-react'

export const UniversityDirectory: React.FC = () => {
  const { universities, isLoading, updateUniversity } = useUniversities()
  const [editingUni, setEditingUni] = useState<University | null>(null)
  const [formData, setFormData] = useState<Partial<University>>({})

  const handleOpenEdit = (uni: University) => {
    setEditingUni(uni)
    setFormData({
      name: uni.name,
      shortName: uni.shortName,
      sector: uni.sector,
      status: uni.status,
      admissionsHelpline: uni.admissionsHelpline,
      admissionsEmail: uni.admissionsEmail,
      websiteUrl: uni.websiteUrl,
    })
  }

  const handleSaveEdit = async () => {
    if (!editingUni) return
    await updateUniversity({ id: editingUni.id, updates: formData })
    setEditingUni(null)
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-16 w-full" />
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
            <TableHead>Institution</TableHead>
            <TableHead>Sector</TableHead>
            <TableHead>Location Zone</TableHead>
            <TableHead>Programmes</TableHead>
            <TableHead>Admission Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {universities.map((uni) => (
            <TableRow key={uni.id}>
              <TableCell className="font-medium">
                <div>
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Building2 className="h-4 w-4 text-brand-600 shrink-0" />
                    <span>{uni.name}</span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {uni.shortName} • Est. {uni.establishedYear}
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <Badge
                  variant={
                    uni.sector === 'Public'
                      ? 'default'
                      : uni.sector === 'Semi-Government'
                      ? 'secondary'
                      : 'outline'
                  }
                >
                  {uni.sector}
                </Badge>
              </TableCell>

              <TableCell className="text-xs text-slate-600">{uni.locationZone}</TableCell>

              <TableCell className="text-xs font-semibold text-slate-900">
                {uni.activeProgrammesCount} Active
              </TableCell>

              <TableCell>
                <Badge
                  variant={
                    uni.status === 'admissions_open'
                      ? 'success'
                      : uni.status === 'active'
                      ? 'secondary'
                      : 'destructive'
                  }
                >
                  {uni.status === 'admissions_open' ? 'Admissions Open' : 'Active'}
                </Badge>
              </TableCell>

              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenEdit(uni)}
                  className="gap-1.5 h-8 text-xs"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Edit University Dialog */}
      <Dialog
        isOpen={!!editingUni}
        onClose={() => setEditingUni(null)}
        title={`Edit ${editingUni?.shortName || 'University'}`}
        description="Update institutional contact details, admission status, and sector categorization."
        maxWidth="lg"
      >
        <div className="space-y-4 pt-2">
          <Input
            label="Full Institutional Name"
            value={formData.name || ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Short Name / Acronym"
              value={formData.shortName || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, shortName: e.target.value }))}
            />

            <Select
              label="Admission Status"
              value={formData.status || 'active'}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value as University['status'],
                }))
              }
            >
              <option value="admissions_open">Admissions Open (Fall / Spring)</option>
              <option value="active">Active (Session Ongoing)</option>
              <option value="admissions_closed">Admissions Closed</option>
            </Select>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Input
              label="Admissions Helpline"
              value={formData.admissionsHelpline || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, admissionsHelpline: e.target.value }))
              }
            />
            <Input
              label="Admissions Email"
              type="email"
              value={formData.admissionsEmail || ''}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, admissionsEmail: e.target.value }))
              }
            />
          </div>

          <Input
            label="Official Portal URL"
            value={formData.websiteUrl || ''}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, websiteUrl: e.target.value }))
            }
          />

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setEditingUni(null)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
