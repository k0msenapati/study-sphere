// src/lib/tasks/tasks-provider.tsx
"use client"

import { createContext, useContext, ReactNode } from 'react'
import { useTasks } from './use-tasks'
import { Task, NewTask, TaskUpdate, TaskPriority, TaskStatus } from './types'

interface TasksContextType {
  tasks: Task[]
  loading: boolean
  error: string | null
  fetchTasks: () => Promise<void>
  createTask: (taskData: NewTask) => Promise<Task | null>
  updateTask: (taskUpdate: TaskUpdate) => Promise<Task | null>
  deleteTask: (taskId: string) => Promise<boolean>
  toggleTaskStatus: (taskId: string) => Promise<void>
  getTasksByPriority: (priority: TaskPriority) => Task[]
  getTasksByStatus: (status: TaskStatus) => Task[]
  getTasksForDate: (date: Date) => Task[]
  getPendingTasks: () => Task[]
  getCompletedTasks: () => Task[]
  getOverdueTasks: () => Task[]
}

const TasksContext = createContext<TasksContextType | undefined>(undefined)

export function TasksProvider({ children }: { children: ReactNode }) {
  const tasksState = useTasks()

  return (
    <TasksContext.Provider value={tasksState}>
      {children}
    </TasksContext.Provider>
  )
}

export function useTasksContext() {
  const context = useContext(TasksContext)
  if (context === undefined) {
    throw new Error('useTasksContext must be used within a TasksProvider')
  }
  return context
}
