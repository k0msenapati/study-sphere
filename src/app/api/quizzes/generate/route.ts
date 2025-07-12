import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

interface QuizGenerationRequest {
  studyMaterial: string
  numberOfQuestions: number
  difficulty: 'easy' | 'medium' | 'hard'
  quizType: 'multiple-choice' | 'true-false' | 'mixed'
}

interface Question {
  question: string
  options: string[]
  correctOption: string
}

const groqApiKey = process.env.GROQ_API_KEY
const groq = groqApiKey ? new Groq({ apiKey: groqApiKey }) : undefined

export async function POST(request: NextRequest) {
  try {
    const body: QuizGenerationRequest = await request.json()
    
    const { studyMaterial, numberOfQuestions, difficulty, quizType } = body

    if (!studyMaterial) {
      return NextResponse.json(
        { error: 'Study material is required' },
        { status: 400 }
      )
    }

    let questions: Question[]

    if (groq) {
      // Use AI to generate questions
      questions = await generateAIQuestions(body)
    } else {
      // Fallback to sample questions
      questions = generateSampleQuestions(studyMaterial, numberOfQuestions, difficulty, quizType)
    }

    return NextResponse.json({
      success: true,
      questions,
      metadata: {
        difficulty,
        quizType,
        numberOfQuestions: questions.length
      }
    })

  } catch (error) {
    console.error('Error generating quiz:', error)
    return NextResponse.json(
      { error: 'Failed to generate quiz' },
      { status: 500 }
    )
  }
}

async function generateAIQuestions(request: QuizGenerationRequest): Promise<Question[]> {
  if (!groq) {
    throw new Error('AI service not available')
  }

  const { studyMaterial, numberOfQuestions, difficulty, quizType } = request

  const prompt = `Based on the following study material, create ${numberOfQuestions} ${difficulty} level quiz questions of type ${quizType}.

Study Material:
${studyMaterial}

Requirements:
- Create exactly ${numberOfQuestions} questions
- Difficulty level: ${difficulty}
- Question type: ${quizType}
- For multiple choice questions: provide 4 options (A, B, C, D)
- For true/false questions: provide 2 options (True, False)
- For mixed type: use a combination of multiple choice and true/false

Format your response as a JSON array with this structure:
[
  {
    "question": "Question text here",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctOption": "Option 1"
  }
]

Make sure the questions test understanding of the key concepts in the study material.`

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert educator who creates high-quality quiz questions. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "gemma2-9b-it",
      temperature: 0.7,
      max_tokens: 2000,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from AI')
    }

    // Parse the JSON response
    const questions = JSON.parse(content)
    
    // Validate the structure
    if (!Array.isArray(questions)) {
      throw new Error('Invalid response format')
    }

    return questions.map((q: any) => ({
      question: q.question,
      options: q.options,
      correctOption: q.correctOption
    }))

  } catch (error) {
    console.error('AI generation failed:', error)
    // Fallback to sample questions if AI fails
    return generateSampleQuestions(request.studyMaterial, numberOfQuestions, difficulty, quizType)
  }
}

function generateSampleQuestions(
  studyMaterial: string,
  numberOfQuestions: number,
  difficulty: string,
  quizType: string
): Question[] {
  // This is a placeholder implementation
  // In a real app, this would use AI to analyze the study material and generate questions
  
  const sampleQuestions: Question[] = []
  
  // Extract some key concepts from the study material for more relevant questions
  const words = studyMaterial.toLowerCase().split(/\s+/)
  const keyTerms = words.filter(word => word.length > 5).slice(0, 10)
  
  for (let i = 0; i < numberOfQuestions; i++) {
    if (quizType === 'true-false' || (quizType === 'mixed' && i % 3 === 0)) {
      // Generate True/False question
      const statement = keyTerms.length > 0 
        ? `The concept of "${keyTerms[i % keyTerms.length]}" is fundamental to this topic.`
        : `This is a true/false question based on your study material.`
      
      sampleQuestions.push({
        question: statement,
        options: ['True', 'False'],
        correctOption: Math.random() > 0.5 ? 'True' : 'False'
      })
    } else {
      // Generate Multiple Choice question
      const questionTemplates = [
        `What is the main concept related to ${keyTerms[i % keyTerms.length] || 'the topic'}?`,
        `Which of the following best describes ${keyTerms[(i + 1) % keyTerms.length] || 'the main idea'}?`,
        `According to the study material, what is important about ${keyTerms[(i + 2) % keyTerms.length] || 'this subject'}?`,
        `What can be concluded about ${keyTerms[(i + 3) % keyTerms.length] || 'the topic'} from the given information?`
      ]
      
      const question = questionTemplates[i % questionTemplates.length]
      
      const options = [
        'This is the correct answer based on your study material',
        'This is an incorrect but plausible option',
        'This is another incorrect option',
        'This is the fourth option for multiple choice'
      ]
      
      // Shuffle options to randomize correct answer position
      const shuffledOptions = [...options].sort(() => Math.random() - 0.5)
      const correctOption = shuffledOptions[0]
      
      sampleQuestions.push({
        question,
        options: shuffledOptions,
        correctOption
      })
    }
  }
  
  return sampleQuestions
}
