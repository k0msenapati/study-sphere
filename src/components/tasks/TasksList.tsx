"use client"

import { useState, useMemo } from 'react'
import { TaskItem } from './TaskItem'
import { TaskForm } from './TaskForm'
import { Task, TaskPriority, TaskStatus } from '@/lib/tasks/types'
import { useTasksContext } from '@/lib/tasks/tasks-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Filter, Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export function TasksList() {
  const { 
    tasks, 
    loading, 
    error, 
    getPendingTasks, 
    getCompletedTasks, 
    getOverdueTasks,
    getTasksByPriority 
  } = useTasksContext()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPriority, setFilterPriority] = useState<TaskPriority | 'all'>('all')
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all')
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  const filteredTasks = useMemo(() => {
    let filtered = tasks

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(task => task.priority === filterPriority)
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(task => task.status === filterStatus)
    }

    return filtered.sort((a, b) => {
      // Sort by priority first, then by creation date
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority]
      if (priorityDiff !== 0) return priorityDiff
      
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }, [tasks, searchQuery, filterPriority, filterStatus])

  const pendingTasks = getPendingTasks()
  const completedTasks = getCompletedTasks()
  const overdueTasks = getOverdueTasks()
  const highPriorityTasks = getTasksByPriority('high')

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading tasks...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-2">Error loading tasks</div>
        <div className="text-sm text-muted-foreground">{error}</div>
      </div>
    )
  }

  const handleEditTask = (task: Task) => {
    setEditingTask(task)
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTasks.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueTasks.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <Badge variant="destructive" className="h-4 w-fit text-xs">!</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highPriorityTasks.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-2 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={filterPriority} onValueChange={(value: TaskPriority | 'all') => setFilterPriority(value)}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterStatus} onValueChange={(value: TaskStatus | 'all') => setFilterStatus(value)}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <TaskForm />
      </div>

      {/* Tasks Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="overdue">Overdue</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-3 mt-4">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {tasks.length === 0 ? "No tasks yet. Create your first task!" : "No tasks match your filters."}
            </div>
          ) : (
            filteredTasks.map(task => (
              <TaskItem key={task.id} task={task} onEdit={handleEditTask} />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-3 mt-4">
          {pendingTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No pending tasks. Great job!
            </div>
          ) : (
            pendingTasks.map(task => (
              <TaskItem key={task.id} task={task} onEdit={handleEditTask} />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-3 mt-4">
          {completedTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No completed tasks yet.
            </div>
          ) : (
            completedTasks.map(task => (
              <TaskItem key={task.id} task={task} onEdit={handleEditTask} />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="overdue" className="space-y-3 mt-4">
          {overdueTasks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No overdue tasks. You're on track!
            </div>
          ) : (
            overdueTasks.map(task => (
              <TaskItem key={task.id} task={task} onEdit={handleEditTask} />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Edit Task Dialog */}
      <Dialog open={!!editingTask} onOpenChange={() => setEditingTask(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          {editingTask && (
            <div>
              {/* TODO: Implement task editing form */}
              <p className="text-muted-foreground">Task editing form will be implemented here.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
