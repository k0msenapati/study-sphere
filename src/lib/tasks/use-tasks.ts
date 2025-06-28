// src/lib/tasks/use-tasks.ts
"use client"

import { useState, useEffect, useCallback } from 'react'
import { Task, NewTask, TaskUpdate, TaskPriority, TaskStatus } from './types'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/tasks')
      if (!response.ok) {
        throw new Error('Failed to fetch tasks')
      }
      const data = await response.json()
      setTasks(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }, [])

  const createTask = useCallback(async (taskData: NewTask): Promise<Task | null> => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) {
        throw new Error('Failed to create task')
      }

      const newTask = await response.json()
      setTasks(prev => [newTask, ...prev])
      return newTask
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create task')
      return null
    }
  }, [])

  const updateTask = useCallback(async (taskUpdate: TaskUpdate): Promise<Task | null> => {
    try {
      const response = await fetch(`/api/tasks/${taskUpdate.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskUpdate),
      })

      if (!response.ok) {
        throw new Error('Failed to update task')
      }

      const updatedTask = await response.json()
      setTasks(prev => prev.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      ))
      return updatedTask
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update task')
      return null
    }
  }, [])

  const deleteTask = useCallback(async (taskId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete task')
      }

      setTasks(prev => prev.filter(task => task.id !== taskId))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete task')
      return false
    }
  }, [])

  const toggleTaskStatus = useCallback(async (taskId: string): Promise<void> => {
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    const newStatus: TaskStatus = task.status === 'completed' ? 'pending' : 
                                task.status === 'pending' ? 'in_progress' : 'completed'
    
    await updateTask({
      id: taskId,
      status: newStatus,
      ...(newStatus === 'completed' ? { completedAt: new Date() } : {}),
    })
  }, [tasks, updateTask])

  const getTasksByPriority = useCallback((priority: TaskPriority) => {
    return tasks.filter(task => task.priority === priority)
  }, [tasks])

  const getTasksByStatus = useCallback((status: TaskStatus) => {
    return tasks.filter(task => task.status === status)
  }, [tasks])

  const getTasksForDate = useCallback((date: Date) => {
    return tasks.filter(task => {
      if (!task.scheduledDate) return false
      const taskDate = new Date(task.scheduledDate)
      return taskDate.toDateString() === date.toDateString()
    })
  }, [tasks])

  const getPendingTasks = useCallback(() => {
    return tasks.filter(task => task.status !== 'completed')
  }, [tasks])

  const getCompletedTasks = useCallback(() => {
    return tasks.filter(task => task.status === 'completed')
  }, [tasks])

  const getOverdueTasks = useCallback(() => {
    const today = new Date()
    return tasks.filter(task => 
      task.dueDate && 
      new Date(task.dueDate) < today && 
      task.status !== 'completed'
    )
  }, [tasks])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  return {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskStatus,
    getTasksByPriority,
    getTasksByStatus,
    getTasksForDate,
    getPendingTasks,
    getCompletedTasks,
    getOverdueTasks
  }
}
