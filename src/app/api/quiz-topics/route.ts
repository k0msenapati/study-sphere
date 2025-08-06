import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { quizTopics } from '@/lib/db/schema'

export async function GET() {
  try {
    const topics = await db.select().from(quizTopics)
    return NextResponse.json(topics)
  } catch (error) {
    console.error('Error fetching quiz topics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quiz topics' },
      { status: 500 }
    )
  }
} 