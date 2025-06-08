"use client"

import { Card, CardContent } from "@/components/ui/card"
import { personas } from "@/lib/personas"
import { useChatContext } from "@/contexts/ChatContext"

export function PersonaSelector() {
  const { state, dispatch } = useChatContext()

  const handlePersonaSelect = (personaId: string) => {
    dispatch({ type: "SET_PERSONA", payload: personaId })
  }

  

  return (
    <div className="w-full">
      <h2 className="text-lg font-semibold mb-4 text-center">Choose Your AI Persona</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {personas.map((persona) => (
          <Card
            key={persona.id}
            className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
              state.selectedPersona === persona.id ? "ring-2 ring-primary shadow-lg" : "hover:shadow-md"
            }`}
            onClick={() => handlePersonaSelect(persona.id)}
          >
           <CardContent className="p-4 text-center">
  <div className="flex flex-col items-center">
    <img
      src={persona.avatar}
      alt={`${persona.name}'s avatar`}
      className="mb-2 rounded-full"
      width={60}
      height={60}
    />
    <h3 className="font-medium text-sm mb-1">{persona.name}</h3>
    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
      {persona.description}
    </p>
  </div>
</CardContent>

          </Card>
        ))}
      </div>
    </div>
  )
}
