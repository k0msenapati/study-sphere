import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { flashcards, decks, insertFlashcardSchema } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { deckId, flashcards: flashcardsList } = body

    if (!deckId || !Array.isArray(flashcardsList) || flashcardsList.length === 0) {
      return NextResponse.json({ 
        error: 'deckId and flashcards array are required' 
      }, { status: 400 })
    }

    // Verify the deck exists and belongs to the user
    const [deck] = await db
      .select()
      .from(decks)
      .where(and(
        eq(decks.id, deckId),
        eq(decks.userId, session.userId)
      ))

    if (!deck) {
      return NextResponse.json({ error: 'Deck not found' }, { status: 404 })
    }

    // Prepare flashcards for bulk insert
    const flashcardsData = flashcardsList.map((flashcard, index) => {
      const flashcardData = {
        ...flashcard,
        id: uuidv4(),
        deckId,
        order: flashcard.order ?? index,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      return insertFlashcardSchema.parse(flashcardData)
    })

    // Insert all flashcards
    const newFlashcards = await db
      .insert(flashcards)
      .values(flashcardsData)
      .returning()

    // Update deck's total cards count
    await db
      .update(decks)
      .set({ 
        totalCards: deck.totalCards + flashcardsData.length,
        updatedAt: new Date()
      })
      .where(eq(decks.id, deckId))

    return NextResponse.json({
      message: `${newFlashcards.length} flashcards created successfully`,
      flashcards: newFlashcards
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating bulk flashcards:', error)
    return NextResponse.json(
      { error: 'Failed to create flashcards' },
      { status: 500 }
    )
  }
}
