import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { decks, flashcards } from '@/lib/db/schema'
import { eq, and, asc } from 'drizzle-orm'

interface RouteContext {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // First, verify the deck exists and belongs to the user
    const [deck] = await db
      .select()
      .from(decks)
      .where(and(
        eq(decks.id, params.id),
        eq(decks.userId, session.userId)
      ))

    if (!deck) {
      return NextResponse.json({ error: 'Deck not found' }, { status: 404 })
    }

    // Get all flashcards for this deck
    const deckFlashcards = await db
      .select()
      .from(flashcards)
      .where(eq(flashcards.deckId, params.id))
      .orderBy(asc(flashcards.order))

    return NextResponse.json(deckFlashcards)
  } catch (error) {
    console.error('Error fetching deck flashcards:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deck flashcards' },
      { status: 500 }
    )
  }
}
