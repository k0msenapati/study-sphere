import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { flashcards, decks } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

interface RouteContext {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [flashcard] = await db
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
      .where(and(
        eq(flashcards.id, params.id),
        eq(decks.userId, session.userId)
      ))

    if (!flashcard) {
      return NextResponse.json({ error: 'Flashcard not found' }, { status: 404 })
    }

    return NextResponse.json(flashcard)
  } catch (error) {
    console.error('Error fetching flashcard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch flashcard' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    // First, verify the flashcard exists and the deck belongs to the user
    const [existingFlashcard] = await db
      .select()
      .from(flashcards)
      .innerJoin(decks, eq(flashcards.deckId, decks.id))
      .where(and(
        eq(flashcards.id, params.id),
        eq(decks.userId, session.userId)
      ))

    if (!existingFlashcard) {
      return NextResponse.json({ error: 'Flashcard not found' }, { status: 404 })
    }

    const updateData = {
      ...body,
      updatedAt: new Date(),
    }

    // Remove fields that shouldn't be updated
    delete updateData.id
    delete updateData.deckId
    delete updateData.createdAt

    const [updatedFlashcard] = await db
      .update(flashcards)
      .set(updateData)
      .where(eq(flashcards.id, params.id))
      .returning()

    return NextResponse.json(updatedFlashcard)
  } catch (error) {
    console.error('Error updating flashcard:', error)
    return NextResponse.json(
      { error: 'Failed to update flashcard' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // First, verify the flashcard exists and the deck belongs to the user
    const [existingFlashcard] = await db
      .select({
        flashcard: flashcards,
        deck: decks
      })
      .from(flashcards)
      .innerJoin(decks, eq(flashcards.deckId, decks.id))
      .where(and(
        eq(flashcards.id, params.id),
        eq(decks.userId, session.userId)
      ))

    if (!existingFlashcard) {
      return NextResponse.json({ error: 'Flashcard not found' }, { status: 404 })
    }

    // Delete the flashcard
    await db
      .delete(flashcards)
      .where(eq(flashcards.id, params.id))

    // Update deck's total cards count
    await db
      .update(decks)
      .set({ 
        totalCards: Math.max(0, existingFlashcard.deck.totalCards - 1),
        updatedAt: new Date()
      })
      .where(eq(decks.id, existingFlashcard.flashcard.deckId))

    return NextResponse.json({ message: 'Flashcard deleted successfully' })
  } catch (error) {
    console.error('Error deleting flashcard:', error)
    return NextResponse.json(
      { error: 'Failed to delete flashcard' },
      { status: 500 }
    )
  }
}
