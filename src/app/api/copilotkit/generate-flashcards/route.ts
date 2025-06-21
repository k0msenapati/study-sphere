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

    const { studyMaterial, numberOfCards, difficulty, focusArea } = await request.json()

    if (!studyMaterial?.trim()) {
      return NextResponse.json(
        { error: 'Study material is required' },
        { status: 400 }
      )
    }

    // Create a prompt for flashcard generation
    const prompt = `You are an expert educational content creator. Create ${numberOfCards} high-quality flashcards based on the following study material. 

Study Material:
${studyMaterial}

Requirements:
- Difficulty level: ${difficulty}
- Focus area: ${focusArea}
- Generate exactly ${numberOfCards} flashcards
- Each flashcard should have a clear, concise question and a comprehensive answer
- Questions should test understanding, not just memorization
- Answers should be educational and help with learning
- For ${focusArea === 'definitions' ? 'focus on key terms and their meanings' : focusArea === 'concepts' ? 'focus on understanding core concepts' : focusArea === 'problem-solving' ? 'focus on application and problem-solving scenarios' : 'cover a broad range of topics from the material'}

Return your response as a JSON object with the following structure:
{
  "flashcards": [
    {
      "question": "Clear, specific question",
      "answer": "Comprehensive, educational answer",
      "topic": "Main topic/category",
      "tags": ["relevant", "tags"]
    }
  ]
}

Make sure the JSON is valid and contains exactly ${numberOfCards} flashcards.`

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert educational content creator specializing in creating effective flashcards for learning. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" }
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from AI')
    }

    let flashcardsData
    try {
      flashcardsData = JSON.parse(content)
    } catch (parseError) {
      console.error('Failed to parse AI response:', content)
      throw new Error('Invalid response format from AI')
    }

    // Validate the response structure
    if (!flashcardsData.flashcards || !Array.isArray(flashcardsData.flashcards)) {
      throw new Error('Invalid flashcards format in AI response')
    }

    // Ensure we have the right number of flashcards
    if (flashcardsData.flashcards.length === 0) {
      throw new Error('No flashcards generated')
    }

    // Validate each flashcard has required fields
    const validatedFlashcards = flashcardsData.flashcards.map((card: any, index: number) => {
      if (!card.question || !card.answer) {
        throw new Error(`Flashcard ${index + 1} is missing question or answer`)
      }
      
      return {
        question: card.question.trim(),
        answer: card.answer.trim(),
        topic: card.topic || focusArea,
        tags: Array.isArray(card.tags) ? card.tags : []
      }
    })

    return NextResponse.json({
      flashcards: validatedFlashcards,
      metadata: {
        difficulty,
        focusArea,
        numberOfCards: validatedFlashcards.length,
        generatedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error generating flashcards:', error)
    
    // Handle specific Groq API errors
    if (error instanceof Error && error.message.includes('model')) {
      return NextResponse.json(
        { 
          error: 'AI model temporarily unavailable',
          details: 'The AI service is currently updating. Please try again in a moment.'
        },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to generate flashcards',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    )
  }
}
