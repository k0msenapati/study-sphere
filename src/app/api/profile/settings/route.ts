import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth/jwt"

// For now, we'll use a simple in-memory storage for settings
// In a real app, you'd want to add this to the database schema
const userSettings = new Map<number, {
  emailNotifications: boolean
  studyReminders: boolean
  weeklyProgress: boolean
}>()

// GET /api/profile/settings — Get user settings
export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // Get settings from storage (default values if not found)
    const settings = userSettings.get(session.userId) || {
      emailNotifications: true,
      studyReminders: true,
      weeklyProgress: false,
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Failed to fetch settings:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT /api/profile/settings — Update user settings
export async function PUT(req: NextRequest) {
  const session = await getSession()
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { emailNotifications, studyReminders, weeklyProgress } = await req.json()

    // Validate input
    if (typeof emailNotifications !== 'boolean' || 
        typeof studyReminders !== 'boolean' || 
        typeof weeklyProgress !== 'boolean') {
      return NextResponse.json({ error: "Invalid settings format" }, { status: 400 })
    }

    // Save settings
    const settings = {
      emailNotifications,
      studyReminders,
      weeklyProgress,
    }

    userSettings.set(session.userId, settings)

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Failed to update settings:', error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
