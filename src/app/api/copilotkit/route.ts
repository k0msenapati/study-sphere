import {
  CopilotRuntime,
  GroqAdapter,
  copilotRuntimeNextJSAppRouterEndpoint,
} from "@copilotkit/runtime"
import { NextRequest } from "next/server"
import Groq from "groq-sdk"

// Check if GROQ_API_KEY is available
const groqApiKey = process.env.GROQ_API_KEY

if (!groqApiKey) {
  console.warn("GROQ_API_KEY is not set. CopilotKit functionality will be limited.")
}

const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : undefined

const copilotKit = new CopilotRuntime()

const serviceAdapter = groq ? new GroqAdapter({ groq, model: "gemma2-9b-it" }) : null

export const POST = async (req: NextRequest) => {
  // Return early if no API key is configured
  if (!serviceAdapter) {
    return new Response(
      JSON.stringify({ error: "GROQ_API_KEY is not configured" }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    )
  }

  const { handleRequest } = copilotRuntimeNextJSAppRouterEndpoint({
    runtime: copilotKit,
    serviceAdapter,
    endpoint: "/api/copilotkit",
  })

  return handleRequest(req)
}
