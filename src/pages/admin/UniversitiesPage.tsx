import React from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { UniversityDirectory } from '@/features/admin/UniversityDirectory'

export const UniversitiesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="University Directory Management"
        description="View and update institutional contact details, admission statuses, and accreditation credentials."
      />
      <UniversityDirectory />
    </div>
  )
}
