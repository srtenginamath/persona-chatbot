"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { usePersonaStore, type Persona } from "@/lib/stores/persona-store"

interface PersonaFormProps {
  personaId?: string
  onClose: () => void
}

export default function PersonaForm({ personaId, onClose }: PersonaFormProps) {
  const { personas, addPersona, updatePersona } = usePersonaStore()
  const [formData, setFormData] = useState<Omit<Persona, "id">>({
    name: "",
    description: "",
    avatar: "",
    systemPrompt: "",
    initialMessages: [],
  })

  useEffect(() => {
    if (personaId) {
      const persona = personas.find((p) => p.id === personaId)
      if (persona) {
        setFormData({
          name: persona.name,
          description: persona.description,
          avatar: persona.avatar,
          systemPrompt: persona.systemPrompt,
          initialMessages: persona.initialMessages,
        })
      }
    }
  }, [personaId, personas])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.name.trim()) {
      if (personaId) {
        updatePersona(personaId, formData)
      } else {
        addPersona(formData)
      }
      onClose()
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>{personaId ? "Edit Persona" : "Create Persona"}</CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Persona name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Brief description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                name="avatar"
                value={formData.avatar}
                onChange={handleChange}
                placeholder="https://example.com/avatar.png"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="systemPrompt">System Prompt</Label>
              <Textarea
                id="systemPrompt"
                name="systemPrompt"
                value={formData.systemPrompt}
                onChange={handleChange}
                placeholder="You are a helpful assistant..."
                rows={3}
              />
              <p className="text-xs text-muted-foreground">
                This defines how the AI will behave when chatting as this persona
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{personaId ? "Update" : "Create"}</Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  )
}
