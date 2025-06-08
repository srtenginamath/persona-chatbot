"use client"

import type React from "react"
import {  useRef, useEffect } from "react"
import { useChat } from "ai/react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Loader2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useChatContext } from "@/contexts/ChatContext"
import { getPersonaById } from "@/lib/personas"

export default function ChatInterface() {


    const { state, dispatch } = useChatContext()
  const selectedPersona = getPersonaById(state.selectedPersona)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
     api: "/api/chat",
       body: {
      persona: state.selectedPersona,
    },
    initialMessages: state.conversations[state.selectedPersona] || [],
    onFinish: (message) => {
      // Only update context when a new message is finished
      const updatedMessages = [...messages, message]
      dispatch({
        type: "SET_MESSAGES",
        payload: { persona: state.selectedPersona,  messages: updatedMessages ,  },
      })
    },
  })

   useEffect(() => {
    // Always start with empty messages when switching personas
    setMessages([])
  }, [state.selectedPersona, setMessages])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim() && !isLoading) {
      handleSubmit(e)
    }
  }

 

 

  if (!selectedPersona) {
    return (
      <div className="flex flex-col h-[85vh] border rounded-xl overflow-hidden bg-gradient-to-br from-background to-muted/20">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-muted-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-medium">No Persona Selected</h3>
              <p className="text-sm text-muted-foreground">Choose a persona to start chatting</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[85vh] border rounded-xl overflow-hidden bg-background shadow-lg">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-background to-muted/10 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Avatar className="w-10 h-10 border-2 border-background shadow-md">
              <AvatarImage src={selectedPersona.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {selectedPersona.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full"></div>
          </div>
          <div>
            <h2 className="font-semibold text-lg">{selectedPersona.name}</h2>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
             
              Online • {selectedPersona.description}
            </div>
          </div>
        </div>
        <Badge variant="secondary" className="text-xs">
          AI Assistant
        </Badge>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-background to-muted/5">
        {messages.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-16">
            <Avatar className="w-20 h-20 mx-auto mb-6 border-4 border-background shadow-lg">
              <AvatarImage src={selectedPersona.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                {selectedPersona.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-medium mb-3">Start a conversation with {selectedPersona.name}</h3>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">{selectedPersona.description}</p>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex gap-3 ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                <Avatar className="w-8 h-8 border-2 border-background shadow-sm">
                  {message.role === "user" ? (
                    <>
                      <AvatarImage src={""} />
                      <AvatarFallback className="bg-blue-500 text-white text-sm">
                        {"U"}
                      </AvatarFallback>
                    </>
                  ) : (
                    <>
                      <AvatarImage src={selectedPersona.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {selectedPersona.name.charAt(0)}
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
              </div>

              {/* Message Bubble */}
              <div className={`flex flex-col max-w-[75%] ${message.role === "user" ? "items-end" : "items-start"}`}>
                <div className="text-xs text-muted-foreground mb-1 px-1">
                  {message.role === "user" ?  "You" : selectedPersona.name}
                </div>
                <div
                  className={`rounded-2xl px-4 py-3 shadow-sm ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted border rounded-bl-md"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                </div>
                <div className="text-xs text-muted-foreground mt-1 px-1">
                  {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isLoading && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
            <Avatar className="w-8 h-8 border-2 border-background shadow-sm">
              <AvatarImage src={selectedPersona.avatar || "/placeholder.svg?height=32&width=32"} />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {selectedPersona.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className="text-xs text-muted-foreground mb-1 px-1">{selectedPersona.name}</div>
              <div className="bg-muted border rounded-2xl rounded-bl-md px-4 py-3 flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
                <span className="text-xs text-muted-foreground">typing...</span>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-gradient-to-r from-background to-muted/5">
        <form onSubmit={handleFormSubmit} className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <Textarea
              value={input}
              onChange={handleInputChange}
              placeholder={`Message ${selectedPersona.name}...`}
              className="resize-none border-2 rounded-xl pr-12 min-h-[44px] max-h-32"
              rows={1}
              disabled={isLoading}
            />
            <div className="absolute right-2 bottom-2 text-xs text-muted-foreground">
              {input.length > 0 && `${input.length}`}
            </div>
          </div>
          <Button
            type="submit"
            size="icon"
            disabled={isLoading || !input.trim()}
            className="rounded-xl h-11 w-11 shadow-md"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </form>
       
      </div>
    </div>
  )
}
