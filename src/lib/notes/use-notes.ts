// src/lib/notes/use-notes.ts
import { useEffect, useState } from "react";
import { Note } from "./types";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/notes");
      if (!res.ok) throw new Error("Failed to fetch notes");
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      setError("Could not load notes");
    } finally {
      setIsLoading(false);
    }
  };

  const createNote = async (note: Omit<Note, "createdAt" | "modifiedAt">) => {
    const res = await fetch("/api/notes", {
      method: "POST",
      body: JSON.stringify(note),
    });
    if (res.ok) {
      const data = await res.json();
      setNotes(prev => [data.note, ...prev]);
    }
  };

  const updateNote = async (id: string, updated: Partial<Note>) => {
    const res = await fetch("/api/notes", {
      method: "PUT",
      body: JSON.stringify({ id, ...updated }),
    });
    if (res.ok) {
      setNotes(prev =>
        prev.map(note => (note.id === id ? { ...note, ...updated } : note))
      );
    }
  };

  const deleteNote = async (id: string) => {
    const res = await fetch(`/api/notes?id=${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      setNotes(prev => prev.filter(note => note.id !== id));
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return {
    notes,
    isLoading,
    error,
    createNote,
    updateNote,
    deleteNote,
  };
}
