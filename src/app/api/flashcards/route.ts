import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { flashcards, decks, insertFlashcardSchema } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const deckId = searchParams.get('deckId')

    let whereConditions = eq(decks.userId, session.userId)
    
    if (deckId) {
      whereConditions = and(
        eq(decks.userId, session.userId),
        eq(flashcards.deckId, deckId)
      )!
    }

    const userFlashcards = await db
      .select({
        id: flashcards.id,
        deckId: flashcards.deckId,
        question: flashcards.question,
        answer: flashcards.answer,
        difficulty: flashcards.difficulty,
        topic: flashcards.topic,
        hints: flashcards.hints,
        explanation: flashcards.explanation,
        tags: flashcards.tags,
        correctCount: flashcards.correctCount,
        incorrectCount: flashcards.incorrectCount,
        lastReviewed: flashcards.lastReviewed,
        nextReview: flashcards.nextReview,
        order: flashcards.order,
        createdAt: flashcards.createdAt,
        updatedAt: flashcards.updatedAt,
        deckTitle: decks.title,
      })
      .from(flashcards)
      .innerJoin(decks, eq(flashcards.deckId, decks.id))
      .where(whereConditions)
      .orderBy(desc(flashcards.updatedAt))

    return NextResponse.json(userFlashcards)
  } catch (error) {
    console.error('Error fetching flashcards:', error)
    return NextResponse.json(
      { error: 'Failed to fetch flashcards' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // Verify the deck exists and belongs to the user
    const [deck] = await db
      .select()
      .from(decks)
      .where(and(
        eq(decks.id, body.deckId),
        eq(decks.userId, session.userId)
      ))

    if (!deck) {
      return NextResponse.json({ error: 'Deck not found' }, { status: 404 })
    }

    // Validate the request body
    const flashcardData = {
      ...body,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const validatedFlashcard = insertFlashcardSchema.parse(flashcardData)

    const [newFlashcard] = await db
      .insert(flashcards)
      .values(validatedFlashcard)
      .returning()

    // Update deck's total cards count
    await db
      .update(decks)
      .set({ 
        totalCards: deck.totalCards + 1,
        updatedAt: new Date()
      })
      .where(eq(decks.id, body.deckId))

    return NextResponse.json(newFlashcard, { status: 201 })
  } catch (error) {
    console.error('Error creating flashcard:', error)
    return NextResponse.json(
      { error: 'Failed to create flashcard' },
      { status: 500 }
    )
  }
}
