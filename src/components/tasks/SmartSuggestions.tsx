"use client"

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useTasksContext } from '@/lib/tasks/tasks-provider'
import { generateScheduleSuggestions } from '@/lib/tasks/schedule-utils'
import { ScheduleSuggestion, UserSettings } from '@/lib/tasks/types'
import { Lightbulb, Clock, Star, Calendar } from 'lucide-react'

interface SmartSuggestionsProps {
  userSettings?: UserSettings
}

export function SmartSuggestions({ userSettings }: SmartSuggestionsProps) {
  const { tasks, getPendingTasks, updateTask } = useTasksContext()
  const [suggestions, setSuggestions] = useState<ScheduleSuggestion[]>([])
  const [loading, setLoading] = useState(false)

  const defaultSettings: UserSettings = {
    id: 'default',
    userId: 0,
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

  const settings = userSettings || defaultSettings

  useEffect(() => {
    const generateSuggestions = async () => {
      setLoading(true)
      try {
        const pendingTasks = getPendingTasks()
        const allSuggestions: ScheduleSuggestion[] = []

        // Generate suggestions for high-priority unscheduled tasks
        const unscheduledHighPriorityTasks = pendingTasks.filter(
          task => task.priority === 'high' && !task.scheduledDate
        )

        for (const task of unscheduledHighPriorityTasks.slice(0, 3)) {
          const taskSuggestions = generateScheduleSuggestions(task, tasks, settings, 3)
          allSuggestions.push(...taskSuggestions.slice(0, 2)) // Top 2 suggestions per task
        }

        setSuggestions(allSuggestions.slice(0, 6)) // Show top 6 suggestions
      } catch (error) {
        console.error('Error generating suggestions:', error)
      } finally {
        setLoading(false)
      }
    }

    generateSuggestions()
  }, [tasks, getPendingTasks, settings])

  const handleAcceptSuggestion = async (suggestion: ScheduleSuggestion) => {
    // Find the task for this suggestion
    const task = tasks.find(t => 
      t.priority === 'high' && 
      !t.scheduledDate && 
      t.status === 'pending'
    )

    if (!task) return

    await updateTask({
      id: task.id,
      scheduledDate: suggestion.date,
      scheduledStartTime: suggestion.timeSlot.startTime,
      scheduledEndTime: suggestion.timeSlot.endTime,
    })

    // Remove this suggestion from the list
    setSuggestions(prev => prev.filter(s => s !== suggestion))
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Smart Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            Generating smart scheduling suggestions...
          </div>
        </CardContent>
      </Card>
    )
  }

  if (suggestions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Smart Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            No scheduling suggestions available. Great job keeping up with your tasks!
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5" />
          Smart Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="p-3 border rounded-lg bg-blue-50 border-blue-200"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-sm">
                      {format(suggestion.date, 'EEE, MMM d')}
                    </span>
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">
                      {suggestion.timeSlot.startTime} - {suggestion.timeSlot.endTime}
                    </span>
                  </div>
                  
                  <p className="text-xs text-blue-700 mb-2">
                    {suggestion.reason}
                  </p>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className="text-xs bg-white border-blue-300"
                    >
                      <Star className="h-3 w-3 mr-1" />
                      {suggestion.score}% match
                    </Badge>
                    {suggestion.timeSlot.isPeak && (
                      <Badge 
                        variant="outline" 
                        className="text-xs bg-yellow-100 text-yellow-700 border-yellow-300"
                      >
                        Peak Hours
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleAcceptSuggestion(suggestion)}
                  className="text-xs"
                >
                  Schedule
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-muted-foreground">
            💡 <strong>Tip:</strong> Suggestions are based on your peak productivity hours ({settings.peakHoursStart} - {settings.peakHoursEnd}) 
            and task priorities. Accept suggestions to automatically schedule your high-priority tasks.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
