// src/app/dashboard/layout.tsx
"use client"

import { CopilotKit } from "@copilotkit/react-core"
import { CopilotPopup } from "@copilotkit/react-ui"
import { redirect } from 'next/navigation'
import { Sidebar } from "@/components/dashboard/sidebar"
import { FlashcardsProvider } from "@/lib/flashcards/flashcards-provider"
import { TasksProvider } from "@/lib/tasks/tasks-provider"
import { FlowchartProvider } from "@/lib/flowcharts/flowcharts-provider"
import "@copilotkit/react-ui/styles.css"
import { useEffect, useState } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [session, setSession] = useState<{ userId: number; email: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch('/api/auth/session')
        if (response.ok) {
          const sessionData = await response.json()
          setSession(sessionData)
        } else {
          redirect('/auth/login')
        }
      } catch (error) {
        console.error('Failed to fetch session:', error)
        redirect('/auth/login')
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!session) {
    redirect('/auth/login')
    return null
  }

  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <FlashcardsProvider>
        <TasksProvider>
          <FlowchartProvider>
            <div className="flex h-screen bg-background">
              <Sidebar session={session} />
              <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto bg-background">
                  {children}
                </main>
              </div>
              <CopilotPopup />
            </div>
          </FlowchartProvider>
        </TasksProvider>
      </FlashcardsProvider>
    </CopilotKit>
  )
}