"use client"

import { useState } from 'react'
import { format } from 'date-fns'
import { Task, TaskPriority, TaskStatus } from '@/lib/tasks/types'
import { useTasksContext } from '@/lib/tasks/tasks-provider'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { MoreHorizontal, Calendar, Clock, Trash2, Edit, Flag } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TaskItemProps {
  task: Task
  onEdit?: (task: Task) => void
}

const priorityColors = {
  low: 'bg-green-100 text-green-700 border-green-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  high: 'bg-red-100 text-red-700 border-red-200'
}

const statusColors = {
  pending: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700'
}

export function TaskItem({ task, onEdit }: TaskItemProps) {
  const { toggleTaskStatus, deleteTask, updateTask } = useTasksContext()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleToggleStatus = async () => {
    await toggleTaskStatus(task.id)
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    const success = await deleteTask(task.id)
    if (!success) {
      setIsDeleting(false)
    }
  }

  const handlePriorityChange = async (priority: TaskPriority) => {
    await updateTask({
      id: task.id,
      priority
    })
  }

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed'

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md",
      task.status === 'completed' && "opacity-75",
      isOverdue && "border-red-200 bg-red-50"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.status === 'completed'}
            onCheckedChange={handleToggleStatus}
            className="mt-1"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className={cn(
                  "font-medium text-sm",
                  task.status === 'completed' && "line-through text-muted-foreground"
                )}>
                  {task.title}
                </h3>
                
                {task.description && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {task.description}
                  </p>
                )}
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onEdit && (
                    <DropdownMenuItem onClick={() => onEdit(task)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <DropdownMenuItem>
                        <Flag className="mr-2 h-4 w-4" />
                        Priority
                      </DropdownMenuItem>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="left">
                      <DropdownMenuItem onClick={() => handlePriorityChange('low')}>
                        <Badge className="bg-green-100 text-green-700">Low</Badge>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePriorityChange('medium')}>
                        <Badge className="bg-yellow-100 text-yellow-700">Medium</Badge>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handlePriorityChange('high')}>
                        <Badge className="bg-red-100 text-red-700">High</Badge>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e: Event) => e.preventDefault()}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Task</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{task.title}"? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
                          {isDeleting ? 'Deleting...' : 'Delete'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge className={priorityColors[task.priority]} variant="outline">
                {task.priority}
              </Badge>
              
              <Badge className={statusColors[task.status]} variant="secondary">
                {task.status.replace('_', ' ')}
              </Badge>
              
              {task.dueDate && (
                <div className={cn(
                  "flex items-center gap-1 text-xs",
                  isOverdue ? "text-red-600" : "text-muted-foreground"
                )}>
                  <Calendar className="h-3 w-3" />
                  Due {format(new Date(task.dueDate), 'MMM d')}
                  {isOverdue && (
                    <Badge variant="destructive" className="ml-1 text-xs">
                      Overdue
                    </Badge>
                  )}
                </div>
              )}
              
              {task.scheduledDate && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {format(new Date(task.scheduledDate), 'MMM d')}
                  {task.scheduledStartTime && (
                    <span>at {task.scheduledStartTime}</span>
                  )}
                </div>
              )}
              
              {task.estimatedDuration && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {task.estimatedDuration}m
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
