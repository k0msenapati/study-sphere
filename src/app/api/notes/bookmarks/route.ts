import { db } from "@/lib/db";
import { noteBookmarks, notes } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/auth/jwt";
import { v4 as uuidv4 } from "uuid";

// GET /api/notes/bookmarks — Get all bookmarked notes for the logged-in user
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const bookmarkedNotes = await db
    .select({
      bookmark: noteBookmarks,
      note: notes,
    })
    .from(noteBookmarks)
    .innerJoin(notes, eq(noteBookmarks.noteId, notes.id))
    .where(eq(noteBookmarks.userId, session.userId));

  return NextResponse.json(bookmarkedNotes);
}

// POST /api/notes/bookmarks — Bookmark a note
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { noteId } = await req.json();

  if (!noteId) return NextResponse.json({ error: "Missing note ID" }, { status: 400 });

  // Check if note exists and belongs to user
  const note = await db
    .select()
    .from(notes)
    .where(and(eq(notes.id, noteId), eq(notes.userId, session.userId)));

  if (note.length === 0) {
    return NextResponse.json({ error: "Note not found" }, { status: 404 });
  }

  // Check if bookmark already exists
  const existingBookmark = await db
    .select()
    .from(noteBookmarks)
    .where(and(eq(noteBookmarks.noteId, noteId), eq(noteBookmarks.userId, session.userId)));

  if (existingBookmark.length > 0) {
    return NextResponse.json({ error: "Note already bookmarked" }, { status: 400 });
  }

  const newBookmark = {
    id: uuidv4(),
    userId: session.userId,
    noteId,
    createdAt: new Date(),
  };

  await db.insert(noteBookmarks).values(newBookmark);
  return NextResponse.json({ success: true, bookmark: newBookmark });
}

// DELETE /api/notes/bookmarks?noteId=NOTE_ID — Remove bookmark from a note
export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const noteId = searchParams.get("noteId");

  if (!noteId) return NextResponse.json({ error: "Missing note ID" }, { status: 400 });

  await db
    .delete(noteBookmarks)
    .where(and(eq(noteBookmarks.noteId, noteId), eq(noteBookmarks.userId, session.userId)));

  return NextResponse.json({ success: true });
} 