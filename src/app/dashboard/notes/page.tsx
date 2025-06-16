"use client"

import { NotesProvider, useNotesContext } from "@/lib/notes/notes-provider"
import { Note } from "@/lib/notes/types"
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Edit, Eye, Save, Trash, Download } from "lucide-react"

const exportToPDF = (note: Note) => {
  const printWindow = window.open('', '_blank')
  
  if (!printWindow) {
    alert('Please allow popups to export PDF')
    return
  }
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${note.title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          line-height: 1.6;
          color: #333;
        }
        h1 {
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
          margin-bottom: 20px;
          color: #2c3e50;
        }
        .content {
          white-space: pre-wrap;
          font-size: 14px;
          line-height: 1.8;
        }
        @media print {
          body { margin: 0; }
        }
      </style>
    </head>
    <body>
      <h1>${note.title}</h1>
      <div class="content">${note.content}</div>
    </body>
    </html>
  `
  printWindow.document.write(htmlContent)
  printWindow.document.close()
  
  setTimeout(() => {
    printWindow.print()
    printWindow.close()
  }, 250)
}

function NotesComponent() {
  const { notes, createNote, updateNote, deleteNote } = useNotesContext()
  const emptyNote: Note = {
    id: "",
    title: "",
    content: "",
  }
  const [newNote, setNewNote] = useState<Note>(emptyNote)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)

  const handleCreateNote = () => {
    createNote({
      ...newNote,
      id: Math.random().toString(),
    })
    setIsCreateModalOpen(false)
    setNewNote(emptyNote)
  }

  const handleEditNote = (id: string, selectedNote: Note) => {
    updateNote(id, selectedNote)
    setIsViewModalOpen(false)
  }

  const handleDeleteNote = (id: string) => {
    deleteNote(id)
    setIsViewModalOpen(false)
  }

  const handleExportPDF = (note: Note) => {
    exportToPDF(note)
  }

  useCopilotReadable({
    description: "Notes list.",
    value: JSON.stringify(notes),
  })

  useCopilotAction({
    name: "Create a Note",
    description: "Adds a note to notes list.",
    parameters: [
      {
        name: "title",
        type: "string",
        description: "The title of the note.",
        required: true,
      },
      {
        name: "content",
        type: "string",
        description: "The content of the note.",
        required: true,
      },
    ],
    handler: args => {
      const newNote: Note = {
        id: Math.random().toString(),
        title: args.title as string,
        content: args.content as string,
      }
      createNote(newNote)
      console.log("Note created", newNote)
    },
  })

  useCopilotAction({
    name: "Delete a Note",
    description: "Deletes a note from notes list.",
    parameters: [
      {
        name: "id",
        type: "string",
        description: "The id of the note.",
        required: true,
      },
    ],
    handler: args => {
      deleteNote(args.id as string)
    },
  })

  useCopilotAction({
    name: "Update a Note",
    description: "Updates a note from notes list.",
    parameters: [
      {
        name: "id",
        type: "string",
        description: "The id of the note.",
        required: true,
      },
      {
        name: "title",
        type: "string",
        description: "The title of the note.",
        required: true,
      },
      {
        name: "content",
        type: "string",
        description: "The content of the note.",
        required: true,
      },
    ],
    handler: args => {
      updateNote(args.id as string, {
        title: args.title as string,
        content: args.content as string,
      })
    },
  })

  return (
    <div className="min-h-screen p-12">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 space-x-2">
          📒 <span>Notes</span>
        </h1>
        <p className="text-lg text-gray-700 mt-2">📝 Manage your notes here. 📌</p>
      </header>

      {notes.length === 0 ? (
        <p className="text-gray-500 mt-4">You don't have any notes yet.</p>
      ) : (
        <motion.ul
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[70vh] overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {notes.map(note => (
            <li
              key={note.id}
              className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm w-full"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">{note.title}</h3>
                  <p className="text-gray-600 mt-1">
                    {note.content.slice(0, 50)}
                    {note.content.length > 50 ? "..." : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => handleExportPDF(note)}
                    title="Export as PDF"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    onClick={() => {
                      setSelectedNote(note)
                      setIsViewModalOpen(true)
                    }}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    onClick={() => {
                      handleDeleteNote(note.id)
                    }}
                    variant="destructive"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </motion.ul>
      )}

      <Button onClick={() => setIsCreateModalOpen(true)} className="mt-6 mb-32" size="lg">
        Create a Note
      </Button>

      <AnimatePresence>
        {isCreateModalOpen && (
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a New Note</DialogTitle>
                <DialogDescription>Add a new note to your collection</DialogDescription>
              </DialogHeader>
              <Input
                placeholder="Title"
                value={newNote.title}
                onChange={e => setNewNote({ ...newNote, title: e.target.value })}
                className="mb-4"
              />
              <Textarea
                placeholder="Content"
                value={newNote.content}
                onChange={e => setNewNote({ ...newNote, content: e.target.value })}
                className="mb-4"
              />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateNote}>Save</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isViewModalOpen && selectedNote && (
          <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
            <DialogContent className="max-w-4xl h-[70vh] flex flex-col">
            <DialogHeader className="flex flex-row items-center justify-between">
                <DialogTitle>{selectedNote.title}</DialogTitle>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => handleExportPDF(selectedNote)}
                    title="Export as PDF"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => setIsEditMode(!isEditMode)}>
                    {isEditMode ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                  </Button>
                </div>
              </DialogHeader>
              <div className="flex-grow overflow-auto">
                {isEditMode ? (
                  <Textarea
                    value={selectedNote.content}
                    onChange={e =>
                      setSelectedNote({
                        ...selectedNote,
                        content: e.target.value,
                      })
                    }
                    className="w-full h-full resize-none"
                  />
                ) : (
                  <div className="whitespace-pre-wrap">{selectedNote.content}</div>
                )}
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsViewModalOpen(false)
                    setIsEditMode(false)
                  }}
                >
                  Close
                </Button>
                {isEditMode && (
                  <Button
                    onClick={() => {
                      handleEditNote(selectedNote.id, selectedNote)
                    }}
                  >
                    Save Changes
                  </Button>
                )}
                <Button
                  variant="destructive"
                  onClick={() => {
                    handleDeleteNote(selectedNote.id)
                  }}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function Page() {
  return (
    <NotesProvider>
      <NotesComponent />
    </NotesProvider>
  )
}