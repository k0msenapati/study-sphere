"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import Flashcard from "@/components/ui/flashcard"
import { 
  HiOutlineArrowLeft,
  HiOutlinePlay,
  HiOutlinePause,
  HiOutlineCheckCircle,
  HiOutlineSpeakerWave,
  HiOutlineSpeakerXMark,
  HiOutlineArrowPath
} from "react-icons/hi2"
import { FaFlipboard } from "react-icons/fa6"
import { MdArrowBack, MdArrowForward } from "react-icons/md"

interface Deck {
  id: string
  title: string
  description: string | null
  color: string
  isPublic: boolean
  tags: string
  studyMaterial: string | null
  totalCards: number
  lastStudied: string | null
  createdAt: string
  updatedAt: string
}

interface Flashcard {
  id: string
  deckId: string
  question: string
  answer: string
  difficulty: 'easy' | 'medium' | 'hard'
  topic: string
  hints: string
  explanation: string | null
  tags: string
  correctCount: number
  incorrectCount: number
  lastReviewed: string | null
  nextReview: string | null
  order: number
  createdAt: string
}

// Enhanced Flashcard Component with Audio
const FlashcardWithAudio = ({ flashcard, onAnswerResult, size = "md" }: {
  flashcard: Flashcard
  onAnswerResult: (result: 'correct' | 'incorrect' | 'partial') => void
  size?: "sm" | "md" | "lg"
}) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null)
  const [audioEnabled, setAudioEnabled] = useState(true)

  const speakText = (text: string) => {
    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in your browser')
      return
    }

    // Stop any current speech
    if (currentUtterance) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
    }

    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(text)
    
    // Configure speech settings
    utterance.rate = 0.8
    utterance.pitch = 1
    utterance.volume = 1

    // Set up event handlers
    utterance.onstart = () => {
      setIsPlaying(true)
    }
    
    utterance.onend = () => {
      setIsPlaying(false)
      setCurrentUtterance(null)
    }
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event.error)
      setIsPlaying(false)
      setCurrentUtterance(null)
    }

    // Start speaking
    setCurrentUtterance(utterance)
    window.speechSynthesis.speak(utterance)
  }

  const stopSpeaking = () => {
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      setCurrentUtterance(null)
    }
  }

  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled)
    if (!audioEnabled) {
      stopSpeaking()
    }
  }

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
    if (!isFlipped && audioEnabled && flashcard.answer) {
      setTimeout(() => speakText(flashcard.answer), 300) 
    }
  }

  const handleAnswerResult = (result: 'correct' | 'incorrect' | 'partial') => {
    stopSpeaking() 
    onAnswerResult(result)
  }

  const sizeClasses = {
    sm: "h-48",
    md: "h-64",
    lg: "h-80"
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Audio Controls */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAudio}
            className={`flex items-center gap-2 border-2 ${
              audioEnabled 
                ? 'text-green-600 dark:text-green-400 border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-950/50' 
                : 'text-muted-foreground border-gray-300 dark:border-gray-600'
            }`}
          >
            {audioEnabled ? (
              <>
                <HiOutlineSpeakerWave className="h-4 w-4" />
                Audio On
              </>
            ) : (
              <>
                <HiOutlineSpeakerXMark className="h-4 w-4" />
                Audio Off
              </>
            )}
          </Button>
          
          {audioEnabled && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => speakText(isFlipped ? flashcard.answer : flashcard.question)}
              disabled={isPlaying}
              className="flex items-center gap-2 border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400"
            >
              {isPlaying ? (
                <>
                  <HiOutlinePause className="h-4 w-4" />
                  Playing...
                </>
              ) : (
                <>
                  <HiOutlinePlay className="h-4 w-4" />
                  Listen
                </>
              )}
            </Button>
          )}
          
          {isPlaying && (
            <Button
              variant="outline"
              size="sm"
              onClick={stopSpeaking}
              className="flex items-center gap-2 text-red-600 dark:text-red-400 border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-950/50"
            >
              <HiOutlinePause className="h-4 w-4" />
              Stop
            </Button>
          )}
        </div>
        
        <Badge variant="secondary" className="text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
          {isFlipped ? 'Answer' : 'Question'}
        </Badge>
      </div>

      {/* Flashcard */}
      <div className="perspective-1000">
        <motion.div
          className={`relative ${sizeClasses[size]} cursor-pointer`}
          onClick={handleFlip}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <motion.div
            className="absolute inset-0 w-full h-full"
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6, type: "spring" }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Front (Question) */}
            <Card className="absolute inset-0 w-full h-full bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-gray-800 dark:via-blue-950/80 dark:to-blue-900/60 border-2 border-blue-200 dark:border-blue-700 shadow-lg"
                  style={{ backfaceVisibility: "hidden" }}>
              <CardContent className="flex flex-col justify-center items-center h-full p-8 text-center">
                <div className="mb-4">
                  <Badge variant="outline" className="mb-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 border-blue-300 dark:border-blue-600">Question</Badge>
                </div>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100 leading-relaxed">
                  {flashcard.question}
                </p>
                <div className="mt-6 text-sm text-gray-600 dark:text-gray-400">
                  Click to reveal answer
                </div>
              </CardContent>
            </Card>

            {/* Back (Answer) */}
            <Card className="absolute inset-0 w-full h-full bg-gradient-to-br from-white via-green-50 to-green-100 dark:from-gray-800 dark:via-green-950/80 dark:to-green-900/60 border-2 border-green-200 dark:border-green-700 shadow-lg" 
                  style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
              <CardContent className="flex flex-col justify-center items-center h-full p-8 text-center">
                <div className="mb-4">
                  <Badge variant="outline" className="mb-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 border-green-300 dark:border-green-600">Answer</Badge>
                </div>
                <p className="text-lg text-gray-900 dark:text-gray-100 leading-relaxed mb-6">
                  {flashcard.answer}
                </p>
                
                <div className="flex gap-3 mt-4">
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAnswerResult('incorrect')
                    }}
                    variant="outline"
                    className="border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                  >
                    ❌ Incorrect
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAnswerResult('partial')
                    }}
                    variant="outline"
                    className="border-yellow-300 dark:border-yellow-700 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-950"
                  >
                    ⚡ Partial
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAnswerResult('correct')
                    }}
                    variant="outline"
                    className="border-green-300 dark:border-green-700 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950"
                  >
                    ✅ Correct
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Audio Status */}
      {isPlaying && (
        <div className="mt-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/80 border border-blue-200 dark:border-blue-700 rounded-full px-4 py-2 text-sm text-blue-700 dark:text-blue-200 shadow-md"
          >
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span>Playing audio...</span>
          </motion.div>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
        💡 Tip: Audio will automatically play when you reveal the answer
      </div>
    </div>
  )
}

