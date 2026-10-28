import React from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { AdmissionAdvisorChat } from '@/features/advisor/AdmissionAdvisorChat'

export const AdvisorPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Admission Decision Advisor"
        description="Interact with our specialized advisory engine for context-aware guidance on Karachi board policies, entry tests, and campus options."
      />
      <AdmissionAdvisorChat />
    </div>
  )
}
