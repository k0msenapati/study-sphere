import { db } from "@/lib/db";
import { notes } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { getSession } from "@/lib/auth/jwt";
import { v4 as uuidv4 } from "uuid";

// GET /api/notes — Get all notes for the logged-in user
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const allNotes = await db
    .select()
    .from(notes)
    .where(eq(notes.userId, session.userId));

  return NextResponse.json(allNotes);
}

// POST /api/notes — Create a new note
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, content, categories } = await req.json();

  const newNote = {
    id: uuidv4(),
    userId: session.userId,
    title,
    content,
    categories: categories || [],
    createdAt: new Date(),
    modifiedAt: new Date(),
  };

  await db.insert(notes).values(newNote);
  return NextResponse.json({ success: true, note: newNote });
}

// PUT /api/notes — Update a note
export async function PUT(req: NextRequest) {
  const session = await getSession();
  if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, title, content, categories } = await req.json();

  if (!id) return NextResponse.json({ error: "Missing note ID" }, { status: 400 });

  await db
    .update(notes)
    .set({
      title,
      content,
      categories: categories || [],
      modifiedAt: new Date(),
    })
    .where(and(eq(notes.id, id), eq(notes.userId, session.userId)));

  return NextResponse.json({ success: true });
}

// DELETE /api/notes?id=NOTE_ID
export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session?.userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) return NextResponse.json({ error: "Missing note ID" }, { status: 400 });

  await db
    .delete(notes)
    .where(and(eq(notes.id, id), eq(notes.userId, session.userId)));

  return NextResponse.json({ success: true });
}