const StudyDeckPage = () => {
  const params = useParams()
  const router = useRouter()
  const [deck, setDeck] = useState<Deck | null>(null)
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [studyResults, setStudyResults] = useState<{ [key: string]: 'correct' | 'incorrect' | 'partial' }>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchDeckAndFlashcards()
    }
  }, [params.id])

  const fetchDeckAndFlashcards = async () => {
    try {
      setLoading(true)
      
      // Fetch deck details
      const deckResponse = await fetch(`/api/decks/${params.id}`)
      if (!deckResponse.ok) {
        throw new Error('Failed to fetch deck')
      }
      const deckData = await deckResponse.json()
      setDeck(deckData)

      // Fetch flashcards
      const flashcardsResponse = await fetch(`/api/decks/${params.id}/flashcards`)
      if (!flashcardsResponse.ok) {
        throw new Error('Failed to fetch flashcards')
      }
      const flashcardsData = await flashcardsResponse.json()
      setFlashcards(flashcardsData)

    } catch (err) {
      console.error('Error fetching data:', err)
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerResult = async (result: 'correct' | 'incorrect' | 'partial') => {
    const currentCard = flashcards[currentCardIndex]
    if (!currentCard) return

    // Update local state
    setStudyResults(prev => ({
      ...prev,
      [currentCard.id]: result
    }))

    // Update flashcard stats on server
    try {
      const updateData = {
        correctCount: result === 'correct' ? currentCard.correctCount + 1 : currentCard.correctCount,
        incorrectCount: result === 'incorrect' ? currentCard.incorrectCount + 1 : currentCard.incorrectCount,
        lastReviewed: new Date().toISOString(),
        nextReview: new Date(Date.now() + (result === 'correct' ? 7 : 1) * 24 * 60 * 60 * 1000).toISOString()
      }

      await fetch(`/api/flashcards/${currentCard.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      // Update local flashcard data
      setFlashcards(prev => prev.map(card => 
        card.id === currentCard.id 
          ? { ...card, ...updateData }
          : card
      ))

    } catch (error) {
      console.error('Failed to update flashcard stats:', error)
    }

    // Auto-advance to next card after a short delay
    setTimeout(() => {
      if (currentCardIndex < flashcards.length - 1) {
        setCurrentCardIndex(prev => prev + 1)
      }
    }, 1000)
  }

  const nextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(prev => prev + 1)
    }
  }

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1)
    }
  }

  const resetStudySession = () => {
    setCurrentCardIndex(0)
    setStudyResults({})
  }

  const getStudyProgress = () => {
    const answeredCards = Object.keys(studyResults).length
    return (answeredCards / flashcards.length) * 100
  }

  const getStudyStats = () => {
    const results = Object.values(studyResults)
    return {
      correct: results.filter(r => r === 'correct').length,
      partial: results.filter(r => r === 'partial').length,
      incorrect: results.filter(r => r === 'incorrect').length,
      total: results.length
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-gray-50 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <FaFlipboard className="mx-auto text-6xl text-muted-foreground mb-4 animate-pulse" />
          <p className="text-lg text-muted-foreground">Loading study session...</p>
        </div>
      </div>
    )
  }

  if (error || !deck) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-gray-50 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Study Session Not Found</h1>
          <p className="text-muted-foreground mb-6">{error || 'This deck could not be found or has no flashcards.'}</p>
          <Link href="/dashboard/decks">
            <Button>
              <HiOutlineArrowLeft className="mr-2 h-4 w-4" />
              Back to Decks
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (flashcards.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-gray-50 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <FaFlipboard className="mx-auto text-6xl text-muted-foreground mb-4" />
          <h1 className="text-2xl font-bold text-foreground mb-2">No Flashcards Found</h1>
          <p className="text-muted-foreground mb-6">This deck doesn't have any flashcards yet.</p>
          <div className="flex gap-4 justify-center">
            <Link href={`/dashboard/decks/${deck.id}`}>
              <Button variant="outline">
                <HiOutlineArrowLeft className="mr-2 h-4 w-4" />
                Back to Deck
              </Button>
            </Link>
            <Link href="/dashboard/flashcards">
              <Button>
                Generate Flashcards
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const isStudyComplete = Object.keys(studyResults).length === flashcards.length
  const stats = getStudyStats()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-gray-50 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <Link href={`/dashboard/decks/${deck.id}`}>
              <Button variant="outline" size="sm">
                <HiOutlineArrowLeft className="mr-2 h-4 w-4" />
                Back to Deck
              </Button>
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={resetStudySession}
              className="flex items-center gap-2"
            >
              <HiOutlineArrowPath className="h-4 w-4" />
              Reset Session
            </Button>
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              <FaFlipboard className="inline mr-3 text-green-500 dark:text-green-400" />
              Study Session
            </h1>
            <h2 className="text-xl text-muted-foreground mb-4">
              {deck.title || 'Study Session'}
            </h2>
            <div className="flex items-center justify-center gap-4 mb-4">
              <Badge variant="secondary">
                Card {currentCardIndex + 1} of {flashcards.length}
              </Badge>
              <Badge variant="outline">
                {Math.round(getStudyProgress())}% Complete
              </Badge>
            </div>
            <Progress value={getStudyProgress()} className="max-w-md mx-auto" />
          </div>
        </div>

        {/* Study Session Complete */}
        {isStudyComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            <Card className="max-w-md mx-auto bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/50 dark:to-blue-950/50 border-2 border-green-200 dark:border-green-700">
              <CardHeader>
                <div className="text-6xl mb-4">🎉</div>
                <CardTitle className="text-2xl text-green-700 dark:text-green-300">
                  Study Session Complete!
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.correct}</div>
                    <div className="text-xs text-green-600/70 dark:text-green-400/70">Correct</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.partial}</div>
                    <div className="text-xs text-yellow-600/70 dark:text-yellow-400/70">Partial</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.incorrect}</div>
                    <div className="text-xs text-red-600/70 dark:text-red-400/70">Incorrect</div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Button onClick={resetStudySession} className="w-full">
                    Study Again
                  </Button>
                  <Link href={`/dashboard/decks/${deck.id}`} className="block">
                    <Button variant="outline" className="w-full">
                      Back to Deck
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Current Flashcard */}
        {!isStudyComplete && flashcards[currentCardIndex] && (
          <div className="max-w-4xl mx-auto">
            <FlashcardWithAudio
              flashcard={flashcards[currentCardIndex]}
              onAnswerResult={handleAnswerResult}
              size="lg"
            />

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <Button 
                variant="outline" 
                onClick={prevCard} 
                disabled={currentCardIndex === 0}
                className="flex items-center gap-2"
              >
                <MdArrowBack className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="text-center">
                <div className="text-sm text-muted-foreground">
                  Progress: {stats.total}/{flashcards.length} cards answered
                </div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={nextCard} 
                disabled={currentCardIndex === flashcards.length - 1}
                className="flex items-center gap-2"
              >
                Next
                <MdArrowForward className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StudyDeckPage
