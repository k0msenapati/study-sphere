"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FaRotate, FaCheck, FaEye, FaXmark } from "react-icons/fa6"
import { Flashcard as FlashcardType } from "@/lib/flashcards/types"

interface FlashcardProps {
  flashcard: FlashcardType
  showAnswer?: boolean
  onAnswerResult?: (result: 'correct' | 'incorrect' | 'partial') => void
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Flashcard({ 
  flashcard, 
  showAnswer = false, 
  onAnswerResult,
  className = "",
  size = 'md'
}: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(showAnswer)
  const [hasAnswered, setHasAnswered] = useState(false)

  const handleAnswerClick = (result: 'correct' | 'incorrect' | 'partial') => {
    setHasAnswered(true)
    onAnswerResult?.(result)
  }

  const sizeClasses = {
    sm: 'min-h-[150px] p-4',
    md: 'min-h-[200px] p-6',
    lg: 'min-h-[250px] p-8'
  }

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  const difficultyColors = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800'
  }

  return (
    <div className={`relative ${className}`}>
      <motion.div
        initial={{ rotateY: 0 }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        style={{ transformStyle: "preserve-3d" }}
        className="relative w-full"
      >
        {/* Front of card (Question) */}
        <Card 
          className={`
            ${sizeClasses[size]} 
            cursor-pointer transition-all duration-300 hover:shadow-lg 
            bg-gradient-to-br from-white to-blue-50 border-2 border-blue-200
            ${isFlipped ? 'absolute inset-0 opacity-0' : 'relative opacity-100'}
          `}
          onClick={() => setIsFlipped(!isFlipped)}
          style={{ transform: "rotateY(0deg)", backfaceVisibility: "hidden" }}
        >
          <CardContent className={`${sizeClasses[size]} flex flex-col items-center justify-center text-center`}>
            <div className="mb-4 flex gap-2">
              <Badge className={difficultyColors[flashcard.difficulty]}>
                {flashcard.difficulty}
              </Badge>
              <Badge variant="outline">
                Question
              </Badge>
            </div>
            
            <p className={`${textSizes[size]} font-medium leading-relaxed mb-4`}>
              {flashcard.question}
            </p>
            
            <div className="flex items-center justify-center text-xs text-gray-500 mt-auto">
              <FaRotate className="mr-1" />
              Click to flip
            </div>
          </CardContent>
        </Card>

        {/* Back of card (Answer) */}
        <Card 
          className={`
            ${sizeClasses[size]} 
            cursor-pointer transition-all duration-300 hover:shadow-lg 
            bg-gradient-to-br from-white to-green-50 border-2 border-green-200
            ${isFlipped ? 'relative opacity-100' : 'absolute inset-0 opacity-0'}
          `}
          onClick={() => setIsFlipped(!isFlipped)}
          style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}
        >
          <CardContent className={`${sizeClasses[size]} flex flex-col items-center justify-center text-center`}>
            <div className="mb-4 flex gap-2">
              <Badge className="bg-green-100 text-green-800">
                Answer
              </Badge>
              <Badge variant="outline">
                {flashcard.topic}
              </Badge>
            </div>
            
            <p className={`${textSizes[size]} leading-relaxed mb-4 flex-1 flex items-center`}>
              {flashcard.answer}
            </p>
            
            {onAnswerResult && !hasAnswered && (
              <div className="flex gap-2 mt-4" onClick={(e) => e.stopPropagation()}>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-green-600 hover:bg-green-50 border-green-300"
                  onClick={() => handleAnswerClick('correct')}
                >
                  <FaCheck className="mr-1" />
                  Got it!
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-yellow-600 hover:bg-yellow-50 border-yellow-300"
                  onClick={() => handleAnswerClick('partial')}
                >
                  <FaEye className="mr-1" />
                  Partial
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-red-600 hover:bg-red-50 border-red-300"
                  onClick={() => handleAnswerClick('incorrect')}
                >
                  <FaXmark className="mr-1" />
                  Missed
                </Button>
              </div>
            )}

            {hasAnswered && (
              <div className="text-xs text-gray-500 mt-4">
                Answer recorded
              </div>
            )}
            
            <div className="flex items-center justify-center text-xs text-gray-500 mt-2">
              <FaRotate className="mr-1" />
              Click to flip back
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats overlay */}
      {(flashcard.correctCount > 0 || flashcard.incorrectCount > 0) && (
        <div className="absolute top-2 right-2 flex gap-1">
          {flashcard.correctCount > 0 && (
            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
              ✓{flashcard.correctCount}
            </Badge>
          )}
          {flashcard.incorrectCount > 0 && (
            <Badge variant="secondary" className="text-xs bg-red-100 text-red-700">
              ✗{flashcard.incorrectCount}
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}

export default Flashcard
