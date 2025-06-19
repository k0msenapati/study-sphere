import { useState } from "react"
import { Note } from "./types"

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([])

  const createNote = (note: Note) => {
    setNotes([...notes, note])
  }

  const updateNote = (id: string, updatedNote: Partial<Note>) => {
    setNotes(notes.map(note => (note.id === id ? { ...note, ...updatedNote } : note)))
  }

  const deleteNote = (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this note?")
    if (!confirmDelete) return

    setNotes(notes.filter(note => note.id !== id))
  }

  return {
    notes,
    createNote,
    updateNote,
    deleteNote,
  }
}
