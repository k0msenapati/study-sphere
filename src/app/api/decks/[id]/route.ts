import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { decks, flashcards } from '@/lib/db/schema'
import { eq, and, count } from 'drizzle-orm'

interface RouteContext {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

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

    return NextResponse.json(deck)
  } catch (error) {
    console.error('Error fetching deck:', error)
    return NextResponse.json(
      { error: 'Failed to fetch deck' },
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
    
    const updateData = {
      ...body,
      updatedAt: new Date(),
    }

    // Remove fields that shouldn't be updated
    delete updateData.id
    delete updateData.userId
    delete updateData.createdAt

    const [updatedDeck] = await db
      .update(decks)
      .set(updateData)
      .where(and(
        eq(decks.id, params.id),
        eq(decks.userId, session.userId)
      ))
      .returning()

    if (!updatedDeck) {
      return NextResponse.json({ error: 'Deck not found' }, { status: 404 })
    }

    return NextResponse.json(updatedDeck)
  } catch (error) {
    console.error('Error updating deck:', error)
    return NextResponse.json(
      { error: 'Failed to update deck' },
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

    // Check if deck exists and belongs to user
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

    // Delete the deck (flashcards will be deleted due to cascade)
    await db
      .delete(decks)
      .where(and(
        eq(decks.id, params.id),
        eq(decks.userId, session.userId)
      ))

    return NextResponse.json({ message: 'Deck deleted successfully' })
  } catch (error) {
    console.error('Error deleting deck:', error)
    return NextResponse.json(
      { error: 'Failed to delete deck' },
      { status: 500 }
    )
  }
}
