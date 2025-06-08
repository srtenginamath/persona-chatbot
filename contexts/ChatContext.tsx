"use client"

import type React from "react"
import { createContext, useContext, useReducer, type ReactNode } from "react"
import type { Message } from "ai"

interface ChatState {
  selectedPersona: string
  conversations: Record<string, Message[]>
  isLoading: boolean
}

type ChatAction =
  | { type: "SET_PERSONA"; payload: string }
  | { type: "ADD_MESSAGE"; payload: { persona:  string; message: Message } }
  | { type: "SET_MESSAGES"; payload: { persona: string; messages: Message[] } }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "CLEAR_CONVERSATION"; payload: string }

const initialState: ChatState = {
  selectedPersona: "hiteshchoudhary",
  conversations: {},
  isLoading: false,
}

const ChatContext = createContext<{
  state: ChatState
  dispatch: React.Dispatch<ChatAction>
} | null>(null)

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "SET_PERSONA":
      return { ...state, selectedPersona: action.payload , conversations: {
          ...state.conversations,
          [action.payload]: [], // Clear conversation for the new persona
        },}
    case "ADD_MESSAGE":
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [action.payload.persona]: [...(state.conversations[action.payload.persona] || []), action.payload.message],
        },
      }
    case "SET_MESSAGES":
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [action.payload.persona]: action.payload.messages,
        },
      }
    case "SET_LOADING":
      return { ...state, isLoading: action.payload }
    case "CLEAR_CONVERSATION":
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [action.payload]: [],
        },
      }
    default:
      return state
  }
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(chatReducer, initialState)

  return <ChatContext.Provider value={{ state, dispatch }}>{children}</ChatContext.Provider>
}

export function useChatContext() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChatContext must be used within a ChatProvider")
  }
  return context
}
