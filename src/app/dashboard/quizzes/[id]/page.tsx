"use client"

import { useState, useEffect } from "react"
import { useQuizzesContext } from "@/lib/quizzes/quizzes-provider"
import { Quiz } from "@/lib/quizzes/types"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { InfoIcon, AlertTriangle, CheckCircle, Clock, Trophy } from "lucide-react"

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen p-12 flex flex-col gap-8 items-center justify-center">
      <QuizGame quizId={params.id} />
    </div>
  )
}

function QuizGame({ quizId }: { quizId: string }) {
  const router = useRouter()
  const { quizzes, markAsCompleted } = useQuizzesContext()
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [timer, setTimer] = useState(300) // Timer for the entire quiz (e.g., 5 minutes)
  const [isQuizFinished, setIsQuizFinished] = useState(false)
  const [revisitList, setRevisitList] = useState<number[]>([])
  const [answers, setAnswers] = useState<(string | null)[]>([])
  const [showAlert, setShowAlert] = useState(false)
  const [alertContent, setAlertContent] = useState({
    title: "",
    description: "",
  })
  const [showAnswers, setShowAnswers] = useState(false)
  const [showSubmissionDialog, setShowSubmissionDialog] = useState(false)
  const [startTime, setStartTime] = useState<number>(0)
  const [isLoading, setIsLoading] = useState(true)
  const [lastAnswerResult, setLastAnswerResult] = useState<'correct' | 'incorrect' | null>(null)

  useEffect(() => {
    const quiz = quizzes.find(q => q.id === quizId)
    if (quiz) {
      setCurrentQuiz(quiz)
      setAnswers(new Array(quiz.questions.length).fill(null))
      setTimer(quiz.timeLimit || 300)
      setStartTime(Date.now())
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }
  }, [quizId, quizzes])

  useEffect(() => {
    if (timer > 0 && !isQuizFinished) {
      const interval = setInterval(() => {
        setTimer(prevTimer => {
          if (prevTimer <= 1) {
            setIsQuizFinished(true)
            return 0
          }
          return prevTimer - 1
        })
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [isQuizFinished])

  const handleAnswer = (selectedOption: string) => {
    if (currentQuiz && lastAnswerResult === null) { // Prevent multiple clicks
      console.log('=== ANSWER HANDLER CALLED ===')
      const newAnswers = [...answers]
      newAnswers[currentQuestionIndex] = selectedOption
      setAnswers(newAnswers)

      const currentQuestion = currentQuiz.questions[currentQuestionIndex]
      const correctOption = currentQuestion.correctOption
      
      console.log('Selected option:', `"${selectedOption}"`)
      console.log('Correct option from data:', `"${correctOption}"`)
      console.log('Are they equal?', selectedOption === correctOption)
      
      // Test case for debugging
      console.log('Test comparison:', '"2" === "2"', "2" === "2")
      console.log('Test comparison:', `"${selectedOption}" === "${correctOption}"`, selectedOption === correctOption)
      
      if (selectedOption === correctOption) {
        console.log('Correct answer! Incrementing score')
        setScore(prevScore => {
          const newScore = prevScore + 1
          console.log('Score updated from', prevScore, 'to', newScore)
          return newScore
        })
        setLastAnswerResult('correct')
      } else {
        console.log('Wrong answer. Score remains:', score)
        setLastAnswerResult('incorrect')
      }
      
      // Clear the result after a short delay
      setTimeout(() => {
        setLastAnswerResult(null)
        handleNextQuestion()
      }, 1000)
    }
  }

  const handleNextQuestion = () => {
    if (currentQuiz && currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setIsQuizFinished(true)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleFinishQuiz = () => {
    if (currentQuiz) {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000)
      markAsCompleted(currentQuiz.id, score, timeSpent, answers.map(a => a || ''))
      setShowSubmissionDialog(true)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getQuestionStatusColor = (index: number) => {
    if (answers[index] !== null) {
      return "bg-green-500"
    } else if (revisitList.includes(index)) {
      return "bg-yellow-500"
    } else {
      return "bg-gray-500"
    }
  }

  const toggleRevisit = (index: number) => {
    if (revisitList.includes(index)) {
      setRevisitList(revisitList.filter(i => i !== index))
    } else {
      setRevisitList([...revisitList, index])
    }
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl">
        <CardContent className="pt-6 text-center">
          <p className="text-lg text-muted-foreground">Loading quiz...</p>
        </CardContent>
      </Card>
    )
  }

  if (!currentQuiz) {
    return (
      <Card className="w-full max-w-2xl">
        <CardContent className="pt-6 text-center">
          <p className="text-lg text-muted-foreground">Quiz not found</p>
          <Button onClick={() => router.push('/dashboard/quizzes')} className="mt-4">
            Back to Quizzes
          </Button>
        </CardContent>
      </Card>
    )
  }

  const currentQuestion = currentQuiz.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100

  return (
    <div className="w-full max-w-4xl">
      {/* Quiz Header */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{currentQuiz.title}</CardTitle>
              <CardDescription>{currentQuiz.description}</CardDescription>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Time Left
                </div>
                <div className={`text-lg font-bold ${timer < 60 ? 'text-red-500' : ''}`}>
                  {formatTime(timer)}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Score</div>
                <div className="text-lg font-bold text-green-600">
                  {score}/{currentQuiz.questions.length}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="w-full" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </CardContent>
      </Card>

      {/* Question Navigation */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex justify-center space-x-2 mb-4 flex-wrap">
            {currentQuiz.questions.map((_, index) => (
              <div
                key={index}
                className={`w-8 h-8 rounded-sm cursor-pointer text-white text-sm font-medium flex items-center justify-center transition-colors ${getQuestionStatusColor(index)}`}
                onClick={() => setCurrentQuestionIndex(index)}
                title={`Question ${index + 1} - ${answers[index] !== null
                  ? "Answered"
                  : revisitList.includes(index)
                    ? "Marked for Review"
                    : "Unanswered"
                  }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Question */}
      {!isQuizFinished ? (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Question {currentQuestionIndex + 1}</CardTitle>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleRevisit(currentQuestionIndex)}
                  className={revisitList.includes(currentQuestionIndex) ? "bg-yellow-100" : ""}
                >
                  {revisitList.includes(currentQuestionIndex) ? "✓ Marked" : "Mark for Review"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-lg">{currentQuestion.question}</p>
            
            {/* Answer Result Feedback */}
            {lastAnswerResult && (
              <div className={`p-4 rounded-lg text-center font-semibold ${
                lastAnswerResult === 'correct' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
              }`}>
                {lastAnswerResult === 'correct' ? '✅ Correct!' : '❌ Incorrect!'}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQuestion.options.map((option, index) => (
                <Button
                  key={index}
                  variant={answers[currentQuestionIndex] === option ? "default" : "outline"}
                  className="w-full text-left justify-start h-auto py-4 px-6"
                  onClick={() => handleAnswer(option)}
                  disabled={lastAnswerResult !== null}
                >
                  {option}
                </Button>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            <Button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === currentQuiz.questions.length - 1}
            >
              Next
            </Button>
          </CardFooter>
        </Card>
      ) : (
        /* Quiz Results */
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Quiz Complete!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 text-4xl">
              <Trophy className="text-yellow-500" />
              <span className="font-bold">{score}/{currentQuiz.questions.length}</span>
            </div>
            <p className="text-lg">
              You scored {Math.round((score / currentQuiz.questions.length) * 100)}%
            </p>
            <div className="flex justify-center gap-4 text-sm text-muted-foreground">
              <span>Time: {formatTime(Math.floor((Date.now() - startTime) / 1000))}</span>
              <span>Questions: {currentQuiz.questions.length}</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center gap-4">
            <Button onClick={handleFinishQuiz} variant="default">
              <CheckCircle className="h-4 w-4 mr-2" />
              Save Results
            </Button>
            <Button onClick={() => router.push('/dashboard/quizzes')} variant="outline">
              Back to Quizzes
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Submission Dialog */}
      <Dialog open={showSubmissionDialog} onOpenChange={setShowSubmissionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quiz Results Saved!</DialogTitle>
            <DialogDescription>
              Your quiz results have been saved. You can review your completed quizzes anytime.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => router.push('/dashboard/quizzes')}>
              Back to Quizzes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
