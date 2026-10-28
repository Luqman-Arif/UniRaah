import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStudentDashboard } from '@/hooks/useStudentDashboard'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  History,
  Trash2,
  BookOpen,
  Building2,
  BotMessageSquare,
  Filter,
  ArrowRight,
  Clock,
  AlertTriangle,
} from 'lucide-react'

export const SearchHistoryPage: React.FC = () => {
  const { history, clearHistory } = useStudentDashboard()
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  const handleConfirmClear = () => {
    clearHistory()
    setShowClearConfirm(false)
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'programme':
        return <BookOpen className="h-4 w-4 text-brand" />
      case 'university':
        return <Building2 className="h-4 w-4 text-violet-600" />
      case 'advisor':
        return <BotMessageSquare className="h-4 w-4 text-emerald-600" />
      case 'filter':
        return <Filter className="h-4 w-4 text-amber-600" />
      default:
        return <Clock className="h-4 w-4 text-slate-400" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'programme':
        return 'Degree View'
      case 'university':
        return 'Campus Record'
      case 'advisor':
        return 'Advisory Inquiry'
      case 'filter':
        return 'Filter Search'
      default:
        return 'Activity'
    }
  }

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-brand" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-navy tracking-tight">
              Search & Activity History
            </h2>
            <Badge variant="outline" className="text-xs font-bold text-slate-700 bg-slate-50">
              {history.length} Events Logged
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review your recently viewed degree programmes, advisory inquiries, and recommendation searches.
          </p>
        </div>

        {history.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowClearConfirm(true)}
            className="gap-1.5 text-xs text-rose-600 hover:bg-rose-50 hover:border-rose-300 border-slate-200 cursor-pointer self-start sm:self-auto"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear History</span>
          </Button>
        )}
      </div>

      {/* Confirmation Modal: Clear History */}
      {showClearConfirm && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/70 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in-50">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0" />
            <div>
              <p className="text-xs font-bold text-rose-900">Clear all recent activity?</p>
              <p className="text-[11px] text-rose-700">This will remove your local exploration history across degrees and inquiries.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <Button size="sm" variant="outline" onClick={() => setShowClearConfirm(false)} className="h-8 text-xs">
              Cancel
            </Button>
            <Button size="sm" onClick={handleConfirmClear} className="h-8 text-xs bg-rose-600 hover:bg-rose-700 text-white">
              Yes, Clear History
            </Button>
          </div>
        </div>
      )}

      {/* History Items List */}
      {history.length > 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white shadow-xs divide-y divide-slate-100 overflow-hidden">
          {history.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 hover:bg-slate-50/70 transition-colors group"
            >
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-white group-hover:shadow-xs transition-all">
                  {getTypeIcon(item.type)}
                </div>

                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {getTypeLabel(item.type)}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-[10px] text-slate-400">{item.timestamp}</span>
                  </div>

                  <Link
                    to={item.path}
                    className="text-sm font-extrabold text-navy hover:text-brand transition-colors block truncate"
                  >
                    {item.title}
                  </Link>

                  {item.subtitle && (
                    <p className="text-xs text-slate-500 line-clamp-1">{item.subtitle}</p>
                  )}
                </div>
              </div>

              <Link to={item.path} className="shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-2.5 text-xs text-slate-600 hover:text-brand group-hover:bg-white"
                >
                  <span>Revisit</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center space-y-4">
          <div className="h-16 w-16 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <History className="h-8 w-8" />
          </div>

          <div className="space-y-1 max-w-md mx-auto">
            <h3 className="text-lg font-extrabold text-navy">No History Recorded</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              As you explore degree recommendations, compare programmes, and ask questions to the AI Advisor, your activity will be preserved here for rapid recall.
            </p>
          </div>

          <div className="pt-2">
            <Link to="/student/recommendations">
              <Button size="sm" className="gap-1.5 font-bold bg-brand hover:bg-brand-700 text-white">
                Start Exploring
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
