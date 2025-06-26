// src/lib/tasks/schedule-utils.ts

import { Task, TimeSlot, ScheduleSuggestion, UserSettings } from './types'
import { format, addMinutes, parse, isAfter, isBefore, addDays } from 'date-fns'

export function generateTimeSlots(
  startTime: string, 
  endTime: string, 
  duration: number = 30
): TimeSlot[] {
  const slots: TimeSlot[] = []
  const start = parse(startTime, 'HH:mm', new Date())
  const end = parse(endTime, 'HH:mm', new Date())
  
  let current = start
  
  while (isBefore(current, end)) {
    const slotEnd = addMinutes(current, duration)
    if (isAfter(slotEnd, end)) break
    
    slots.push({
      startTime: format(current, 'HH:mm'),
      endTime: format(slotEnd, 'HH:mm'),
      isAvailable: true,
      isPeak: false
    })
    
    current = slotEnd
  }
  
  return slots
}

export function markPeakHours(
  slots: TimeSlot[], 
  peakStart: string, 
  peakEnd: string
): TimeSlot[] {
  return slots.map(slot => ({
    ...slot,
    isPeak: isTimeBetween(slot.startTime, peakStart, peakEnd)
  }))
}

export function isTimeBetween(time: string, start: string, end: string): boolean {
  const timeObj = parse(time, 'HH:mm', new Date())
  const startObj = parse(start, 'HH:mm', new Date())
  const endObj = parse(end, 'HH:mm', new Date())
  
  return !isBefore(timeObj, startObj) && !isAfter(timeObj, endObj)
}

export function findAvailableSlots(
  date: Date,
  existingTasks: Task[],
  settings: UserSettings
): TimeSlot[] {
  // Generate all possible time slots for the day
  let slots = generateTimeSlots(
    settings.workStartTime,
    settings.workEndTime,
    30 // 30-minute slots
  )
  
  // Mark peak productivity hours
  slots = markPeakHours(slots, settings.peakHoursStart, settings.peakHoursEnd)
  
  // Remove slots that are already occupied by scheduled tasks
  const scheduledTasks = existingTasks.filter(task => {
    return task.scheduledDate && 
           new Date(task.scheduledDate).toDateString() === date.toDateString() &&
           task.scheduledStartTime && 
           task.scheduledEndTime
  })
  
  return slots.filter(slot => {
    return !scheduledTasks.some(task => {
      return timeSlotsOverlap(
        slot.startTime, 
        slot.endTime, 
        task.scheduledStartTime!, 
        task.scheduledEndTime!
      )
    })
  })
}

export function timeSlotsOverlap(
  start1: string, 
  end1: string, 
  start2: string, 
  end2: string
): boolean {
  const s1 = parse(start1, 'HH:mm', new Date())
  const e1 = parse(end1, 'HH:mm', new Date())
  const s2 = parse(start2, 'HH:mm', new Date())
  const e2 = parse(end2, 'HH:mm', new Date())
  
  return isBefore(s1, e2) && isAfter(e1, s2)
}

export function generateScheduleSuggestions(
  task: Task,
  existingTasks: Task[],
  settings: UserSettings,
  daysAhead: number = 7
): ScheduleSuggestion[] {
  const suggestions: ScheduleSuggestion[] = []
  const today = new Date()
  
  for (let i = 0; i < daysAhead; i++) {
    const date = addDays(today, i)
    const availableSlots = findAvailableSlots(date, existingTasks, settings)
    
    availableSlots.forEach(slot => {
      const score = calculateScheduleScore(task, slot, date, settings)
      suggestions.push({
        date,
        timeSlot: slot,
        reason: generateScheduleReason(task, slot, score),
        score
      })
    })
  }
  
  return suggestions.sort((a, b) => b.score - a.score).slice(0, 5)
}

function calculateScheduleScore(
  task: Task,
  slot: TimeSlot,
  date: Date,
  settings: UserSettings
): number {
  let score = 50 // Base score
  
  // Prefer peak hours for high-priority tasks
  if (task.priority === 'high' && slot.isPeak) {
    score += 30
  } else if (task.priority === 'medium' && slot.isPeak) {
    score += 15
  }
  
  // Prefer earlier dates for urgent tasks
  if (task.dueDate) {
    const daysUntilDue = Math.ceil(
      (new Date(task.dueDate).getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    )
    if (daysUntilDue <= 2) {
      score += 25
    } else if (daysUntilDue <= 5) {
      score += 10
    }
  }
  
  // Prefer morning slots for better focus
  const slotHour = parseInt(slot.startTime.split(':')[0])
  if (slotHour >= 9 && slotHour <= 11) {
    score += 15
  }
  
  // Slight preference for today/tomorrow
  const daysFromNow = Math.ceil(
    (date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  )
  if (daysFromNow === 0) score += 10
  else if (daysFromNow === 1) score += 5
  
  return Math.min(100, Math.max(0, score))
}

function generateScheduleReason(
  task: Task,
  slot: TimeSlot,
  score: number
): string {
  const reasons: string[] = []
  
  if (slot.isPeak && task.priority === 'high') {
    reasons.push('During your peak productivity hours')
  } else if (slot.isPeak) {
    reasons.push('During peak focus time')
  }
  
  const slotHour = parseInt(slot.startTime.split(':')[0])
  if (slotHour >= 9 && slotHour <= 11) {
    reasons.push('Morning focus period')
  }
  
  if (task.dueDate) {
    const daysUntilDue = Math.ceil(
      (new Date(task.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )
    if (daysUntilDue <= 2) {
      reasons.push('Due soon - high priority')
    }
  }
  
  if (reasons.length === 0) {
    reasons.push('Available time slot')
  }
  
  return reasons.join(', ')
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`
  }
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  if (remainingMinutes === 0) {
    return `${hours}h`
  }
  
  return `${hours}h ${remainingMinutes}m`
}
