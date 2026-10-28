export type MessageSender = 'user' | 'assistant' | 'system'

export interface SuggestedPrompt {
  id: string
  label: string
  prompt: string
  category?: string
}

export interface AdvisorSourceLink {
  title: string
  url?: string
  citation: string
}

export interface AdvisorMessage {
  id: string
  sender: MessageSender
  content: string
  timestamp: string
  suggestedFollowUps?: string[]
  sourceLinks?: AdvisorSourceLink[]
  isInsufficientEvidence?: boolean
}
