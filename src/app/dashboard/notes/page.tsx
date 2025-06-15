"use client";

import { NotesProvider, useNotesContext } from "@/lib/notes/notes-provider";
import { Note } from "@/lib/notes/types";
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

import { Edit, Eye, Save, Trash, Plus, FileText, BookOpen, Search } from "lucide-react";

function NotesComponent() {
  const { notes, createNote, updateNote, deleteNote } = useNotesContext();
  const emptyNote: Note = {
    id: "",
    title: "",
    content: "",
    subject: "",
  };
  const [newNote, setNewNote] = useState<Note>(emptyNote);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleCreateNote = () => {
    createNote({
      ...newNote,
      id: Math.random().toString(),
    });
    setIsCreateModalOpen(false);
    setNewNote(emptyNote);
  };

  const handleEditNote = (id: string, selectedNote: Note) => {
    updateNote(id, selectedNote);
    setIsViewModalOpen(false);
    setIsEditMode(false);
  };

  const handleDeleteNote = (id: string) => {
    deleteNote(id);
    setIsViewModalOpen(false);
  };

  useCopilotReadable({
    description: "Notes list.",
    value: JSON.stringify(notes),
  });

  useCopilotAction({
    name: "Create a Note",
    description: "Adds a note to notes list.",
    parameters: [
      { name: "title", type: "string", required: true },
      { name: "content", type: "string", required: true },
      { name: "subject", type: "string", required: true },
    ],
    handler: (args) => {
      const newNote: Note = {
        id: Math.random().toString(),
        title: args.title as string,
        content: args.content as string,
        subject: args.subject as string,
      };
      createNote(newNote);
    },
  });

  useCopilotAction({
    name: "Delete a Note",
    description: "Deletes a note from notes list.",
    parameters: [{ name: "id", type: "string", required: true }],
    handler: (args) => {
      deleteNote(args.id as string);
    },
  });

  useCopilotAction({
    name: "Update a Note",
    description: "Updates a note from notes list.",
    parameters: [
      { name: "id", type: "string", required: true },
      { name: "title", type: "string", required: true },
      { name: "content", type: "string", required: true },
      { name: "subject", type: "string", required: true },
    ],
    handler: (args) => {
      updateNote(args.id as string, {
        title: args.title as string,
        content: args.content as string,
        subject: args.subject as string,
      });
    },
  });

  // Filter notes based on search term
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedNotes = filteredNotes.reduce((acc: Record<string, Note[]>, note) => {
    if (!acc[note.subject]) {
      acc[note.subject] = [];
    }
    acc[note.subject].push(note);
    return acc;
  }, {});

  const totalNotes = notes.length;

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto mb-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">📝 Notes</h1>
          <p className="text-gray-600 mb-6">Keep your thoughts organized ✨</p>
          
          {totalNotes > 0 && (
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          )}
        </div>
      </div>

      {totalNotes === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-6">📄 You don't have any notes yet. Let's create your first one!</p>
          <Button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
            ✍️ Create a Note
          </Button>
        </div>
      )}

      {Object.keys(groupedNotes).length === 0 && totalNotes > 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-6">🔍 No notes found for your search.</p>
          <Button onClick={() => setSearchTerm("")} variant="outline">
            Clear Search
          </Button>
        </div>
      )}

      {Object.keys(groupedNotes).length > 0 && (
        <div className="max-w-4xl mx-auto">
          <div className="mb-6 flex justify-end">
            <Button onClick={() => setIsCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
              ✍️ Create a Note
            </Button>
          </div>
          
          <div className="space-y-8">
            {Object.entries(groupedNotes).map(([subject, subjectNotes]) => (
              <div key={subject}>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      📚 {subject}
                    </CardTitle>
                    <CardDescription>
                      {subjectNotes.length} note{subjectNotes.length !== 1 ? 's' : ''} 📄
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {subjectNotes.map((note) => (
                        <div key={note.id} className="border rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all duration-200">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-medium">{note.title}</h3>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setSelectedNote(note);
                                  setIsViewModalOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteNote(note.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {note.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}


      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>✨ Create New Note</DialogTitle>
            <DialogDescription>
              Add a new note to your collection and keep your thoughts organized! 🎯
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Title</label>
              <Input
                placeholder="Enter note title..."
                value={newNote.title}
                onChange={(e) =>
                  setNewNote({ ...newNote, title: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Subject</label>
              <Input
                placeholder="Enter subject category..."
                value={newNote.subject}
                onChange={(e) =>
                  setNewNote({ ...newNote, subject: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Content</label>
              <Textarea
                placeholder="Write your note content here..."
                value={newNote.content}
                onChange={(e) =>
                  setNewNote({ ...newNote, content: e.target.value })
                }
                className="min-h-32"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateNote}
              disabled={!newNote.title.trim() || !newNote.subject.trim() || !newNote.content.trim()}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              💾 Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


      {isViewModalOpen && selectedNote && (
        <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
          <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
            <DialogHeader className="flex flex-row items-center justify-between border-b pb-4">
              <div className="flex-1">
                <DialogTitle>
                  {isEditMode ? "Edit Note" : selectedNote.title}
                </DialogTitle>
                {!isEditMode && (
                  <div className="mt-2 px-3 py-1 bg-gray-100 text-sm rounded-full inline-block">
                    {selectedNote.subject}
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditMode(!isEditMode)}
              >
                {isEditMode ? (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </>
                )}
              </Button>
            </DialogHeader>
            
            <ScrollArea className="flex-1 py-4">
              {isEditMode ? (
                <div className="space-y-4 pr-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Title</label>
                    <Input
                      value={selectedNote.title}
                      onChange={(e) =>
                        setSelectedNote({
                          ...selectedNote,
                          title: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Subject</label>
                    <Input
                      value={selectedNote.subject}
                      onChange={(e) =>
                        setSelectedNote({
                          ...selectedNote,
                          subject: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Content</label>
                    <Textarea
                      value={selectedNote.content}
                      onChange={(e) =>
                        setSelectedNote({
                          ...selectedNote,
                          content: e.target.value,
                        })
                      }
                      className="min-h-96"
                    />
                  </div>
                </div>
              ) : (
                <div className="pr-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="whitespace-pre-wrap">
                      {selectedNote.content}
                    </div>
                  </div>
                </div>
              )}
            </ScrollArea>
            
            <DialogFooter className="border-t pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setIsEditMode(false);
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
              <Button
                variant="destructive"
                onClick={() => handleDeleteNote(selectedNote.id)}
              >
                <Trash className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export default function Page() {
  return (
    <NotesProvider>
      <NotesComponent />
    </NotesProvider>
  );
}