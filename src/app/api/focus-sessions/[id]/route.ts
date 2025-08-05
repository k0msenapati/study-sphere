import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { focusSessions } from '@/lib/db/schema'
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

    const [focusSession] = await db
      .select()
      .from(focusSessions)
      .where(and(
        eq(focusSessions.id, params.id),
        eq(focusSessions.userId, session.userId)
      ))

    if (!focusSession) {
      return NextResponse.json({ error: 'Focus session not found' }, { status: 404 })
    }

    return NextResponse.json(focusSession)
  } catch (error) {
    console.error('Error fetching focus session:', error)
    return NextResponse.json(
      { error: 'Failed to fetch focus session' },
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

    const [updatedSession] = await db
      .update(focusSessions)
      .set(body)
      .where(and(
        eq(focusSessions.id, params.id),
        eq(focusSessions.userId, session.userId)
      ))
      .returning()

    if (!updatedSession) {
      return NextResponse.json({ error: 'Focus session not found' }, { status: 404 })
    }

    return NextResponse.json(updatedSession)
  } catch (error) {
    console.error('Error updating focus session:', error)
    return NextResponse.json(
      { error: 'Failed to update focus session' },
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

    const [deletedSession] = await db
      .delete(focusSessions)
      .where(and(
        eq(focusSessions.id, params.id),
        eq(focusSessions.userId, session.userId)
      ))
      .returning()

    if (!deletedSession) {
      return NextResponse.json({ error: 'Focus session not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Focus session deleted successfully' })
  } catch (error) {
    console.error('Error deleting focus session:', error)
    return NextResponse.json(
      { error: 'Failed to delete focus session' },
      { status: 500 }
    )
  }
}
