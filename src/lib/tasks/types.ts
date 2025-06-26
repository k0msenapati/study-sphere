// src/lib/tasks/types.ts

export type TaskPriority = 'low' | 'medium' | 'high'
export type TaskStatus = 'pending' | 'in_progress' | 'completed'

export interface Task {
  id: string
  userId: number
  title: string
  description?: string | null
  priority: TaskPriority
  status: TaskStatus
  dueDate?: Date | null
  scheduledDate?: Date | null
  scheduledStartTime?: string | null // HH:MM format
  scheduledEndTime?: string | null // HH:MM format
  estimatedDuration?: number | null // in minutes
  completedAt?: Date | null
  createdAt: Date
  updatedAt: Date
}

export interface NewTask {
  title: string
  description?: string
  priority?: TaskPriority
  dueDate?: Date
  scheduledDate?: Date
  scheduledStartTime?: string
  scheduledEndTime?: string
  estimatedDuration?: number
}

export interface TaskUpdate {
  id: string
  title?: string
  description?: string
  priority?: TaskPriority
  status?: TaskStatus
  dueDate?: Date | null
  scheduledDate?: Date | null
  scheduledStartTime?: string | null
  scheduledEndTime?: string | null
  estimatedDuration?: number | null
}

export interface DailyReview {
  id: string
  userId: number
  reviewDate: Date
  completedTasks: number
  totalTasks: number
  reflection?: string | null
  improvements?: string | null
  productivityScore?: number | null
  createdAt: Date
}

export interface NewDailyReview {
  reviewDate: Date
  completedTasks: number
  totalTasks: number
  reflection?: string
  improvements?: string
  productivityScore?: number
}

export interface UserSettings {
  id: string
  userId: number
  focusSessionDuration: number // minutes
  breakDuration: number // minutes
  workStartTime: string // HH:MM format
  workEndTime: string // HH:MM format
  peakHoursStart: string // HH:MM format
  peakHoursEnd: string // HH:MM format
  pomodoroEnabled: boolean
  pomodoroWorkDuration: number // minutes
  pomodoroBreakDuration: number // minutes
  createdAt: Date
  updatedAt: Date
}

export interface NewUserSettings {
  focusSessionDuration?: number
  breakDuration?: number
  workStartTime?: string
  workEndTime?: string
  peakHoursStart?: string
  peakHoursEnd?: string
  pomodoroEnabled?: boolean
  pomodoroWorkDuration?: number
  pomodoroBreakDuration?: number
}

export interface TimeSlot {
  startTime: string
  endTime: string
  isAvailable: boolean
  isPeak: boolean
}

export interface ScheduleSuggestion {
  date: Date
  timeSlot: TimeSlot
  reason: string
  score: number // 0-100, higher is better
}
