import { NextRequest, NextResponse } from 'next/server'

interface FlowchartGenerationRequest {
  concept: string
  chartType?: string
  complexity?: string
}

export async function POST(req: NextRequest) {
  try {
    const { concept, chartType = 'flowchart', complexity = 'detailed' }: FlowchartGenerationRequest = await req.json()

    if (!concept) {
      return NextResponse.json(
        { error: 'Concept description is required' },
        { status: 400 }
      )
    }

    // Forward to the main generation API to ensure consistency
    const response = await fetch(`${req.nextUrl.origin}/api/generate-flowchart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        concept,
        chartType,
        complexity
      })
    })

    if (!response.ok) {
      throw new Error(`Failed to generate flowchart: ${response.statusText}`)
    }

    const result = await response.json()
    return NextResponse.json(result)

  } catch (error) {
    console.error('Error in CopilotKit flowchart generation:', error)
    return NextResponse.json(
      { error: 'Failed to generate flowchart' },
      { status: 500 }
    )
  }
}
