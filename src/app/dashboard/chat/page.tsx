import { CopilotChat } from "@copilotkit/react-ui"

export default function Page() {
  return (
    <div className="relative h-full w-full bg-neutral-900">
      <div className="absolute inset-0 bg-fuchsia-400 bg-[size:20px_20px] opacity-20 blur-[100px]"></div>
      <div className="relative">
        <CopilotChat
          labels={{
            title: "Studdy Buddy 📚",
            initial: "Welcome to Studdy Buddy! How can I help you today?",
          }}
          instructions="When a user asks a question, analyze it to understand the subject and provide a clear, accurate answer relevant to the study topic. Make sure to focus solely on educational content and avoid giving personal advice or unrelated information."
          className="min-h-screen p-8 pb-32"
        />
      </div>
    </div>
  )
}
