import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { focusSessions, insertFocusSessionSchema } from '@/lib/db/schema'
import { eq, desc, and, gte, lt } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    let whereConditions = eq(focusSessions.userId, session.userId)
    
    if (startDate && endDate) {
      whereConditions = and(
        eq(focusSessions.userId, session.userId),
        gte(focusSessions.startTime, new Date(startDate)),
        lt(focusSessions.startTime, new Date(endDate))
      )!
    }

    const sessions = await db
      .select()
      .from(focusSessions)
      .where(whereConditions)
      .orderBy(desc(focusSessions.startTime))
      .limit(limit)

    return NextResponse.json(sessions)
  } catch (error) {
    console.error('Error fetching focus sessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch focus sessions' },
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
    
    const sessionData = {
      ...body,
      id: uuidv4(),
      userId: session.userId,
      createdAt: new Date(),
    }

    const validatedSession = insertFocusSessionSchema.parse(sessionData)

    const [newSession] = await db
      .insert(focusSessions)
      .values(validatedSession)
      .returning()

    return NextResponse.json(newSession, { status: 201 })
  } catch (error) {
    console.error('Error creating focus session:', error)
    return NextResponse.json(
      { error: 'Failed to create focus session' },
      { status: 500 }
    )
  }
}
