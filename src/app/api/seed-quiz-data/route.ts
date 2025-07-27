import { NextResponse } from 'next/server'
import { seedQuizData } from '@/lib/quizzes/seed-data'

export async function POST() {
  try {
    await seedQuizData()
    return NextResponse.json({ success: true, message: 'Quiz data seeded successfully' })
  } catch (error) {
    console.error('Error seeding quiz data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to seed quiz data' },
      { status: 500 }
    )
  }
} 