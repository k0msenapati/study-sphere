import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { tasks, insertTaskSchema } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { v4 as uuidv4 } from 'uuid'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, session.userId))
      .orderBy(desc(tasks.createdAt))

    return NextResponse.json(userTasks)
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
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
    
    // Validate the request body
    const taskData = {
      ...body,
      id: uuidv4(),
      userId: session.userId,
      status: 'pending' as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const validatedTask = insertTaskSchema.parse(taskData)

    const [newTask] = await db
      .insert(tasks)
      .values(validatedTask)
      .returning()

    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    console.error('Error creating task:', error)
    return NextResponse.json(
      { error: 'Failed to create task' },
      { status: 500 }
    )
  }
}
