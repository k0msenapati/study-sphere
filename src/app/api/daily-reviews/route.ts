import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { dailyReviews, insertDailyReviewSchema } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const url = new URL(request.url)
    const date = url.searchParams.get('date')

    let reviews

    if (date) {
      const targetDate = new Date(date)
      reviews = await db
        .select()
        .from(dailyReviews)
        .where(and(
          eq(dailyReviews.userId, session.userId),
          eq(dailyReviews.reviewDate, targetDate)
        ))
    } else {
      reviews = await db
        .select()
        .from(dailyReviews)
        .where(eq(dailyReviews.userId, session.userId))
        .orderBy(desc(dailyReviews.reviewDate))
        .limit(10)
    }

    return NextResponse.json(reviews)
  } catch (error) {
    console.error('Error fetching daily reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch daily reviews' },
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
    
    const reviewData = {
      ...body,
      id: uuidv4(),
      userId: session.userId,
      createdAt: new Date(),
    }

    const validatedReview = insertDailyReviewSchema.parse(reviewData)

    const [newReview] = await db
      .insert(dailyReviews)
      .values(validatedReview)
      .returning()

    return NextResponse.json(newReview, { status: 201 })
  } catch (error) {
    console.error('Error creating daily review:', error)
    return NextResponse.json(
      { error: 'Failed to create daily review' },
      { status: 500 }
    )
  }
}
