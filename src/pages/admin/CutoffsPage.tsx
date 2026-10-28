import React from 'react'
import { PageHeader } from '@/components/shared/PageHeader'
import { CutoffsManagement } from '@/features/admin/CutoffsManagement'

export const CutoffsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Admission Cutoff Calibration"
        description="Review multi-year closing aggregates and calibrate projected 2025 admission thresholds."
      />
      <CutoffsManagement />
    </div>
  )
}
