import { db } from "@/lib/db"
import { users, notes, tasks } from "@/lib/db/schema"
import { NextRequest, NextResponse } from "next/server"
import { eq, and, count } from "drizzle-orm"
import { getSession } from "@/lib/auth/jwt"

// GET /api/profile — Get user profile with stats
export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get user data
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, session.userId))
      .limit(1)

    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get study stats
    const [notesCount] = await db
      .select({ count: count() })
      .from(notes)
      .where(eq(notes.userId, session.userId))

    const [tasksCount] = await db
      .select({ count: count() })
      .from(tasks)
      .where(eq(tasks.userId, session.userId))

    const [completedTasksCount] = await db
      .select({ count: count() })
      .from(tasks)
      .where(and(
        eq(tasks.userId, session.userId),
        eq(tasks.status, 'completed')
      ))

    // Calculate study streak (simplified - based on last sign in)
    const userData = user[0]
    const studyStreak = calculateStudyStreak(userData.lastSignIn)

    // Estimate total study time (simplified calculation)
    const totalStudyTime = (notesCount.count * 15) + (completedTasksCount.count * 30) // rough estimate

    const profileData = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      displayName: userData.displayName,
      bio: userData.bio,
      avatarUrl: userData.avatarUrl,
      lastSignIn: userData.lastSignIn,
      createdAt: userData.createdAt,
      studyStreak,
      totalNotes: notesCount.count,
      totalTasks: tasksCount.count,
      completedTasks: completedTasksCount.count,
      totalStudyTime,
    }

    return NextResponse.json(profileData)
  } catch (error) {
    console.error('Failed to fetch profile:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/profile — Update user profile
export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { name, displayName, bio } = await req.json()

    const updatedUser = await db
      .update(users)
      .set({
        name,
        displayName,
        bio,
        updatedAt: new Date(),
      })
      .where(eq(users.id, session.userId))
      .returning()

    if (!updatedUser.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      name: updatedUser[0].name,
      displayName: updatedUser[0].displayName,
      bio: updatedUser[0].bio,
    })
  } catch (error) {
    console.error('Failed to update profile:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/profile — Delete user account
export async function DELETE(req: NextRequest) {
  const session = await getSession()
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Delete user (cascade will handle related data)
    await db
      .delete(users)
      .where(eq(users.id, session.userId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete account:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Helper function to calculate study streak
function calculateStudyStreak(lastSignIn: Date | null): number {
  if (!lastSignIn) return 0

  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  // Normalize dates to compare only the date part
  const normalizeDate = (date: Date) => {
    const normalized = new Date(date)
    normalized.setHours(0, 0, 0, 0)
    return normalized
  }

  const normalizedToday = normalizeDate(today)
  const normalizedYesterday = normalizeDate(yesterday)
  const normalizedLastSignIn = normalizeDate(lastSignIn)

  // If last sign in was today, they have at least 1 day streak
  if (normalizedLastSignIn.getTime() === normalizedToday.getTime()) {
    return 1 // Simplified - could be enhanced to track actual consecutive days
  }

  // If last sign in was yesterday, they broke their streak today
  if (normalizedLastSignIn.getTime() === normalizedYesterday.getTime()) {
    return 0
  }

  // If last sign in was more than 1 day ago, streak is broken
  return 0
}
