import React, { useState } from 'react'
import { useOfficialDocuments } from '@/hooks/useOfficialDocuments'
import { OfficialDocument } from '@/types/document'
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { FileText, Plus, CheckCircle, Trash2 } from 'lucide-react'

export const OfficialDocumentsRepository: React.FC = () => {
  const { documents, isLoading, createDocument, deleteDocument } = useOfficialDocuments()
  const [isUploading, setIsUploading] = useState(false)

  const [newDocData, setNewDocData] = useState<{
    title: string
    universityName: string
    universityShortName: string
    category: OfficialDocument['category']
    academicSession: string
    fileSizeMb: number
    description: string
  }>({
    title: '',
    universityName: 'NED University of Engineering & Technology',
    universityShortName: 'NED UET',
    category: 'prospectus',
    academicSession: '2024-2025',
    fileSizeMb: 5.0,
    description: '',
  })

  const handleCreate = async () => {
    if (!newDocData.title.trim()) return
    await createDocument({
      universityId: 'ned-uet',
      universityName: newDocData.universityName,
      universityShortName: newDocData.universityShortName,
      title: newDocData.title,
      category: newDocData.category,
      academicSession: newDocData.academicSession,
      fileFormat: 'PDF',
      fileSizeMb: newDocData.fileSizeMb,
      publishDate: new Date().toISOString().split('T')[0],
      downloadUrl: '#',
      verifiedByAdmin: true,
      description: newDocData.description,
    })
    setIsUploading(false)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to remove this official document record?')) {
      await deleteDocument(id)
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
          Official prospectuses, fee schedules, and merit list gazettes verified by administrators
        </p>
        <Button size="sm" onClick={() => setIsUploading(true)} className="gap-1.5 h-8 text-xs">
          <Plus className="h-3.5 w-3.5" />
          Add Official Record
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document Title</TableHead>
            <TableHead>Institution</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Session</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell className="font-semibold text-slate-900">
                <div className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-brand-600 shrink-0" />
                  <span>{doc.title}</span>
                </div>
                <span className="text-[11px] font-normal text-slate-500 truncate max-w-sm block">
                  {doc.description}
                </span>
              </TableCell>

              <TableCell className="text-xs text-slate-700">
                {doc.universityShortName}
              </TableCell>

              <TableCell>
                <Badge variant="outline" className="capitalize text-slate-700">
                  {doc.category.replace('_', ' ')}
                </Badge>
              </TableCell>

              <TableCell className="text-xs text-slate-600">{doc.academicSession}</TableCell>

              <TableCell className="text-xs text-slate-500">{doc.fileSizeMb} MB</TableCell>

              <TableCell>
                <Badge variant="success" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Verified
                </Badge>
              </TableCell>

              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(doc.id)}
                  className="h-7 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                  aria-label="Delete document"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        isOpen={isUploading}
        onClose={() => setIsUploading(false)}
        title="Add Verified University Document"
        description="Index an official university prospectus, merit cutoff gazette, or approved fee schedule."
        maxWidth="md"
      >
        <div className="space-y-4 pt-2">
          <Input
            label="Document Title"
            placeholder="e.g. Round 2 Closing Aggregate Gazette Fall 2024"
            value={newDocData.title}
            onChange={(e) => setNewDocData((prev) => ({ ...prev, title: e.target.value }))}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Document Type"
              value={newDocData.category}
              onChange={(e) =>
                setNewDocData((prev) => ({
                  ...prev,
                  category: e.target.value as OfficialDocument['category'],
                }))
              }
            >
              <option value="prospectus">Prospectus / Brochure</option>
              <option value="merit_list">Official Merit List Gazette</option>
              <option value="fee_schedule">Tuition Fee Schedule</option>
              <option value="gazette_notification">Syndicate / HEC Notification</option>
            </Select>

            <Input
              label="Academic Session"
              placeholder="e.g. 2024-2025"
              value={newDocData.academicSession}
              onChange={(e) =>
                setNewDocData((prev) => ({ ...prev, academicSession: e.target.value }))
              }
            />
          </div>

          <Input
            label="Brief Description / Summary"
            placeholder="e.g. Official merit list for morning shift computing programs"
            value={newDocData.description}
            onChange={(e) => setNewDocData((prev) => ({ ...prev, description: e.target.value }))}
          />

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button variant="outline" size="sm" onClick={() => setIsUploading(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleCreate}>
              Index Document
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  )
}
