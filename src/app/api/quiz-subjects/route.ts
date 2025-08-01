import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { quizSubjects } from '@/lib/db/schema'

export async function GET() {
  try {
    const subjects = await db.select().from(quizSubjects)
    return NextResponse.json(subjects)
  } catch (error) {
    console.error('Error fetching quiz subjects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quiz subjects' },
      { status: 500 }
    )
  }
} 