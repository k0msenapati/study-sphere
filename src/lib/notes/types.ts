// src/lib/notes/types.ts
export type Note = {
  id: string;
  userId: number;
  title: string;
  content: string;
  categories: string[];
  createdAt: string;
  modifiedAt: string;
  isBookmarked?: boolean;
};

export type NoteBookmark = {
  id: string;
  userId: number;
  noteId: string;
  createdAt: string;
};
