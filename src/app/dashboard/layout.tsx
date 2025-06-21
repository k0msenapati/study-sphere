import { CopilotKit } from "@copilotkit/react-core"
import { CopilotPopup } from "@copilotkit/react-ui"
import Navbar from "@/components/navbar"
import { FlashcardsProvider } from "@/lib/flashcards/flashcards-provider"
import "@copilotkit/react-ui/styles.css"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {  return (
    <CopilotKit runtimeUrl="/api/copilotkit">
      <FlashcardsProvider>
        <div className="h-full w-full">
          <Navbar />
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
              <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]"></div>
            </div>
            <main className="relative z-10">{children}</main>
          </div>
          <CopilotPopup />
        </div>
      </FlashcardsProvider>
    </CopilotKit>
  )
}
