"use client"

import dynamic from "next/dynamic"
import "react-quill/dist/quill.snow.css"

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
import { Edit, Eye, Save, Trash } from "lucide-react"

const ReactQuill = dynamic(() => import("react-quill"),{ssr:false})

const quillModules = {
  toolbar: [
    ['bold','italic','underline'],
    [{'background':[]}],
    ['clean']
  ]
}

const quillFormats = [
  'bold','italic','underline','background'
]
  

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
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{note.title}</h3>
                  <p className="text-gray-600 mt-1">
                    {note.content.slice(0, 50)}
                    {note.content.length > 50 ? "..." : ""}
                  </p>
                </div>
                <div>
                  <Button
                    size="icon"
                    onClick={() => {
                      setSelectedNote(note)
                      setIsViewModalOpen(true)
                    }}
                    className="mr-4"
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
              <ReactQuill
              theme="snow"
                value={newNote.content}
                onChange={(value) => setNewNote({ ...newNote, content: value })}
                modules={quillModules}
                formats={quillFormats}
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
                <Button variant="ghost" size="icon" onClick={() => setIsEditMode(!isEditMode)}>
                  {isEditMode ? <Save className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                </Button>
              </DialogHeader>
              <div className="flex-grow overflow-auto">
                {isEditMode ? (
                  <ReactQuill
                  theme="snow"
                    value={selectedNote.content}
                    onChange={(value) =>
                      setSelectedNote({
                        ...selectedNote,
                        content: value,
                      })
                    }
                    modules={quillModules}
                    formats={quillFormats}
                    className="h-[calc(100%-3rem)] mb-2"
                  />
                ) : (
                  <div className="prose max-w-full"
                    dangerouslySetInnerHTML= {{__html: selectedNote.content as string}}
                    />
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
