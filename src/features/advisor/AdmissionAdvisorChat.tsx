import React, { useState, useEffect, useRef } from 'react'
import { advisorService } from '@/services/mock/advisorService'
import { mockSuggestedPrompts } from '@/data/mock/advisorPresets'
import { AdvisorMessage } from '@/types/advisor'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Bot,
  User,
  Send,
  Sparkles,
  HelpCircle,
  FileText,
  AlertTriangle,
  RotateCcw,
  ExternalLink,
  Info,
} from 'lucide-react'

export const AdmissionAdvisorChat: React.FC = () => {
  const [messages, setMessages] = useState<AdvisorMessage[]>([])
  const [inputText, setInputText] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    advisorService.getInitialMessages().then((msgs) => {
      setMessages(msgs)
    })
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText
    if (!text.trim() || isTyping) return

    const userMessage: AdvisorMessage = {
      id: `msg-user-${Date.now()}`,
      sender: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputText('')
    setIsTyping(true)

    try {
      const assistantMessage = await advisorService.askQuestion(text.trim())
      setMessages((prev) => [...prev, assistantMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleResetChat = async () => {
    const initial = await advisorService.getInitialMessages()
    setMessages(initial)
  }

  return (
    <div className="space-y-6">
      {/* Explicit Prototype & Verified Grounding Banner */}
      <div className="rounded-2xl border border-brand-200 bg-gradient-to-r from-brand-50/80 via-white to-slate-50 p-4 text-xs text-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
        <div className="flex items-start gap-2.5">
          <Info className="h-4 w-4 text-brand-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold text-slate-900">
              Verified Official Advisory Engine (Deterministic Mock Service)
            </p>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Responses are strictly pre-indexed from verified university prospectuses (NED, FAST, KU, IBA, DUHS) and HEC statutory notifications. This prototype is <strong>not</strong> connected to a live LLM or live web retrieval.
            </p>
          </div>
        </div>
        <Badge variant="outline" className="bg-white border-brand-200 text-brand-700 text-[10px] font-bold shrink-0">
          HEC & University Prospectus Grounded
        </Badge>
      </div>

      {/* Suggested Starter Prompts */}
      <Card className="border-slate-200 bg-white shadow-xs">
        <CardHeader className="pb-3 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-brand-600" />
              <CardTitle className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Frequently Asked Admission Inquiries
              </CardTitle>
            </div>
            <span className="text-[11px] text-slate-400">Click any prompt to ask</span>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {mockSuggestedPrompts.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSendMessage(preset.prompt)}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs text-left transition-colors cursor-pointer shadow-2xs ${
                  preset.id === 'insufficient-evidence-demo'
                    ? 'border-amber-200 bg-amber-50/60 text-amber-900 hover:bg-amber-100/70'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-brand-300 hover:bg-brand-50/50 hover:text-brand-900'
                }`}
              >
                {preset.id === 'insufficient-evidence-demo' ? (
                  <AlertTriangle className="h-3 w-3 text-amber-600 shrink-0" />
                ) : (
                  <HelpCircle className="h-3 w-3 text-brand-600 shrink-0" />
                )}
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Chat Interface */}
      <Card className="flex flex-col h-[580px] shadow-xs border-slate-200 bg-white overflow-hidden">
        <CardHeader className="border-b border-slate-100 py-3.5 px-4 bg-slate-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-600 text-white shadow-xs">
                <Bot className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-slate-900">
                  UniRaah Admission Advisor
                </CardTitle>
                <CardDescription className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Online • Karachi Intermediate Admissions Knowledgebase
                </CardDescription>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleResetChat}
              className="text-xs text-slate-500 hover:text-slate-900 gap-1 h-8"
              title="Reset conversation"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear Chat
            </Button>
          </div>
        </CardHeader>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5 bg-slate-50/30">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user'
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold shadow-2xs ${
                    isUser ? 'bg-slate-900 text-white' : 'bg-brand-600 text-white'
                  }`}
                >
                  {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                <div className="max-w-[85%] sm:max-w-[75%] space-y-2">
                  <div
                    className={`rounded-2xl px-4 py-3.5 text-xs leading-relaxed shadow-xs ${
                      isUser
                        ? 'bg-brand-600 text-white rounded-tr-none'
                        : msg.isInsufficientEvidence
                        ? 'bg-amber-50 border border-amber-300 text-amber-950 rounded-tl-none whitespace-pre-line'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none whitespace-pre-line'
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Supporting Official Source Links */}
                  {!isUser && msg.sourceLinks && msg.sourceLinks.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                        <FileText className="h-3 w-3 text-slate-400" />
                        Supporting Official Sources:
                      </p>
                      <div className="space-y-1">
                        {msg.sourceLinks.map((source, idx) => (
                          <div
                            key={idx}
                            className="rounded-lg bg-white border border-slate-200/80 p-2 text-[11px] text-slate-600 flex items-center justify-between shadow-2xs"
                          >
                            <div>
                              <span className="font-bold text-slate-800 block">{source.title}</span>
                              <span className="text-[10px] text-slate-400 italic">{source.citation}</span>
                            </div>
                            {source.url && (
                              <a
                                href={source.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-brand-600 hover:text-brand-800 p-1 shrink-0"
                                title="Open source reference"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div
                    className={`text-[10px] text-slate-400 px-1 ${
                      isUser ? 'text-right' : 'text-left'
                    }`}
                  >
                    {msg.timestamp}
                  </div>

                  {/* Follow-up suggestions */}
                  {!isUser && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                    <div className="pt-1 flex flex-wrap gap-1.5">
                      {msg.suggestedFollowUps.map((followUp, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleSendMessage(followUp)}
                          className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 hover:bg-brand-50 hover:border-brand-300 hover:text-brand-900 transition-colors cursor-pointer shadow-2xs"
                        >
                          {followUp}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {isTyping && (
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-600 text-white shadow-2xs">
                <Bot className="h-4 w-4" />
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 shadow-xs flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-600 animate-bounce" />
                <span className="h-1.5 w-1.5 rounded-full bg-brand-600 animate-bounce [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-brand-600 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] text-slate-400 ml-1">
                  Checking verified prospectuses and HEC policies...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Composer */}
        <div className="border-t border-slate-200 p-3 sm:p-4 bg-white">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSendMessage()
            }}
            className="flex items-center gap-2"
          >
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about entry test formulas, Pre-Med eligibility, or closing merit..."
              className="bg-slate-50 text-xs sm:text-sm h-11"
              disabled={isTyping}
            />
            <Button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="gap-1.5 shrink-0 h-11 px-5 font-bold"
            >
              <Send className="h-4 w-4" />
              <span>Send</span>
            </Button>
          </form>
          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 px-1">
            <span>Official advisory responses grounded in BIEK, NED UET, FAST, and HEC documentation.</span>
            <span>Deterministic Prototype</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
