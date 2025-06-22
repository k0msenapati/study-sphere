import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export async function POST(request: NextRequest) {
  try {
    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'GROQ_API_KEY is not configured' },
        { status: 500 }
      )
    }

    const { flashcard, userQuestion, studyMaterial } = await request.json()

    if (!flashcard || !userQuestion) {
      return NextResponse.json(
        { error: 'Flashcard and question are required' },
        { status: 400 }
      )
    }

    const prompt = `You are an expert tutor helping a student understand a flashcard. 

Current Flashcard:
Question: ${flashcard.question}
Answer: ${flashcard.answer}
Topic: ${flashcard.topic}

Original Study Material Context:
${studyMaterial ? studyMaterial.substring(0, 1000) + '...' : 'Not available'}

Student's Question: ${userQuestion}

Please provide a helpful, educational explanation that:
1. Directly addresses the student's question
2. Relates to the flashcard content
3. Provides additional context or examples if helpful
4. Uses clear, easy-to-understand language
5. Encourages further learning

Keep your response concise but informative (2-3 paragraphs maximum).`

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a knowledgeable and patient tutor. Provide clear, helpful explanations that enhance student understanding."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 500
    })

    const explanation = completion.choices[0]?.message?.content
    if (!explanation) {
      throw new Error('No explanation generated')
    }

    return NextResponse.json({
      explanation: explanation.trim()
    })

  } catch (error) {
    console.error('Error generating explanation:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to generate explanation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
