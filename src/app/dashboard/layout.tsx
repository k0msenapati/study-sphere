import { CopilotKit } from "@copilotkit/react-core"
import { CopilotPopup } from "@copilotkit/react-ui"
import Navbar from "@/components/navbar"
import "@copilotkit/react-ui/styles.css"
import { DashboardThemeProvider } from "@/components/dashboard-theme-provider"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <DashboardThemeProvider>
      <CopilotKit runtimeUrl="/api/copilotkit">
        <div className="h-full w-full">
          <Navbar />
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-gray-950 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:6rem_4rem]">
              <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)] dark:bg-[radial-gradient(circle_800px_at_100%_200px,#2d1b69,transparent)]"></div>
            </div>
            <main className="relative z-10">{children}</main>
          </div>
          <CopilotPopup />
        </div>
      </CopilotKit>
    </DashboardThemeProvider>
  )
}
