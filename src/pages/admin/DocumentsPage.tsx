import React from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { OfficialDocumentsRepository } from '@/features/admin/OfficialDocumentsRepository'

export const DocumentsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Official Document & Gazette Archive"
        description="Index and manage officially verified prospectuses, admission gazettes, and approved fee schedules."
      />
      <OfficialDocumentsRepository />
    </div>
  )
}
