import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

interface FlowchartGenerationRequest {
  concept: string
  chartType: string
  complexity: string
}

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

async function generateMermaidWithAI(concept: string, chartType: string, complexity: string): Promise<string> {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY not configured')
  }

  const prompt = createPromptForChartType(concept, chartType, complexity)
  
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are an expert at creating Mermaid diagrams. Generate only valid Mermaid syntax without any explanation or markdown formatting. 

For flowcharts, follow this EXACT syntax:
- Start with "flowchart TD"
- Use format: NodeID["Node Text"] --> NodeID2["Node Text 2"]
- For decisions: NodeID{"Question?"} -->|Yes| NodeID2["Action"]
- For start/end: START(["Start"]) and END(["End"])
- Each line should be: NodeID["Text"] --> NextNodeID["Text"]

Example:
flowchart TD
    START(["Start"]) --> A["Process Data"]
    A --> B{"Is Valid?"}
    B -->|Yes| C["Continue"]
    B -->|No| D["Show Error"]
    C --> END(["End"])
    D --> END

Ensure all syntax is valid and each node has descriptive text in quotes.`
      },
      {
        role: "user", 
        content: prompt
      }
    ],
    model: "gemma2-9b-it",
    temperature: 0.3,
    max_tokens: 1000
  })

  const result = completion.choices[0]?.message?.content?.trim()
  if (!result) {
    throw new Error('No response from AI')
  }

  // Clean up the response to ensure it's valid Mermaid
  return sanitizeMermaidCode(result)
}

function createPromptForChartType(concept: string, chartType: string, complexity: string): string {
  const basePrompt = `Create a ${complexity} ${chartType} diagram for: "${concept}"`
  
  switch (chartType) {
    case 'flowchart':
      return `${basePrompt}

Show the complete process flow including:
${complexity === 'simple' ? '- Main steps only' : complexity === 'detailed' ? '- Main steps with decision points and error handling' : '- Comprehensive flow with all branches, error handling, validation, and edge cases'}

Use proper Mermaid flowchart syntax:
- Rectangle nodes: A[Process Step] or A["Process Step"]
- Diamond nodes: B{Decision?} or B{"Is condition met?"}
- Start/End nodes: START([Start]) and END([End])
- Connections: A --> B or A -->|label| B
- Each node must have a unique ID (A, B, C, etc.)

IMPORTANT SYNTAX RULES:
- Use unique single-letter IDs for each node (A, B, C, D, etc.)
- Put text in square brackets [text] or quotes ["text"]
- No parentheses ((text)) in flowcharts - use ([text]) for rounded rectangles
- Each connection must be on its own line
- Use proper arrow syntax: --> or -->|label|

Generate ONLY the mermaid flowchart code starting with "flowchart TD"`

    case 'sequence':
      return `${basePrompt}

Show the interaction sequence between different actors/systems including:
${complexity === 'simple' ? '- Basic interactions only' : complexity === 'detailed' ? '- Detailed interactions with responses' : '- Comprehensive interactions with error handling, timeouts, and alternative flows'}

Use proper sequence diagram syntax with participants and messages.

Generate ONLY the mermaid sequence diagram code starting with "sequenceDiagram"`

    case 'class':
      return `${basePrompt}

Show the class structure including:
${complexity === 'simple' ? '- Basic classes and relationships' : complexity === 'detailed' ? '- Classes with methods and properties' : '- Comprehensive class hierarchy with detailed methods, properties, and relationships'}

Use proper class diagram syntax.

Generate ONLY the mermaid class diagram code starting with "classDiagram"`

    case 'state':
      return `${basePrompt}

Show the state transitions including:
${complexity === 'simple' ? '- Basic states and transitions' : complexity === 'detailed' ? '- States with triggers and actions' : '- Comprehensive state machine with guards, events, and nested states'}

Use proper state diagram syntax.

Generate ONLY the mermaid state diagram code starting with "stateDiagram-v2"`

    case 'mindmap':
      return `${basePrompt}

Create a mind map structure showing:
${complexity === 'simple' ? '- Main branches only' : complexity === 'detailed' ? '- Multiple levels of detail' : '- Comprehensive hierarchy with detailed sub-branches'}

Generate ONLY the mermaid mindmap code starting with "mindmap"`

    case 'timeline':
      return `${basePrompt}

Show the timeline of events including:
${complexity === 'simple' ? '- Key milestones only' : complexity === 'detailed' ? '- Detailed phases and events' : '- Comprehensive timeline with all phases, dependencies, and parallel activities'}

Generate ONLY the mermaid timeline code starting with "timeline"`

    default:
      return `${basePrompt}

Generate a mermaid flowchart showing the process flow with appropriate level of detail.

Generate ONLY the mermaid code starting with "flowchart TD"`
  }
}

function sanitizeMermaidCode(code: string): string {
  // Remove markdown code blocks if present
  let cleaned = code.replace(/```mermaid\n?/g, '').replace(/```\n?/g, '')
  
  // Remove any extra whitespace
  cleaned = cleaned.trim()
  
  // Fix common Mermaid syntax errors
  cleaned = cleaned
    // Fix invalid start/end node syntax ((text)) -> START([text])
    .replace(/\(\(([^)]+)\)\)/g, (match, text) => {
      if (text.toLowerCase().includes('start')) {
        return 'START(["Start"])'
      } else if (text.toLowerCase().includes('end')) {
        return 'END(["End"])'
      } else {
        return `NODE(["${text}"])`
      }
    })
    // Fix line breaks around arrows - put everything on one line
    .replace(/\n\s*-->/g, ' -->')
    .replace(/-->\s*\n/g, ' --> ')
    // Fix proper line breaks after complete connections
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0)
    .join('\n')
  
  // Ensure it starts with the correct diagram type
  if (!cleaned.match(/^(flowchart|sequenceDiagram|classDiagram|stateDiagram|mindmap|timeline)/)) {
    // If it doesn't start correctly, try to fix it
    if (cleaned.includes('flowchart')) {
      cleaned = 'flowchart TD\n' + cleaned.split('\n').slice(1).join('\n')
    }
  }
  
  return cleaned
}

function generateFallbackCode(concept: string, chartType: string, complexity: string): string {
  const safeConcept = concept.replace(/[^\w\s-]/g, '').trim().substring(0, 50)
  
  return `flowchart TD
    A["Start: ${safeConcept}"] --> B["Process"]
    B --> C["End"]`
}

export async function POST(req: NextRequest) {
  let concept = ''
  let chartType = 'flowchart'
  let complexity = 'simple'
  
  try {
    const body = await req.json()
    concept = body.concept || ''
    chartType = body.chartType || 'flowchart'
    complexity = body.complexity || 'simple'

    if (!concept) {
      return NextResponse.json(
        { error: 'Concept description is required' },
        { status: 400 }
      )
    }

    // Use AI to generate Mermaid code
    const mermaidCode = await generateMermaidWithAI(concept, chartType, complexity)
    
    return NextResponse.json({
      success: true,
      mermaidCode,
      chartType,
      concept
    })

  } catch (error) {
    console.error('Error generating flowchart:', error)
    
    // Fallback to template if AI fails
    const fallbackCode = generateFallbackCode(concept || 'process', chartType, complexity)
    return NextResponse.json({
      success: true,
      mermaidCode: fallbackCode,
      chartType,
      concept: concept || 'process',
      warning: 'AI generation failed, using template fallback'
    })
  }
}


