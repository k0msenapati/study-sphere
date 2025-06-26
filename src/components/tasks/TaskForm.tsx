"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, Calendar as CalendarIcon, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { NewTask, TaskPriority } from '@/lib/tasks/types'
import { useTasksContext } from '@/lib/tasks/tasks-provider'
import { cn } from '@/lib/utils'

interface TaskFormProps {
  onClose?: () => void
}

export function TaskForm({ onClose }: TaskFormProps) {
  const { createTask } = useTasksContext()
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState<NewTask>({
    title: '',
    description: '',
    priority: 'medium' as TaskPriority,
  })
  const [dueDate, setDueDate] = useState<Date>()
  const [scheduledDate, setScheduledDate] = useState<Date>()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim()) return

    const taskData: NewTask = {
      ...formData,
      dueDate,
      scheduledDate,
    }

    const success = await createTask(taskData)
    if (success) {
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
      })
      setDueDate(undefined)
      setScheduledDate(undefined)
      setIsOpen(false)
      onClose?.()
    }
  }

  const TaskFormContent = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="text-sm font-medium">
          Task Title *
        </label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          placeholder="Enter task title..."
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-medium">
          Description
        </label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Add task description..."
          rows={3}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Priority</label>
        <Select
          value={formData.priority}
          onValueChange={(value: TaskPriority) => 
            setFormData(prev => ({ ...prev, priority: value }))
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Low
                </Badge>
              </div>
            </SelectItem>
            <SelectItem value="medium">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                  Medium
                </Badge>
              </div>
            </SelectItem>
            <SelectItem value="high">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-red-100 text-red-700">
                  High
                </Badge>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Due Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !dueDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={setDueDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <label className="text-sm font-medium">Scheduled Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !scheduledDate && "text-muted-foreground"
                )}
              >
                <Clock className="mr-2 h-4 w-4" />
                {scheduledDate ? format(scheduledDate, "PPP") : "Schedule"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={scheduledDate}
                onSelect={setScheduledDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div>
        <label htmlFor="duration" className="text-sm font-medium">
          Estimated Duration (minutes)
        </label>
        <Input
          id="duration"
          type="number"
          value={formData.estimatedDuration || ''}
          onChange={(e) => setFormData(prev => ({ 
            ...prev, 
            estimatedDuration: e.target.value ? parseInt(e.target.value) : undefined 
          }))}
          placeholder="e.g., 60"
          min="1"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsOpen(false)
            onClose?.()
          }}
        >
          Cancel
        </Button>
        <Button type="submit">
          Create Task
        </Button>
      </div>
    </form>
  )

  if (onClose) {
    // Used as inline form
    return <TaskFormContent />
  }

  // Used as dialog
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
        </DialogHeader>
        <TaskFormContent />
      </DialogContent>
    </Dialog>
  )
}
