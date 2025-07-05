import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { decks, insertDeckSchema } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userDecks = await db
      .select()
      .from(decks)
      .where(eq(decks.userId, session.userId))
      .orderBy(desc(decks.updatedAt))

    return NextResponse.json(userDecks)
  } catch (error) {
    console.error('Error fetching decks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch decks' },
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
    
    // Validate the request body
    const deckData = {
      ...body,
      id: uuidv4(),
      userId: session.userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const validatedDeck = insertDeckSchema.parse(deckData)

    const [newDeck] = await db
      .insert(decks)
      .values(validatedDeck)
      .returning()

    return NextResponse.json(newDeck, { status: 201 })
  } catch (error) {
    console.error('Error creating deck:', error)
    return NextResponse.json(
      { error: 'Failed to create deck' },
      { status: 500 }
    )
  }
}
