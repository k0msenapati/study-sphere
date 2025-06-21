import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/jwt";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

// GET /api/chats – Fetch all chats of the user
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session?.userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const allChats = await db
    .select()
    .from(chats)
    .where(eq(chats.userId, session.userId));

  return NextResponse.json(allChats);
}

// POST /api/chats – Save one chat exchange
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session?.userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { prompt, response } = await req.json();

  const newChat = {
    id: uuidv4(),
    userId: session.userId,
    prompt,
    response,
    promptTime: new Date(),
  };

  await db.insert(chats).values(newChat);
  return NextResponse.json({ success: true, chat: newChat });
}

export async function DELETE(req: NextRequest) {
  const session = await getSession();
  if (!session?.userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await req.json();
  if (!id)
    return NextResponse.json({ error: "Missing chat id" }, { status: 400 });

  await db.delete(chats).where(eq(chats.id, id));
  return NextResponse.json({ success: true });
}