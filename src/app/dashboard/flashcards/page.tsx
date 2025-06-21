"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core"
import { CopilotTextarea } from "@copilotkit/react-textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { useFlashcardsOperations } from "@/lib/flashcards/use-flashcards"
import { FlashcardGenerationRequest } from "@/lib/flashcards/types"
import Flashcard from "@/components/ui/flashcard"
import { 
  HiOutlineSparkles, 
  HiOutlineDocumentText, 
  HiOutlineCloudArrowDown,
  HiOutlineAdjustmentsHorizontal,
  HiOutlineAcademicCap,
  HiOutlinePlay,
  HiOutlineCheckCircle
} from "react-icons/hi2"
import { FaFlipboard } from "react-icons/fa6"
import { MdAutoAwesome, MdArrowBack, MdArrowForward } from "react-icons/md"

type Step = 'input' | 'settings' | 'generate' | 'study'

const FlashcardsPage = () => {
  const [currentStep, setCurrentStep] = useState<Step>('input')
  const [studyMaterial, setStudyMaterial] = useState("")
  const [numberOfCards, setNumberOfCards] = useState("10")
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>("medium")
  const [focusArea, setFocusArea] = useState<'general' | 'definitions' | 'concepts' | 'problem-solving'>("general")
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [reviewResults, setReviewResults] = useState<{ [key: string]: 'correct' | 'incorrect' | 'partial' }>({})
  const [aiGenerationStatus, setAiGenerationStatus] = useState<string>("")

  const { 
    currentSet, 
    isGenerating, 
    error, 
    generateFlashcards, 
    updateFlashcardStats, 
    exportFlashcards 
  } = useFlashcardsOperations()

  const generatedFlashcards = currentSet?.flashcards || []

  // Step navigation
  const nextStep = () => {
    switch (currentStep) {
      case 'input':
        if (studyMaterial.trim()) setCurrentStep('settings')
        break
      case 'settings':
        setCurrentStep('generate')
        break
      case 'generate':
        if (generatedFlashcards.length > 0) setCurrentStep('study')
        break
    }
  }

  const prevStep = () => {
    switch (currentStep) {
      case 'settings':
        setCurrentStep('input')
        break
      case 'generate':
        setCurrentStep('settings')
        break
      case 'study':
        setCurrentStep('generate')
        break
    }
  }

  const getStepProgress = () => {
    switch (currentStep) {
      case 'input': return 25
      case 'settings': return 50
      case 'generate': return 75
      case 'study': return 100
      default: return 0
    }
  }
  // Make flashcards data readable to Copilot
  useCopilotReadable({
    description: "Current flashcards and study material",
    value: {
      studyMaterial,
      generatedFlashcards,
      numberOfCards,
      difficulty,
      focusArea
    }
  })
  // Copilot action for generating flashcards
  useCopilotAction({
    name: "generateFlashcards",
    description: "Generate flashcards from study material using AI. This will analyze the provided study material and create educational flashcards with questions and answers.",
    parameters: [
      {
        name: "material",
        type: "string",
        description: "The study material to create flashcards from",
        required: true
      },
      {
        name: "count",
        type: "number",
        description: "Number of flashcards to generate (5-25)",
        required: false
      },
      {
        name: "difficultyLevel",
        type: "string",
        description: "Difficulty level: easy, medium, or hard",
        required: false
      },
      {
        name: "focus",
        type: "string",
        description: "Focus area: definitions, concepts, problem-solving, or general",
        required: false
      }
    ],
    handler: async ({ material, count = 10, difficultyLevel = "medium", focus = "general" }) => {
      try {
        // Update the current form values
        setStudyMaterial(material)
        setNumberOfCards(count.toString())
        setDifficulty(difficultyLevel as 'easy' | 'medium' | 'hard')
        setFocusArea(focus as 'general' | 'definitions' | 'concepts' | 'problem-solving')
        
        const request: FlashcardGenerationRequest = {
          studyMaterial: material,
          numberOfCards: count,
          difficulty: difficultyLevel as 'easy' | 'medium' | 'hard',
          focusArea: focus as 'general' | 'definitions' | 'concepts' | 'problem-solving'
        }
        
        await generateFlashcards(request)
        setCurrentCardIndex(0)
        setCurrentStep('study')
        
        return `Successfully generated ${count} ${difficultyLevel} difficulty flashcards focused on ${focus} from your study material! You can now start studying.`
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate flashcards'
        return `Error: ${errorMessage}. Please try again or check your study material.`
      }
    }  })

  // Copilot action for study assistance
  useCopilotAction({
    name: "explainFlashcard",
    description: "Get detailed explanation about a flashcard answer or ask questions about the content",
    parameters: [
      {
        name: "question",
        type: "string",
        description: "Question about the current flashcard or request for explanation",
        required: true
      }
    ],
    handler: async ({ question }) => {
      const currentCard = generatedFlashcards[currentCardIndex]
      if (!currentCard) {
        return "No flashcard is currently selected. Please select a flashcard first."
      }
      
      try {
        const response = await fetch('/api/copilotkit/explain-flashcard', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            flashcard: currentCard,
            userQuestion: question,
            studyMaterial: studyMaterial
          })
        })
        
        if (!response.ok) {
          throw new Error('Failed to get explanation')
        }
        
        const data = await response.json()
        return data.explanation
      } catch (error) {
        return "I'm having trouble providing an explanation right now. Please try again later."
      }
    }
  })
  const handleGenerateFlashcards = async () => {
    if (!studyMaterial.trim()) {
      alert("Please enter some study material first!")
      return
    }
    
    setAiGenerationStatus("Analyzing your study material...")
    
    const request: FlashcardGenerationRequest = {
      studyMaterial,
      numberOfCards: parseInt(numberOfCards),
      difficulty,
      focusArea
    }
    
    try {
      setAiGenerationStatus("AI is creating your flashcards...")
      await generateFlashcards(request)
      setCurrentCardIndex(0)
      setCurrentStep('study')
      setAiGenerationStatus("✨ Flashcards generated successfully!")
    } catch (error) {
      console.error('Failed to generate flashcards:', error)
      setAiGenerationStatus("❌ Failed to generate flashcards. Please try again.")
    }
  }

  const nextCard = () => {
    if (currentCardIndex < generatedFlashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
    }
  }

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
    }
  }

  const markAnswer = (result: 'correct' | 'incorrect' | 'partial') => {
    const cardId = generatedFlashcards[currentCardIndex]?.id
    if (cardId) {
      setReviewResults(prev => ({ ...prev, [cardId]: result }))
      updateFlashcardStats(cardId, result === 'correct' ? 'correct' : 'incorrect')
    }
    nextCard()
  }

  const handleExportFlashcards = () => {
    if (currentSet) {
      exportFlashcards(currentSet, 'json')
    }
  }

  const handleDifficultyChange = (value: string) => {
    setDifficulty(value as 'easy' | 'medium' | 'hard')
  }

  const handleFocusAreaChange = (value: string) => {
    setFocusArea(value as 'general' | 'definitions' | 'concepts' | 'problem-solving')
  }
  const currentCard = generatedFlashcards[currentCardIndex]

  // Step components
  const StepInput = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-3 text-2xl">
          <HiOutlineDocumentText className="text-blue-500" />
          Enter Study Material
        </CardTitle>        <CardDescription className="text-lg">
          Paste your notes, textbook content, or any study material below. Our AI will analyze and create intelligent flashcards.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <CopilotTextarea
          className="min-h-[300px] text-lg resize-none border-2 border-gray-200 focus:border-purple-400 focus:ring-purple-400 rounded-lg"          placeholder="📚 Paste your study material here...

