"use client"

import { useState, useMemo } from 'react'
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useTasksContext } from '@/lib/tasks/tasks-provider'
import { Task } from '@/lib/tasks/types'
import { generateTimeSlots, findAvailableSlots } from '@/lib/tasks/schedule-utils'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus } from 'lucide-react'
import { TaskForm } from './TaskForm'

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8) // 8 AM to 7 PM

export function TaskScheduler() {
  const { tasks, getTasksForDate } = useTasksContext()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{ date: Date; time: string } | null>(null)

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i))

  const getTasksForDay = (date: Date) => {
    return getTasksForDate(date).filter(task => 
      task.scheduledStartTime && task.scheduledEndTime
    )
  }

  const getTasksInTimeSlot = (date: Date, hour: number) => {
    const dayTasks = getTasksForDay(date)
    return dayTasks.filter(task => {
      if (!task.scheduledStartTime) return false
      const taskHour = parseInt(task.scheduledStartTime.split(':')[0])
      return taskHour === hour
    })
  }

  const handleTimeSlotClick = (date: Date, hour: number) => {
    const timeString = `${hour.toString().padStart(2, '0')}:00`
    setSelectedTimeSlot({ date, time: timeString })
    setShowTaskForm(true)
  }

  const handlePrevWeek = () => {
    setCurrentWeekStart(subWeeks(currentWeekStart, 1))
  }

  const handleNextWeek = () => {
    setCurrentWeekStart(addWeeks(currentWeekStart, 1))
  }

  const handleToday = () => {
    const today = new Date()
    setCurrentWeekStart(startOfWeek(today, { weekStartsOn: 1 }))
    setSelectedDate(today)
  }

  const TaskFormWithSchedule = () => {
    if (!selectedTimeSlot) return null
    
    return (
      <div>
        <div className="mb-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            Scheduling for: {format(selectedTimeSlot.date, 'PPP')} at {selectedTimeSlot.time}
          </p>
        </div>
        <TaskForm onClose={() => {
          setShowTaskForm(false)
          setSelectedTimeSlot(null)
        }} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="week" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="week">Week View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="week" className="space-y-4">
          {/* Week Navigation */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handlePrevWeek}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleNextWeek}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleToday}>
                Today
              </Button>
            </div>
            <h2 className="text-lg font-semibold">
              {format(currentWeekStart, 'MMM d')} - {format(addDays(currentWeekStart, 6), 'MMM d, yyyy')}
            </h2>
          </div>

          {/* Week Grid */}
          <div className="grid grid-cols-8 gap-1 border rounded-lg overflow-hidden">
            {/* Time Header */}
            <div className="bg-muted p-2 text-center text-sm font-medium">
              Time
            </div>
            
            {/* Day Headers */}
            {weekDays.map(day => (
              <div 
                key={day.toISOString()} 
                className={`bg-muted p-2 text-center text-sm font-medium ${
                  isSameDay(day, new Date()) ? 'bg-blue-100 text-blue-700' : ''
                }`}
              >
                <div>{format(day, 'EEE')}</div>
                <div className="text-xs">{format(day, 'MMM d')}</div>
              </div>
            ))}

            {/* Time Slots */}
            {HOURS.map(hour => (
              <div key={hour} className="contents">
                <div className="p-2 text-xs text-muted-foreground border-t bg-gray-50">
                  {hour}:00
                </div>
                {weekDays.map(day => {
                  const tasksInSlot = getTasksInTimeSlot(day, hour)
                  const isToday = isSameDay(day, new Date())
                  
                  return (
                    <div 
                      key={`${day.toISOString()}-${hour}`}
                      className={`p-1 min-h-[60px] border-t cursor-pointer hover:bg-gray-50 ${
                        isToday ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => handleTimeSlotClick(day, hour)}
                    >
                      {tasksInSlot.map(task => (
                        <div
                          key={task.id}
                          className={`text-xs p-1 mb-1 rounded border-l-2 ${
                            task.priority === 'high' ? 'bg-red-100 border-red-400 text-red-700' :
                            task.priority === 'medium' ? 'bg-yellow-100 border-yellow-400 text-yellow-700' :
                            'bg-green-100 border-green-400 text-green-700'
                          }`}
                        >
                          <div className="font-medium truncate">{task.title}</div>
                          {task.scheduledStartTime && task.scheduledEndTime && (
                            <div className="text-xs opacity-75">
                              {task.scheduledStartTime} - {task.scheduledEndTime}
                            </div>
                          )}
                        </div>
                      ))}
                      {tasksInSlot.length === 0 && (
                        <div className="flex items-center justify-center h-full opacity-0 hover:opacity-50 transition-opacity">
                          <Plus className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Calendar
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border"
                    modifiers={{
                      hasTask: (date) => getTasksForDate(date).length > 0
                    }}
                    modifiersClassNames={{
                      hasTask: "bg-blue-100 text-blue-700 font-medium"
                    }}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Selected Day Tasks */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    {format(selectedDate, 'PPP')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {getTasksForDay(selectedDate).length === 0 ? (
                      <div className="text-sm text-muted-foreground text-center py-4">
                        No scheduled tasks for this day
                      </div>
                    ) : (
                      getTasksForDay(selectedDate)
                        .sort((a, b) => (a.scheduledStartTime || '').localeCompare(b.scheduledStartTime || ''))
                        .map(task => (
                          <div key={task.id} className="p-3 border rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{task.title}</h4>
                                {task.description && (
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {task.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 mt-2">
                                  <Badge 
                                    variant="outline" 
                                    className={
                                      task.priority === 'high' ? 'text-red-700 border-red-200' :
                                      task.priority === 'medium' ? 'text-yellow-700 border-yellow-200' :
                                      'text-green-700 border-green-200'
                                    }
                                  >
                                    {task.priority}
                                  </Badge>
                                  {task.scheduledStartTime && task.scheduledEndTime && (
                                    <span className="text-xs text-muted-foreground">
                                      {task.scheduledStartTime} - {task.scheduledEndTime}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Schedule Task Dialog */}
      <Dialog open={showTaskForm} onOpenChange={setShowTaskForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule New Task</DialogTitle>
          </DialogHeader>
          <TaskFormWithSchedule />
        </DialogContent>
      </Dialog>
    </div>
  )
}
