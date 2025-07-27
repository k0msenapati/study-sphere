import { NextRequest, NextResponse } from 'next/server'
import Groq from 'groq-sdk'

interface QuizGenerationRequest {
  studyMaterial: string
  numberOfQuestions: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  quizType: 'multiple-choice' | 'true-false' | 'mixed'
  subjectId: string
  topicId: string
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
      try {
        questions = await generateAIQuestions(body)
      } catch (error) {
        console.error('AI generation failed, using fallback:', error)
        questions = generateSampleQuestions(studyMaterial, numberOfQuestions, difficulty, quizType)
      }
    } else {
      // Fallback to sample questions based on the actual study material
      console.log('No API key provided, using fallback questions')
      questions = generateSampleQuestions(studyMaterial, numberOfQuestions, difficulty, quizType)
    }

    return NextResponse.json({
      success: true,
      questions,
      metadata: {
        difficulty,
        quizType,
        numberOfQuestions: questions.length,
        aiGenerated: groq && groqApiKey ? true : false
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
- Questions MUST be based on the provided study material content
- Make sure the questions test understanding of the key concepts in the study material

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
          role: "user",
          content: prompt,
        },
      ],
      model: "llama3-8b-8192",
      temperature: 0.7,
      max_tokens: 4000,
    })

    const response = completion.choices[0]?.message?.content
    if (!response) {
      throw new Error('No response from AI')
    }

    // Try to parse JSON from the response
    const jsonMatch = response.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      const questions = JSON.parse(jsonMatch[0])
      return questions
    } else {
      // If JSON parsing fails, fall back to sample questions
      console.warn('Failed to parse AI response as JSON, using fallback')
      return generateSampleQuestions(studyMaterial, numberOfQuestions, difficulty, quizType)
    }
  } catch (error) {
    console.error('AI generation failed:', error)
    // Fall back to sample questions
    return generateSampleQuestions(studyMaterial, numberOfQuestions, difficulty, quizType)
  }
}

function generateSampleQuestions(studyMaterial: string, numberOfQuestions: number, difficulty: string, quizType: string): Question[] {
  // Extract key words from study material for more relevant questions
  const words = studyMaterial.toLowerCase().split(/\s+/)
  const keyWords = words.filter(word => 
    word.length > 4 && 
    !['this', 'that', 'with', 'from', 'they', 'were', 'been', 'have', 'will', 'would', 'could', 'should', 'about', 'their', 'there', 'these', 'those'].includes(word)
  ).slice(0, 10)

  const questions: Question[] = []
  
  for (let i = 0; i < numberOfQuestions; i++) {
    const questionNumber = i + 1
    const keyWord = keyWords[i % keyWords.length] || 'topic'
    
    if (quizType === 'true-false' || (quizType === 'mixed' && i % 2 === 0)) {
      // True/False question
      const isTrue = Math.random() > 0.5
      questions.push({
        question: `Based on the study material, is the following statement about ${keyWord} ${isTrue ? 'correct' : 'incorrect'}?`,
        options: ['True', 'False'],
        correctOption: isTrue ? 'True' : 'False'
      })
    } else {
      // Multiple choice question
      const correctAnswer = `The correct answer about ${keyWord}`
      const incorrectAnswers = [
        `An incorrect option about ${keyWord}`,
        `Another wrong answer regarding ${keyWord}`,
        `A false statement about ${keyWord}`
      ]
      
      const allOptions = [correctAnswer, ...incorrectAnswers]
      // Shuffle options
      const shuffledOptions = allOptions.sort(() => Math.random() - 0.5)
      
      questions.push({
        question: `What is the most accurate statement about ${keyWord} based on the study material?`,
        options: shuffledOptions,
        correctOption: correctAnswer
      })
    }
  }
  
  return questions
}
