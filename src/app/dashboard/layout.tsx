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
        <div className="h-full w-full bg-white text-slate-900 light" style={{
          '--background': '0 0% 100%',
          '--foreground': '222 84% 4.9%',
          '--card': '0 0% 100%',
          '--card-foreground': '222 84% 4.9%',
          '--popover': '0 0% 100%',
          '--popover-foreground': '222 84% 4.9%',
          '--primary': '217 91% 60%',
          '--primary-foreground': '210 40% 98%',
          '--secondary': '210 40% 96%',
          '--secondary-foreground': '222 84% 4.9%',
          '--muted': '210 40% 96%',
          '--muted-foreground': '215 16% 47%',
          '--accent': '210 40% 96%',
          '--accent-foreground': '222 84% 4.9%',
          '--destructive': '0 84% 60%',
          '--destructive-foreground': '210 40% 98%',
          '--border': '214 32% 91%',
          '--input': '214 32% 91%',
          '--ring': '217 91% 60%'
        } as React.CSSProperties}>
          <AuthenticatedNavbar session={session} />
          <div className="relative overflow-hidden bg-white">
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
              <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]"></div>
            </div>
            <main className="relative z-10 bg-white">{children}</main>
          </div>
          <CopilotPopup />
        </div>
        </TasksProvider>
      </FlashcardsProvider>
    </CopilotKit>
  )
}