Example:
• Chapter notes on photosynthesis
• Mathematical formulas and definitions  
• Historical events and dates
• Programming concepts

🤖 Our AI will analyze your content and create intelligent, targeted flashcards with:
✨ Smart questions that test understanding
✨ Comprehensive answers that aid learning
✨ Adaptive difficulty based on your settings"
          value={studyMaterial}
          onValueChange={setStudyMaterial}
          autosuggestionsConfig={{
            textareaPurpose: "Study material for flashcard generation",
            chatApiConfigs: {
              suggestionsApiConfig: {
                maxTokens: 20,
                stop: [".", "!", "?", ";", ":"],
              },
            },
          }}
        />
        
        {studyMaterial.trim() && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4"
          >
            <div className="flex items-center gap-2 text-green-700">
              <HiOutlineAcademicCap className="text-xl" />
              <span className="font-medium">Ready for next step!</span>
            </div>
            <p className="text-green-600 mt-1">
              {studyMaterial.length} characters • Estimated {Math.ceil(studyMaterial.length / 100)} concepts detected
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )

  const StepSettings = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-3 text-2xl">
          <HiOutlineAdjustmentsHorizontal className="text-purple-500" />
          Configure Settings
        </CardTitle>
        <CardDescription className="text-lg">
          Customize your flashcard generation preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Number of Cards</label>
            <Select value={numberOfCards} onValueChange={setNumberOfCards}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 cards</SelectItem>
                <SelectItem value="10">10 cards</SelectItem>
                <SelectItem value="15">15 cards</SelectItem>
                <SelectItem value="20">20 cards</SelectItem>
                <SelectItem value="25">25 cards</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Difficulty Level</label>
            <Select value={difficulty} onValueChange={handleDifficultyChange}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">📚 Easy</SelectItem>
                <SelectItem value="medium">🎯 Medium</SelectItem>
                <SelectItem value="hard">🧠 Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Focus Area</label>
            <Select value={focusArea} onValueChange={handleFocusAreaChange}>
              <SelectTrigger className="h-12">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">🔍 General</SelectItem>
                <SelectItem value="definitions">📖 Definitions</SelectItem>
                <SelectItem value="concepts">💡 Concepts</SelectItem>
                <SelectItem value="problem-solving">🧩 Problem Solving</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const StepGenerate = () => (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="flex items-center justify-center gap-3 text-2xl">
          <HiOutlineSparkles className="text-purple-500" />
          Generate Flashcards
        </CardTitle>
        <CardDescription className="text-lg">
          AI will create {numberOfCards} {difficulty} flashcards focused on {focusArea}
        </CardDescription>
      </CardHeader>      <CardContent className="text-center space-y-6">
        {generatedFlashcards.length === 0 ? (
          <>
            <div className="p-8">
              <FaFlipboard className="mx-auto text-6xl text-gray-300 mb-4" />
              <p className="text-gray-600 mb-6">Ready to generate your flashcards with AI</p>
              {aiGenerationStatus && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-blue-700 font-medium">{aiGenerationStatus}</p>
                </div>
              )}
            </div>
            <Button 
              onClick={handleGenerateFlashcards} 
              disabled={isGenerating}
              className="h-14 px-12 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              {isGenerating ? (
                <>
                  <MdAutoAwesome className="mr-3 h-6 w-6 animate-spin" />
                  AI is Creating Your Flashcards...
                </>
              ) : (
                <>
                  <HiOutlineSparkles className="mr-3 h-6 w-6" />
                  Generate AI Flashcards
                </>
              )}
            </Button>
            {!isGenerating && (
              <p className="text-sm text-gray-500 mt-4">
                🤖 Powered by advanced AI • Creates intelligent questions and detailed answers
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
            <h3 className="text-2xl font-bold text-green-700">Flashcards Generated!</h3>
            <p className="text-gray-600">
              Successfully created {generatedFlashcards.length} flashcards
            </p>
            <Button 
              onClick={() => setCurrentStep('study')}
              className="h-12 px-8 bg-green-500 hover:bg-green-600"
            >
              <HiOutlinePlay className="mr-2 h-5 w-5" />
              Start Studying
            </Button>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )

  const StepStudy = () => (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-3 text-2xl">
            <FaFlipboard className="text-green-500" />
            Study Session
          </CardTitle>
          <CardDescription className="text-lg">
            Card {currentCardIndex + 1} of {generatedFlashcards.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentCard && (
            <div className="space-y-6">
              <Flashcard
                flashcard={currentCard}
                onAnswerResult={markAnswer}
                size="lg"
              />
              
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  onClick={prevCard} 
                  disabled={currentCardIndex === 0}
                  className="flex items-center gap-2"
                >
                  <MdArrowBack className="h-4 w-4" />
                  Previous
                </Button>
                
                <Progress value={(currentCardIndex + 1) / generatedFlashcards.length * 100} className="flex-1 mx-4" />
                
                <Button 
                  variant="outline" 
                  onClick={nextCard} 
                  disabled={currentCardIndex === generatedFlashcards.length - 1}
                  className="flex items-center gap-2"
                >
                  Next
                  <MdArrowForward className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  onClick={handleExportFlashcards}
                  className="flex items-center gap-2"
                >
                  <HiOutlineCloudArrowDown className="h-4 w-4" />
                  Export Flashcards
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            AI Flashcards Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your study material into interactive flashcards powered by AI
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{getStepProgress()}%</span>
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
              {currentStep === 'study' && <StepStudy />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        {currentStep !== 'study' && (
          <div className="flex justify-center gap-4">
            {currentStep !== 'input' && (
              <Button variant="outline" onClick={prevStep}>
                <MdArrowBack className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}            {(currentStep === 'input' || currentStep === 'settings') && (
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
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              <p className="font-medium">Error generating flashcards:</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default FlashcardsPage
