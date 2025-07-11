import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { notes, tasks, flashcards, decks } from '@/lib/db/schema'
import { eq, count } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = session.userId

    // Get counts for different entities
    const [
      notesCount,
      tasksCount, 
      decksCount
    ] = await Promise.all([
      db.select({ count: count() }).from(notes).where(eq(notes.userId, userId)),
      db.select({ count: count() }).from(tasks).where(eq(tasks.userId, userId)),
      db.select({ count: count() }).from(decks).where(eq(decks.userId, userId))
    ])

    // Get flashcards count by joining with decks
    const flashcardsResult = await db
      .select({ count: count() })
      .from(flashcards)
      .innerJoin(decks, eq(flashcards.deckId, decks.id))
      .where(eq(decks.userId, userId))

    // For now, return mock data for metrics that don't have tables yet
    // In the future, you can add proper tracking for study time, quizzes, etc.
    const stats = {
      totalStudyTime: 320, // minutes - this should come from a study sessions table
      totalQuizzes: 15, // this should come from a quiz attempts table
      totalNotes: notesCount[0]?.count || 0,
      totalTasks: tasksCount[0]?.count || 0,
      totalFlashcards: flashcardsResult[0]?.count || 0,
      totalDecks: decksCount[0]?.count || 0,
      streakDays: 7 // this should be calculated from daily activity
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Failed to fetch dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}
