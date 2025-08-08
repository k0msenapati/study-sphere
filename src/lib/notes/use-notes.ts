// src/lib/notes/use-notes.ts
import { useEffect, useState } from "react";
import { Note, NoteBookmark } from "./types";

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [bookmarks, setBookmarks] = useState<NoteBookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showBookmarked, setShowBookmarked] = useState(false);

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

  // Define the expected API response item type for bookmarks
  interface NoteBookmarkApiResponseItem {
    bookmark: NoteBookmark;
    note: Note;
  }

  const fetchBookmarks = async () => {
    try {
      const res = await fetch("/api/notes/bookmarks");
      if (res.ok) {
        const data: NoteBookmarkApiResponseItem[] = await res.json();
        // The API returns an array of objects with bookmark and note properties
        // We need to extract just the bookmark objects
        const bookmarkObjects = data.map((item) => item.bookmark);
        setBookmarks(bookmarkObjects);
      }
    } catch (err) {
      console.error("Failed to fetch bookmarks:", err);
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
      // Also remove from bookmarks if it was bookmarked
      setBookmarks(prev => prev.filter(bookmark => bookmark.noteId !== id));
    }
  };

  const toggleBookmark = async (noteId: string) => {
    const isBookmarked = bookmarks.some(bookmark => bookmark.noteId === noteId);
    
    if (isBookmarked) {
      // Remove bookmark
      const res = await fetch(`/api/notes/bookmarks?noteId=${noteId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setBookmarks(prev => prev.filter(bookmark => bookmark.noteId !== noteId));
      }
    } else {
      // Add bookmark
      const res = await fetch("/api/notes/bookmarks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ noteId }),
      });
      if (res.ok) {
        const data = await res.json();
        setBookmarks(prev => [...prev, data.bookmark]);
      }
    }
  };

  // Get notes with bookmark status
  const getNotesWithBookmarkStatus = () => {
    return notes.map(note => ({
      ...note,
      isBookmarked: bookmarks.some(bookmark => bookmark.noteId === note.id),
    }));
  };

  // Get filtered notes based on bookmark status
  const getFilteredNotes = () => {
    const notesWithBookmarks = getNotesWithBookmarkStatus();
    if (showBookmarked) {
      return notesWithBookmarks.filter(note => note.isBookmarked);
    }
    return notesWithBookmarks;
  };

  // Get bookmark count
  const getBookmarkCount = () => {
    return bookmarks.length;
  };

  useEffect(() => {
    fetchNotes();
    fetchBookmarks();
  }, []);

  return {
    notes: getFilteredNotes(),
    allNotes: notes,
    bookmarks,
    isLoading,
    error,
    showBookmarked,
    setShowBookmarked,
    createNote,
    updateNote,
    deleteNote,
    toggleBookmark,
    bookmarkCount: getBookmarkCount(),
  };
}
