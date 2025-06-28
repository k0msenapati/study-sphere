import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/jwt'
import { db } from '@/lib/db'
import { tasks } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'

interface RouteContext {
  params: { id: string }
}

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [task] = await db
      .select()
      .from(tasks)
      .where(and(
        eq(tasks.id, params.id),
        eq(tasks.userId, session.userId)
      ))

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json(task)
  } catch (error) {
    console.error('Error fetching task:', error)
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    
    const updateData = {
      ...body,
      updatedAt: new Date(),
      ...(body.status === 'completed' && !body.completedAt ? { completedAt: new Date() } : {}),
    }

    const [updatedTask] = await db
      .update(tasks)
      .set(updateData)
      .where(and(
        eq(tasks.id, params.id),
        eq(tasks.userId, session.userId)
      ))
      .returning()

    if (!updatedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json(updatedTask)
  } catch (error) {
    console.error('Error updating task:', error)
    return NextResponse.json(
      { error: 'Failed to update task' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const [deletedTask] = await db
      .delete(tasks)
      .where(and(
        eq(tasks.id, params.id),
        eq(tasks.userId, session.userId)
      ))
      .returning()

    if (!deletedTask) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Task deleted successfully' })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json(
      { error: 'Failed to delete task' },
      { status: 500 }
    )
  }
}
