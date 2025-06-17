"use client"

import dynamic from "next/dynamic"
import "react-quill/dist/quill.snow.css"

import { NotesProvider, useNotesContext } from "@/lib/notes/notes-provider"
import { Note } from "@/lib/notes/types"
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core"
import { useState, useMemo } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import {
  Edit,
  Eye,
  Save,
  Trash,
  Plus,
  FileText,
  BookOpen,
  Search,
  Tag,
  Calendar,
  Hash,
  X,
  Filter,
} from "lucide-react"
import { MultiSelect } from "@/components/ui/multi-select"
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })

const quillModules = {
  toolbar: [["bold", "italic", "underline"], [{ background: [] }], ["clean"]],
}

const quillFormats = ["bold", "italic", "underline", "background"]

// Extended Note type with categories
interface ExtendedNote extends Note {
  categories?: string[]
}

function CategoryInput({
  categories,
  onChange,
}: { categories: string[]; onChange: (categories: string[]) => void }) {
  const [inputValue, setInputValue] = useState("")

  const handleAddCategory = () => {
    if (inputValue.trim() && !categories.includes(inputValue.trim()) && categories.length < 2) {
      onChange([...categories, inputValue.trim()])
      setInputValue("")
    }
  }

  const handleRemoveCategory = (categoryToRemove: string) => {
    onChange(categories.filter(cat => cat !== categoryToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddCategory()
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Categories (max 2)</label>
      <div className="flex gap-2">
        <Input
          placeholder="Add category..."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={categories.length >= 2}
          className="flex-1"
        />
        <Button
          type="button"
          onClick={handleAddCategory}
          disabled={!inputValue.trim() || categories.length >= 2}
          size="sm"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {categories.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {categories.map(category => (
            <Badge key={category} variant="secondary" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {category}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0 hover:bg-transparent"
                onClick={() => handleRemoveCategory(category)}
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}

function NotesComponent() {
  const { notes, createNote, updateNote, deleteNote } = useNotesContext()
  const emptyNote: ExtendedNote = {
    id: "",
    title: "",
    content: "",
    categories: [],
  }
  const [newNote, setNewNote] = useState<ExtendedNote>(emptyNote)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<ExtendedNote | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedSearchTerms, setSelectedSearchTerms] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  const handleCreateNote = () => {
    createNote({
      ...newNote,
      id: Math.random().toString(),
    })
    setIsCreateModalOpen(false)
    setNewNote(emptyNote)
  }

  const handleEditNote = (id: string, selectedNote: ExtendedNote) => {
    updateNote(id, selectedNote)
    setIsViewModalOpen(false)
    setIsEditMode(false)
  }

  const handleDeleteNote = (id: string) => {
    deleteNote(id)
    setIsViewModalOpen(false)
  }

  // Get all unique categories from existing notes
  const allCategories = useMemo(() => {
    const categories = new Set<string>()
    notes.forEach(note => {
      const extendedNote = note as ExtendedNote
      if (extendedNote.categories) {
        extendedNote.categories.forEach(cat => categories.add(cat))
      }
    })
    return Array.from(categories).sort()
  }, [notes])

  // Generate search options from existing notes
  const searchOptions = useMemo(() => {
    const options = new Set<string>()

    notes.forEach(note => {
      // Add note titles as search options
      if (note.title.trim()) {
        options.add(note.title.toLowerCase())
      }

      // Add significant words from content (longer than 3 characters)
      const words = note.content
        .toLowerCase()
        .replace(/[^\w\s]/g, " ")
        .split(/\s+/)
        .filter(word => word.length > 3)

      words.forEach(word => options.add(word))
    })

    return Array.from(options)
      .map(term => ({
        label: term.charAt(0).toUpperCase() + term.slice(1),
        value: term,
        icon: term.length > 10 ? FileText : Tag,
      }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [notes])

  // Filter notes based on search query, selected search terms, and category
  const filteredNotes = useMemo(() => {
    let filtered = notes

    // Filter by search query (title + content)
    if (searchQuery.trim()) {
      filtered = filtered.filter(note => {
        const noteText = `${note.title} ${note.content}`.toLowerCase()
        return noteText.includes(searchQuery.toLowerCase())
      })
    }

    // Filter by selected search terms
    if (selectedSearchTerms.length > 0) {
      filtered = filtered.filter(note => {
        const noteText = `${note.title} ${note.content}`.toLowerCase()
        return selectedSearchTerms.some(term => noteText.includes(term.toLowerCase()))
      })
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(note => {
        const extendedNote = note as ExtendedNote
        return extendedNote.categories?.includes(selectedCategory)
      })
    }

    return filtered
  }, [notes, searchQuery, selectedSearchTerms, selectedCategory])

  useCopilotReadable({
    description: "Notes list with categories.",
    value: JSON.stringify(notes),
  })

  useCopilotAction({
    name: "Create a Note",
    description: "Adds a note to notes list with optional categories.",
    parameters: [
      { name: "title", type: "string", required: true },
      { name: "content", type: "string", required: true },
      {
        name: "categories",
        type: "string",
        description: "Comma-separated categories (max 2)",
        required: false,
      },
    ],
    handler: args => {
      const categories = args.categories
        ? (args.categories as string)
            .split(",")
            .map(c => c.trim())
            .slice(0, 2)
        : []

      const newNote: ExtendedNote = {
        id: Math.random().toString(),
        title: args.title as string,
        content: args.content as string,
        categories,
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
    description: "Updates a note from notes list with optional categories.",
    parameters: [
      { name: "id", type: "string", required: true },
      { name: "title", type: "string", required: true },
      { name: "content", type: "string", required: true },
      {
        name: "categories",
        type: "string",
        description: "Comma-separated categories (max 2)",
        required: false,
      },
    ],
    handler: args => {
      const categories = args.categories
        ? (args.categories as string)
            .split(",")
            .map(c => c.trim())
            .slice(0, 2)
        : []

      updateNote(args.id as string, {
        title: args.title as string,
        content: args.content as string,
        categories,
      })
    },
  })

  const totalNotes = notes.length

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">📝 Notes</h1>
          <p className="text-gray-600 mb-6">Keep your thoughts organized ✨</p>

          {totalNotes > 0 && (
            <div className="mb-6 max-w-4xl mx-auto space-y-4">
              {/* Search Bar */}
              <div>
                <label className="block text-sm font-medium mb-2 text-left">🔍 Search notes</label>
                <Input
                  placeholder="Search by title or content..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Keyword Filter */}
                {searchOptions.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-left">
                      🏷️ Filter by keywords
                    </label>
                    <MultiSelect
                      options={searchOptions}
                      onValueChange={setSelectedSearchTerms}
                      placeholder="Select keywords..."
                      maxCount={5}
                      className="w-full"
                      animation={0.2}
                    />
                  </div>
                )}

                {/* Category Filter */}
                {allCategories.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2 text-left">
                      📂 Filter by category
                    </label>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">
                          <div className="flex items-center gap-2">
                            <Filter className="h-4 w-4" />
                            All Categories
                          </div>
                        </SelectItem>
                        {allCategories.map(category => (
                          <SelectItem key={category} value={category}>
                            <div className="flex items-center gap-2">
                              <Tag className="h-4 w-4" />
                              {category}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>

              {/* Results Summary */}
              {(searchQuery || selectedSearchTerms.length > 0 || selectedCategory !== "all") && (
                <div className="text-sm text-gray-500 text-left">
                  Found {filteredNotes.length} note{filteredNotes.length !== 1 ? "s" : ""}
                  {searchQuery && ` matching "${searchQuery}"`}
                  {selectedSearchTerms.length > 0 && ` with keywords`}
                  {selectedCategory !== "all" && ` in "${selectedCategory}" category`}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-6 px-2 text-xs"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedSearchTerms([])
                      setSelectedCategory("all")
                    }}
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {totalNotes === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-6">
              📄 You don't have any notes yet. Let's create your first one!
            </p>
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              ✍️ Create a Note
            </Button>
          </div>
        )}

        {filteredNotes.length === 0 && totalNotes > 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-6">🔍 No notes found matching your search criteria.</p>
            <Button
              onClick={() => {
                setSearchQuery("")
                setSelectedSearchTerms([])
                setSelectedCategory("all")
              }}
              variant="outline"
            >
              Clear Search
            </Button>
          </div>
        )}

        {filteredNotes.length > 0 && (
          <div>
            <div className="mb-6 flex justify-end">
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                ✍️ Create a Note
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {filteredNotes.map((note, index) => {
                  const extendedNote = note as ExtendedNote
                  return (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2, delay: index * 0.05 }}
                    >
                      <Card
                        className="hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                        onClick={() => {
                          setSelectedNote(extendedNote)
                          setIsViewModalOpen(true)
                        }}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg line-clamp-2 transition-colors duration-200 hover:text-blue-600">
                              {note.title}
                            </CardTitle>
                            <div className="flex gap-2 ml-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                className="hover:bg-blue-100 hover:text-blue-600 transition-all duration-200"
                                onClick={e => {
                                  e.stopPropagation()
                                  setSelectedNote(extendedNote)
                                  setIsViewModalOpen(true)
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="hover:bg-red-100 hover:text-red-600 transition-all duration-200"
                                onClick={e => {
                                  e.stopPropagation()
                                  handleDeleteNote(note.id)
                                }}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {/* Categories */}
                          {extendedNote.categories && extendedNote.categories.length > 0 && (
                            <div className="flex gap-1 flex-wrap mt-2">
                              {extendedNote.categories.map(category => (
                                <Badge key={category} variant="outline" className="text-xs">
                                  <Tag className="h-3 w-3 mr-1" />
                                  {category}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div
                            className="text-gray-700 leading-relaxed line-clamp-4 prose prose-sm max-w-none"
                            dangerouslySetInnerHTML={{ __html: note.content }}
                          />
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Create Note Modal */}
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogContent className="w-full sm:max-w-3xl max-h-[90vh] flex flex-col p-4 rounded-lg">
            <DialogHeader>
              <DialogTitle>✨ Create New Note</DialogTitle>
              <DialogDescription>
                Add a new note to your collection and keep your thoughts organized! 🎯
              </DialogDescription>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col gap-4 pb-4">
                <Input
                  placeholder="Enter note title..."
                  value={newNote.title}
                  onChange={e => setNewNote({ ...newNote, title: e.target.value })}
                />
                <CategoryInput
                  categories={newNote.categories || []}
                  onChange={categories => setNewNote({ ...newNote, categories })}
                />
                <ReactQuill
                  theme="snow"
                  value={newNote.content}
                  onChange={value => setNewNote({ ...newNote, content: value })}
                  modules={quillModules}
                  formats={quillFormats}
                  className="min-h-[150px]"
                />
              </div>
            </div>

            <DialogFooter className="pt-4 pb-2">
              <Button variant="outline" onClick={() => setIsCreateModalOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateNote}
                disabled={!newNote.title.trim() || !newNote.content.trim()}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Note
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View/Edit Note Modal */}
        {isViewModalOpen && selectedNote && (
          <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
            <DialogContent className="w-full sm:max-w-4xl max-h-[90vh] flex flex-col p-4 rounded-lg">
              <DialogHeader className="flex-row justify-between items-center">
                <DialogTitle className="text-xl font-bold truncate">
                  {isEditMode ? (
                    <Input
                      value={selectedNote.title}
                      onChange={e =>
                        setSelectedNote({
                          ...selectedNote,
                          title: e.target.value,
                        })
                      }
                      className="text-xl font-bold"
                    />
                  ) : (
                    selectedNote.title
                  )}
                </DialogTitle>

                <Button variant="ghost" size="icon" onClick={() => setIsEditMode(!isEditMode)}>
                  {isEditMode ? <Eye className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                </Button>
              </DialogHeader>

              {/* Categories in edit mode */}
              {isEditMode && (
                <div className="mb-4">
                  <CategoryInput
                    categories={selectedNote.categories || []}
                    onChange={categories => setSelectedNote({ ...selectedNote, categories })}
                  />
                </div>
              )}

              {/* Categories in view mode */}
              {!isEditMode && selectedNote.categories && selectedNote.categories.length > 0 && (
                <div className="mb-4">
                  <div className="flex gap-2 flex-wrap">
                    {selectedNote.categories.map(category => (
                      <Badge key={category} variant="secondary">
                        <Tag className="h-3 w-3 mr-1" />
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex-1 overflow-y-auto border rounded-md px-2 py-2">
                {isEditMode ? (
                  <ReactQuill
                    theme="snow"
                    value={selectedNote.content}
                    onChange={value =>
                      setSelectedNote({
                        ...selectedNote,
                        content: value,
                      })
                    }
                    modules={quillModules}
                    formats={quillFormats}
                    className="min-h-[200px]"
                  />
                ) : (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: selectedNote.content as string }}
                  />
                )}
              </div>

              <DialogFooter className="pt-4 pb-2">
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
                    onClick={() => handleEditNote(selectedNote.id, selectedNote)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                )}
                <Button variant="destructive" onClick={() => handleDeleteNote(selectedNote.id)}>
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
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
