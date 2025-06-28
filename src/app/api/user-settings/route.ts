import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { userSettings, insertUserSettingsSchema } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [settings] = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, session.userId))

    if (!settings) {
      // Create default settings if none exist
      const defaultSettings = {
        id: uuidv4(),
        userId: session.userId,
        focusSessionDuration: 90,
        breakDuration: 20,
        workStartTime: '09:00',
        workEndTime: '17:00',
        peakHoursStart: '10:00',
        peakHoursEnd: '12:00',
        pomodoroEnabled: false,
        pomodoroWorkDuration: 25,
        pomodoroBreakDuration: 5,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const [newSettings] = await db
        .insert(userSettings)
        .values(defaultSettings)
        .returning()

      return NextResponse.json(newSettings)
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching user settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user settings' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    const updateData = {
      ...body,
      updatedAt: new Date(),
    }

    const [updatedSettings] = await db
      .update(userSettings)
      .set(updateData)
      .where(eq(userSettings.userId, session.userId))
      .returning()

    if (!updatedSettings) {
      return NextResponse.json({ error: 'Settings not found' }, { status: 404 })
    }

    return NextResponse.json(updatedSettings)
  } catch (error) {
    console.error('Error updating user settings:', error)
    return NextResponse.json(
      { error: 'Failed to update user settings' },
      { status: 500 }
    )
  }
}
