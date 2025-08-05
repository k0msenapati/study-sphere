"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useCopilotAction } from "@copilotkit/react-core"
import { CopilotTextarea } from "@copilotkit/react-textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { 
  HiOutlineSparkles, 
  HiOutlineDocumentText, 
  HiOutlineCloudArrowDown,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineAcademicCap,
  HiOutlinePlay,
  HiOutlineCheckCircle,
  HiOutlineQuestionMarkCircle,
  HiOutlineListBullet,
  HiOutlineArrowLeft
} from "react-icons/hi2"
import { FaQuestionCircle } from "react-icons/fa"
import { MdAutoAwesome, MdArrowBack, MdArrowForward, MdQuiz } from "react-icons/md"
import { useQuizzesContext } from "@/lib/quizzes/quizzes-provider"
import { Quiz, Question } from "@/lib/quizzes/types"
import { useRouter } from "next/navigation"

type Step = 'input' | 'settings' | 'generate' | 'preview'

interface QuizGenerationRequest {
  studyMaterial: string
  numberOfQuestions: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  quizType: 'multiple-choice' | 'true-false' | 'mixed'
  subjectId: string
  topicId: string
}

interface QuizGeneratorProps {
  onQuizCreated: (quiz: Quiz) => void
}

export default function QuizGenerator({ onQuizCreated }: QuizGeneratorProps) {
  const { createQuiz, subjects, topics } = useQuizzesContext()
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>('input')
  const [studyMaterial, setStudyMaterial] = useState("")
  const [numberOfQuestions, setNumberOfQuestions] = useState("10")
  const [difficulty, setDifficulty] = useState<'beginner' | 'intermediate' | 'advanced'>("intermediate")
  const [quizType, setQuizType] = useState<'multiple-choice' | 'true-false' | 'mixed'>("multiple-choice")
  const [selectedSubject, setSelectedSubject] = useState<string>("")
  const [selectedTopic, setSelectedTopic] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedQuiz, setGeneratedQuiz] = useState<Quiz | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [aiGenerationStatus, setAiGenerationStatus] = useState("")

  // Auto-generate quiz title based on study material and settings
  const generateQuizTitle = (material: string, difficulty: string, questionCount: string): string => {
    // Extract key concepts from the material
    const words = material.toLowerCase().split(/\s+/)
    const meaningfulWords = words.filter(word => 
      word.length > 4 && 
      !['this', 'that', 'with', 'from', 'they', 'were', 'been', 'have', 'will', 'would', 'could', 'should'].includes(word)
    )
    
    let topic = 'Study Material'
    if (meaningfulWords.length > 0) {
      // Take the first few meaningful words as topic
      topic = meaningfulWords.slice(0, 2).map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    }
    
    const difficultyEmoji = difficulty === 'beginner' ? '🌱' : difficulty === 'intermediate' ? '🎯' : '🧠'
    return `${difficultyEmoji} ${topic} Quiz (${questionCount} Questions)`
  }

  const getStepProgress = () => {
    switch (currentStep) {
      case 'input': return 25
      case 'settings': return 50
      case 'generate': return 75
      case 'preview': return 100
      default: return 0
    }
  }

  const nextStep = () => {
    if (currentStep === 'input') setCurrentStep('settings')
    else if (currentStep === 'settings') setCurrentStep('generate')
  }

  const prevStep = () => {
    if (currentStep === 'settings') setCurrentStep('input')
    else if (currentStep === 'generate') setCurrentStep('settings')
    else if (currentStep === 'preview') setCurrentStep('generate')
  }

  const handleGenerateQuiz = async () => {
    if (!studyMaterial.trim()) {
      setError('Please enter study material')
      return
    }

    if (!selectedSubject || !selectedTopic) {
      setError('Please select a subject and topic')
      return
    }

    setIsGenerating(true)
    setError(null)
    
    try {
      setAiGenerationStatus("AI is creating your quiz questions...")
      
      // Generate unique ID
      const generateUniqueId = () => {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
      }

      // Auto-generate title and description
      const autoTitle = generateQuizTitle(studyMaterial, difficulty, numberOfQuestions)
      const autoDescription = `AI-generated ${difficulty} level quiz with ${numberOfQuestions} ${quizType} questions`

      // Create the quiz generation request
      const request: QuizGenerationRequest = {
        studyMaterial,
        numberOfQuestions: parseInt(numberOfQuestions),
        difficulty,
        quizType,
        subjectId: selectedSubject,
        topicId: selectedTopic
      }

      // Simulate AI generation (in a real app, this would call an API)
      const response = await fetch('/api/quizzes/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        throw new Error('Failed to generate quiz')
      }

      const data = await response.json()
      
      // Create quiz with generated questions
      const quiz: Quiz = {
        id: `quiz-${generateUniqueId()}`,
        userId: "1", // TODO: Get actual user ID
        subjectId: selectedSubject,
        topicId: selectedTopic,
        title: autoTitle,
        description: autoDescription,
        difficulty,
        questions: data.questions.map((q: any, index: number) => ({
          id: `q-${generateUniqueId()}-${index}`,
          question: q.question,
          options: q.options,
          correctOption: q.correctOption
        })),
        timeLimit: 300, // 5 minutes default
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      setGeneratedQuiz(quiz)
      setCurrentStep('preview')
      setAiGenerationStatus("✨ Quiz generated successfully!")
    } catch (error) {
      console.error('Failed to generate quiz:', error)
      setError('Failed to generate quiz. Please try again.')
      setAiGenerationStatus("❌ Failed to generate quiz. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSaveQuiz = () => {
    if (generatedQuiz) {
      createQuiz({
        userId: generatedQuiz.userId,
        subjectId: generatedQuiz.subjectId,
        topicId: generatedQuiz.topicId,
        title: generatedQuiz.title,
        description: generatedQuiz.description,
        difficulty: generatedQuiz.difficulty,
        questions: generatedQuiz.questions,
        timeLimit: generatedQuiz.timeLimit,
      })
      onQuizCreated(generatedQuiz)
    }
  }

  const getTopicsForSubject = (subjectId: string) => {
    return topics.filter(topic => topic.subjectId === subjectId)
  }

  const StepInput = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HiOutlineDocumentText className="h-6 w-6 text-blue-500" />
          Study Material
        </CardTitle>
        <CardDescription>
          Enter the study material you want to create a quiz from
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Study Material</label>
          <CopilotTextarea
            value={studyMaterial}
            onValueChange={(value) => setStudyMaterial(value)}
            placeholder="Paste your study material here... (e.g., notes, textbook content, articles)"
            className="min-h-[200px] resize-none"
            autosuggestionsConfig={{}}
          />
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-900/20 dark:border-blue-800">
          <p className="text-blue-700 dark:text-blue-300 font-medium text-sm">
            💡 The AI will analyze your study material and create relevant quiz questions based on the key concepts.
          </p>
        </div>
      </CardContent>
    </Card>
  )

  const StepSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HiOutlineAdjustmentsHorizontal className="h-6 w-6 text-purple-500" />
          Quiz Settings
        </CardTitle>
        <CardDescription>
          Configure your quiz settings and organization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Subject</label>
            <Select value={selectedSubject || "all"} onValueChange={(value) => setSelectedSubject(value === "all" ? "" : value)}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Select a subject</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    <span className="flex items-center gap-2">
                      <span>{subject.icon}</span>
                      {subject.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Topic</label>
            <Select value={selectedTopic || "all"} onValueChange={(value) => setSelectedTopic(value === "all" ? "" : value)} disabled={!selectedSubject}>
              <SelectTrigger className="h-12">
                <SelectValue placeholder={selectedSubject ? "Select a topic" : "Select subject first"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{selectedSubject ? "Select a topic" : "Select subject first"}</SelectItem>
                {selectedSubject && getTopicsForSubject(selectedSubject).map((topic) => (
                  <SelectItem key={topic.id} value={topic.id}>
                    {topic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Number of Questions</label>
            <Select value={numberOfQuestions} onValueChange={setNumberOfQuestions}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 Questions</SelectItem>
                <SelectItem value="10">10 Questions</SelectItem>
                <SelectItem value="15">15 Questions</SelectItem>
                <SelectItem value="20">20 Questions</SelectItem>
                <SelectItem value="25">25 Questions</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Difficulty Level</label>
            <Select value={difficulty} onValueChange={(value) => setDifficulty(value as 'beginner' | 'intermediate' | 'advanced')}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">🌱 Beginner</SelectItem>
                <SelectItem value="intermediate">🎯 Intermediate</SelectItem>
                <SelectItem value="advanced">🧠 Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Question Type</label>
            <Select value={quizType} onValueChange={(value) => setQuizType(value as 'multiple-choice' | 'true-false' | 'mixed')}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multiple-choice">🔤 Multiple Choice</SelectItem>
                <SelectItem value="true-false">✅ True/False</SelectItem>
                <SelectItem value="mixed">🎲 Mixed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 dark:bg-blue-900/20 dark:border-blue-800">
          <p className="text-blue-700 dark:text-blue-300 font-medium text-sm">
            🤖 Quiz title will be automatically generated based on your study material and settings
          </p>
        </div>
      </CardContent>
    </Card>
  )

  const StepGenerate = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-3 text-2xl">
          <HiOutlineSparkles className="text-purple-500" />
          Generate Quiz
        </CardTitle>
        <CardDescription className="text-lg">
          AI will create {numberOfQuestions} {difficulty} {quizType} questions
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-6">
        {!generatedQuiz ? (
          <>
            <div className="p-8">
              <FaQuestionCircle className="mx-auto text-6xl text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-6">Ready to generate your quiz with AI</p>
              {aiGenerationStatus && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 dark:bg-blue-900/20 dark:border-blue-800">
                  <p className="text-blue-700 dark:text-blue-300 font-medium">{aiGenerationStatus}</p>
                </div>
              )}
            </div>
            <Button 
              onClick={handleGenerateQuiz} 
              disabled={isGenerating}
              className="h-14 px-12 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isGenerating ? (
                <>
                  <MdAutoAwesome className="mr-3 h-6 w-6 animate-spin" />
                  AI is Creating Your Quiz...
                </>
              ) : (
                <>
                  <HiOutlineSparkles className="mr-3 h-6 w-6" />
                  Generate AI Quiz
                </>
              )}
            </Button>
            {!isGenerating && (
              <p className="text-sm text-muted-foreground mt-4">
                🤖 Powered by advanced AI • Creates intelligent questions with multiple choice answers
              </p>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <div className="text-green-500 text-6xl">
              <HiOutlineCheckCircle className="mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-green-700 dark:text-green-400">Quiz Generated!</h3>
            <p className="text-muted-foreground">
              Your quiz "{generatedQuiz.title}" with {generatedQuiz.questions.length} questions is ready to preview
            </p>
            <Button 
              onClick={nextStep}
              className="h-12 px-8 bg-green-600 hover:bg-green-700"
            >
              <HiOutlinePlay className="mr-2 h-5 w-5" />
              Preview Quiz
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )

  const StepPreview = () => (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl">
            <MdQuiz className="text-green-500" />
            Quiz Preview
          </CardTitle>
          <CardDescription className="text-lg">
            Review your generated quiz before saving
          </CardDescription>
        </CardHeader>
        <CardContent>
          {generatedQuiz && (
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold">{generatedQuiz.title}</h2>
                {generatedQuiz.description && (
                  <p className="text-muted-foreground">{generatedQuiz.description}</p>
                )}
                <Badge variant="outline" className="text-sm">
                  {generatedQuiz.questions.length} questions • {difficulty} difficulty
                </Badge>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {generatedQuiz.questions.map((question, index) => (
                  <Card key={question.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="space-y-3">
                        <h3 className="font-semibold text-lg">
                          {index + 1}. {question.question}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {question.options.map((option, optionIndex) => (
                            <div 
                              key={optionIndex}
                              className={`p-3 rounded-lg border ${
                                option === question.correctOption
                                  ? 'bg-green-50 border-green-300 text-green-800 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300'
                                  : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                              }`}
                            >
                              {String.fromCharCode(65 + optionIndex)}. {option}
                              {option === question.correctOption && (
                                <span className="ml-2 text-green-600 dark:text-green-400">✓</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-center gap-4 pt-4 border-t">
                <Button variant="outline" onClick={prevStep}>
                  <MdArrowBack className="mr-2 h-4 w-4" />
                  Back to Generate
                </Button>
                <Button onClick={handleSaveQuiz} className="bg-green-600 hover:bg-green-700">
                  <HiOutlineCheckCircle className="mr-2 h-5 w-5" />
                  Save Quiz
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-gray-50 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Button 
              variant="ghost" 
              onClick={() => router.push('/dashboard/quizzes')}
              className="absolute left-0"
            >
              <HiOutlineArrowLeft className="h-5 w-5 mr-2" />
              Back to Quizzes
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">
                AI Quiz Generator
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Transform your study material into interactive quizzes powered by AI
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Progress</span>
            <span className="text-sm text-muted-foreground">{getStepProgress()}%</span>
          </div>
          <Progress value={getStepProgress()} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 'input' && <StepInput />}
              {currentStep === 'settings' && <StepSettings />}
              {currentStep === 'generate' && <StepGenerate />}
              {currentStep === 'preview' && <StepPreview />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        {currentStep !== 'preview' && (
          <div className="flex justify-center gap-4">
            {currentStep !== 'input' && (
              <Button variant="outline" onClick={prevStep}>
                <MdArrowBack className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            {(currentStep === 'input' || currentStep === 'settings') && (
              <Button 
                onClick={nextStep}
                disabled={
                  (currentStep === 'input' && !studyMaterial.trim())
                }
              >
                {currentStep === 'settings' ? 'Generate' : 'Next'}
                <MdArrowForward className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
              <p className="font-medium">Error generating quiz:</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
