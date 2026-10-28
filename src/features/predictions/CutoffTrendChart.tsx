import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { CutoffPrediction } from '@/types/admission'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface CutoffTrendChartProps {
  cutoffData: CutoffPrediction
  studentAggregate: number
}

export const CutoffTrendChart: React.FC<CutoffTrendChartProps> = ({
  cutoffData,
  studentAggregate,
}) => {
  // Combine historical cutoffs with 2025 projection
  const chartData = [
    ...cutoffData.historicalCutoffs.map((item) => ({
      year: item.year.toString(),
      cutoff: item.closingAggregate,
      type: 'Historical',
    })),
    {
      year: '2025 (Proj.)',
      cutoff: cutoffData.predictedCutoffRange.projectedAggregate,
      type: 'Projected',
    },
  ]

  const minVal = Math.floor(
    Math.min(...chartData.map((d) => d.cutoff), studentAggregate) - 3
  )
  const maxVal = Math.ceil(
    Math.max(...chartData.map((d) => d.cutoff), studentAggregate) + 3
  )

  const isAboveProjected =
    studentAggregate >= cutoffData.predictedCutoffRange.projectedAggregate

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-base">
              {cutoffData.programmeName} — {cutoffData.universityShortName}
            </CardTitle>
            <CardDescription className="text-xs">
              Historical closing aggregates (2021–2024) and projected 2025 threshold.
            </CardDescription>
          </div>
          <Badge
            variant={isAboveProjected ? 'success' : 'warning'}
            className="self-start sm:self-auto text-xs"
          >
            {isAboveProjected
              ? 'Your score meets projected trend'
              : 'Competitive cutoff threshold'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-2">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 25, left: -15, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="year"
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis
                domain={[minVal, maxVal]}
                tick={{ fill: '#64748b', fontSize: 11 }}
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
                unit="%"
              />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(1)}%`, 'Closing Aggregate']}
                contentStyle={{
                  backgroundColor: '#ffffff',
                  borderColor: '#e2e8f0',
                  borderRadius: '0.5rem',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgb(15 23 42 / 0.08)',
                }}
              />
              {/* Reference line for student's current projected aggregate */}
              <ReferenceLine
                y={studentAggregate}
                stroke="#4f46e5"
                strokeDasharray="4 4"
                strokeWidth={2}
                label={{
                  value: `Your Score (${studentAggregate.toFixed(1)}%)`,
                  fill: '#4f46e5',
                  fontSize: 11,
                  position: 'insideTopRight',
                  fontWeight: 600,
                }}
              />
              <Line
                type="monotone"
                dataKey="cutoff"
                name="Closing Cutoff"
                stroke="#0f172a"
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#0f172a' }}
                activeDot={{ r: 6, fill: '#4f46e5' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-slate-100 pt-3 text-xs text-slate-500 gap-2">
          <span>Formula: <strong className="text-slate-700">{cutoffData.meritFormulaDescription}</strong></span>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-brand bg-brand-50 border border-brand-200 px-2 py-0.5 rounded-full">
              Projected 2025 Range: {cutoffData.predictedCutoffRange.min}% – {cutoffData.predictedCutoffRange.max}% (±{((cutoffData.predictedCutoffRange.max - cutoffData.predictedCutoffRange.min) / 2).toFixed(1)}%)
            </span>
          </div>
        </div>

        {cutoffData.disclaimer && (
          <p className="mt-2 text-[10px] text-slate-400 italic">
            *{cutoffData.disclaimer}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
