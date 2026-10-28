import React from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { ProgrammeManagement } from '@/features/admin/ProgrammeManagement'

export const ProgrammesPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Degree Programme Catalog"
        description="Configure university degree offerings, allowed intermediate (HSC) groups, minimum percentage requirements, and entry test weightage."
      />
      <ProgrammeManagement />
    </div>
  )
}
