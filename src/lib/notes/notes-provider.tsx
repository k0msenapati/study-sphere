// src/lib/notes/notes-provider.tsx
"use client"

import React, { createContext, useContext } from "react"
import { useNotes } from "./use-notes"

const NotesContext = createContext<ReturnType<typeof useNotes> | undefined>(undefined)

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const notes = useNotes()
  return <NotesContext.Provider value={notes}>{children}</NotesContext.Provider>
}

export const useNotesContext = () => {
  const context = useContext(NotesContext)
  if (!context) {
    throw new Error("useNotesContext must be used within a NotesProvider")
  }
  return context
}
