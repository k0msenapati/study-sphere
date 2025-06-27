"use client"

import { CopilotKit } from "@copilotkit/react-core"
import { CopilotPopup } from "@copilotkit/react-ui"
import "@copilotkit/react-ui/styles.css"
import { Sidebar } from "@/components/sidebar"
import { Menu } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <div className="flex h-screen w-full">
        {/* Sidebar overlay for all screens */}
        {sidebarOpen && (
          <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}
        <div className="flex flex-col flex-1">
          {/* Hamburger button for all screens, fixed at top left, only when sidebar is closed */}
          {!sidebarOpen && (
            <div className="fixed top-4 left-4 z-50">
              <Button variant="outline" size="icon" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open sidebar</span>
              </Button>
            </div>
          )}
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            {children}
          </main>
        </div>
      </div>
      <CopilotPopup />
    </CopilotKit>
  )
}
