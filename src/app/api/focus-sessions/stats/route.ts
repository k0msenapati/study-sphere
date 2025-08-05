import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { focusSessions } from '@/lib/db/schema'
import { eq, count, sum, avg, and, gte, lt } from 'drizzle-orm'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'week' // 'day', 'week', 'month', 'year'
    
    const now = new Date()
    let startDate: Date
    
    switch (period) {
      case 'day':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    }

    // Get total stats
    const [totalStats] = await db
      .select({
        totalSessions: count(),
        totalPlannedMinutes: sum(focusSessions.plannedDuration),
        totalActualMinutes: sum(focusSessions.actualDuration),
        avgProductivity: avg(focusSessions.productivity),
        completedSessions: count(focusSessions.isCompleted),
      })
      .from(focusSessions)
      .where(and(
        eq(focusSessions.userId, session.userId),
        gte(focusSessions.startTime, startDate),
        eq(focusSessions.isCompleted, true)
      ))

    // Get session breakdown by type
    const sessionsByType = await db
      .select({
        sessionType: focusSessions.sessionType,
        count: count(),
        totalDuration: sum(focusSessions.actualDuration),
      })
      .from(focusSessions)
      .where(and(
        eq(focusSessions.userId, session.userId),
        gte(focusSessions.startTime, startDate),
        eq(focusSessions.isCompleted, true)
      ))
      .groupBy(focusSessions.sessionType)

    // Get productivity distribution
    const productivityDistribution = await db
      .select({
        mood: focusSessions.mood,
        avgProductivity: avg(focusSessions.productivity),
        count: count(),
      })
      .from(focusSessions)
      .where(and(
        eq(focusSessions.userId, session.userId),
        gte(focusSessions.startTime, startDate),
        eq(focusSessions.isCompleted, true)
      ))
      .groupBy(focusSessions.mood)

    // Calculate streaks and achievements
    const recentSessions = await db
      .select({
        startTime: focusSessions.startTime,
        isCompleted: focusSessions.isCompleted,
      })
      .from(focusSessions)
      .where(eq(focusSessions.userId, session.userId))
      .orderBy(focusSessions.startTime)

    const currentStreak = calculateCurrentStreak(recentSessions)
    const longestStreak = calculateLongestStreak(recentSessions)

    const stats = {
      period,
      totalSessions: totalStats?.totalSessions || 0,
      totalPlannedMinutes: totalStats?.totalPlannedMinutes || 0,
      totalActualMinutes: totalStats?.totalActualMinutes || 0,
      avgProductivity: totalStats?.avgProductivity || 0,
      completedSessions: totalStats?.completedSessions || 0,
      sessionsByType,
      productivityDistribution,
      currentStreak,
      longestStreak,
      efficiency: totalStats?.totalPlannedMinutes 
        ? Math.round(((Number(totalStats?.totalActualMinutes) || 0) / Number(totalStats.totalPlannedMinutes)) * 100)
        : 0
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching focus session stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch focus session stats' },
      { status: 500 }
    )
  }
}

function calculateCurrentStreak(sessions: Array<{ startTime: Date; isCompleted: boolean }>): number {
  if (!sessions.length) return 0
  
  let streak = 0
  const today = new Date()
  
  // Group sessions by day and check for consecutive days
  const dailySessions = groupSessionsByDay(sessions)
  const sortedDays = Object.keys(dailySessions).sort().reverse()
  
  for (const day of sortedDays) {
    const dayDate = new Date(day)
    const daysDiff = Math.floor((today.getTime() - dayDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysDiff > streak + 1) break
    
    const hasCompletedSession = dailySessions[day].some(s => s.isCompleted)
    if (hasCompletedSession) {
      streak++
    } else {
      break
    }
  }
  
  return streak
}

function calculateLongestStreak(sessions: Array<{ startTime: Date; isCompleted: boolean }>): number {
  if (!sessions.length) return 0
  
  const dailySessions = groupSessionsByDay(sessions)
  const sortedDays = Object.keys(dailySessions).sort()
  
  let longestStreak = 0
  let currentStreak = 0
  
  for (const day of sortedDays) {
    const hasCompletedSession = dailySessions[day].some(s => s.isCompleted)
    if (hasCompletedSession) {
      currentStreak++
      longestStreak = Math.max(longestStreak, currentStreak)
    } else {
      currentStreak = 0
    }
  }
  
  return longestStreak
}

function groupSessionsByDay(sessions: Array<{ startTime: Date; isCompleted: boolean }>) {
  return sessions.reduce((groups, session) => {
    const day = session.startTime.toISOString().split('T')[0]
    if (!groups[day]) groups[day] = []
    groups[day].push(session)
    return groups
  }, {} as Record<string, Array<{ startTime: Date; isCompleted: boolean }>>)
}
