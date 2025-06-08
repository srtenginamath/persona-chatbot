"use client"

import { ChatProvider } from "@/contexts/ChatContext"
import { PersonaSelector } from "@/components/PersonaSelector"
import ChatInterface from "@/components/ChatInterface"

export default function Home() {
  return (
    <ChatProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">AI Persona Chatbot</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Experience conversations with different AI personalities
            </p>
          </div>

          <div className="max-w-6xl mx-auto space-y-8">
            <PersonaSelector />
            <div className="max-w-4xl mx-auto">
              <ChatInterface />
            </div>
          </div>
        </div>
      </div>
    </ChatProvider>
  )
}
