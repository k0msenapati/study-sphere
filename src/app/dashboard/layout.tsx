// src/app/dashboard/layout.tsx
import { CopilotKit } from "@copilotkit/react-core"
import { CopilotPopup } from "@copilotkit/react-ui"
import { getSession } from '@/lib/auth/jwt'
import { redirect } from 'next/navigation'
import AuthenticatedNavbar from "@/components/navbar"
import { FlashcardsProvider } from "@/lib/flashcards/flashcards-provider"
import { TasksProvider } from "@/lib/tasks/tasks-provider"
import "@copilotkit/react-ui/styles.css"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  if (!session) {
    redirect('/auth/login')
  }  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <FlashcardsProvider>
        <TasksProvider>
        <div className="h-full w-full bg-background text-foreground">
          <AuthenticatedNavbar session={session} />
          <div className="relative overflow-hidden bg-background">
            <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,theme(colors.border)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.border)_1px,transparent_1px)] bg-[size:6rem_4rem]">
              <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,theme(colors.primary/20),transparent)]"></div>
            </div>
            <main className="relative z-10 bg-background">{children}</main>
          </div>
          <CopilotPopup />
        </div>
        </TasksProvider>
      </FlashcardsProvider>
    </CopilotKit>
  )
}