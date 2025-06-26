"use client"

import { TasksProvider } from '@/lib/tasks/tasks-provider'
import { TasksList } from '@/components/tasks/TasksList'
import { TaskScheduler } from '@/components/tasks/TaskScheduler'
import { DailyReviewPrompt } from '@/components/tasks/DailyReview'
import { SmartSuggestions } from '@/components/tasks/SmartSuggestions'
import { ProductivitySettings } from '@/components/tasks/ProductivitySettings'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckSquare, Calendar, BarChart3, Settings } from 'lucide-react'

export default function TodoPage() {
  return (
    <TasksProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Task Management & Planning
            </h1>
            <p className="text-gray-600">
              Organize your tasks, schedule your time, and track your progress
            </p>
          </div>

          {/* Daily Review Prompt */}
          <div className="mb-6">
            <DailyReviewPrompt />
          </div>

          {/* Main Content */}
          <Tabs defaultValue="tasks" className="w-full">
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger value="tasks" className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4" />
                Tasks
              </TabsTrigger>
              <TabsTrigger value="schedule" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Schedule
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="tasks" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <TasksList />
                </div>
                <div>
                  <SmartSuggestions />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="space-y-6">
              <TaskScheduler />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Productivity Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      Analytics dashboard coming soon...
                      <br />
                      Track your productivity trends, completion rates, and time insights.
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      Weekly progress charts will show here...
                      <br />
                      Visualize your task completion patterns and identify your most productive days.
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <ProductivitySettings />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TasksProvider>
  )
}
