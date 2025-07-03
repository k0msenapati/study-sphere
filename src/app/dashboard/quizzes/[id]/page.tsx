"use client"

import { useState, useEffect } from "react"
import { useQuizzesContext } from "@/lib/quizzes/quizzes-provider"
import { Quiz } from "@/lib/quizzes/types"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
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
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { InfoIcon, ArrowLeft, RotateCcw, CheckCircle, XCircle, Clock } from "lucide-react"

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem] opacity-5"></div>
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)] opacity-30"></div>
      
      {/* Floating Elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-10 left-10 w-20 h-20 border border-white/20 rounded-full"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-10 right-10 w-16 h-16 border border-white/20 rounded-full"
      />
      
      <div className="relative z-10 p-8 flex flex-col gap-8 items-center justify-center min-h-screen">
        <QuizGame quizId={params.id} />
      </div>
    </div>
  )
}

function QuizGame({ quizId }: { quizId: string }) {
  const router = useRouter()
  const { quizzes } = useQuizzesContext()
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [selectedQuestions, setSelectedQuestions] = useState<any[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [timer, setTimer] = useState(300) // 5 minutes
  const [isQuizFinished, setIsQuizFinished] = useState(false)
  const [revisitList, setRevisitList] = useState<number[]>([])
  const [answers, setAnswers] = useState<(string | null)[]>([])
  const [showAlert, setShowAlert] = useState(false)
  const [alertContent, setAlertContent] = useState({
    title: "",
    description: "",
  })
  const [showAnswers, setShowAnswers] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)

  // Function to randomly select 5 questions from the quiz
  const selectRandomQuestions = (quiz: Quiz) => {
    const shuffled = [...quiz.questions].sort(() => 0.5 - Math.random())
    return shuffled.slice(0, 5)
  }

  useEffect(() => {
    const quiz = quizzes.find(q => q.id === quizId)
    if (quiz) {
      setCurrentQuiz(quiz)
      const randomQuestions = selectRandomQuestions(quiz)
      setSelectedQuestions(randomQuestions)
      setAnswers(new Array(5).fill(null))
    }
  }, [quizId, quizzes])

  useEffect(() => {
    if (timer > 0 && !isQuizFinished && selectedQuestions.length > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1)
      }, 1000)
      return () => clearInterval(interval)
    } else if (timer === 0) {
      setIsQuizFinished(true)
    }
  }, [timer, isQuizFinished, selectedQuestions])

  const handleAnswer = (selectedOption: string) => {
    if (selectedQuestions.length === 0) return
    
    setSelectedAnswer(selectedOption)
    
    setTimeout(() => {
      const newAnswers = [...answers]
      newAnswers[currentQuestionIndex] = selectedOption
      setAnswers(newAnswers)

      const currentQuestion = selectedQuestions[currentQuestionIndex]
      if (selectedOption === currentQuestion.correctOption) {
        setScore(prevScore => prevScore + 1)
      }
      
      setSelectedAnswer(null)
      handleNextQuestion()
    }, 1000)
  }

  const handleNextQuestion = () => {
    if (selectedQuestions.length === 0) return
    
    if (currentQuestionIndex < selectedQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      if (revisitList.length > 0) {
        setAlertContent({
          title: "Review marked questions",
          description: "You have marked questions for review. Please check them before submitting.",
        })
        setShowAlert(true)
      } else {
        setIsQuizFinished(true)
      }
    }
  }

  const handleRevisit = () => {
    if (!revisitList.includes(currentQuestionIndex)) {
      setRevisitList([...revisitList, currentQuestionIndex])
      setAlertContent({
        title: "Question marked for revisit",
        description: `Question ${currentQuestionIndex + 1} has been marked for revisit.`,
      })
    } else {
      setRevisitList(revisitList.filter(q => q !== currentQuestionIndex))
      setAlertContent({
        title: "Question unmarked",
        description: `Question ${currentQuestionIndex + 1} has been removed from revisit list.`,
      })
    }
    setShowAlert(true)
  }

  const handleReviewMarked = () => {
    if (revisitList.length > 0) {
      setCurrentQuestionIndex(revisitList[0])
    }
  }

  const restartQuiz = () => {
    if (currentQuiz) {
      const randomQuestions = selectRandomQuestions(currentQuiz)
      setSelectedQuestions(randomQuestions)
      setCurrentQuestionIndex(0)
      setScore(0)
      setTimer(300)
      setIsQuizFinished(false)
      setRevisitList([])
      setAnswers(new Array(5).fill(null))
      setSelectedAnswer(null)
    }
  }

  const getQuestionStatus = (index: number) => {
    if (revisitList.includes(index)) return "yellow"
    if (answers[index] !== null) return "green"
    return "gray"
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (!currentQuiz || selectedQuestions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-8">
            <div className="text-white text-lg">Loading quiz...</div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  if (isQuizFinished) {
    const totalQuestions = selectedQuestions.length
    const timeTaken = 300 - timer
    const percentage = (score / totalQuestions) * 100
    const passed = percentage >= 60

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-2xl mx-auto"
      >
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Quiz Complete! 🎉
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">{score}</div>
                <div className="text-sm text-white/70">Correct Answers</div>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-400">{percentage.toFixed(0)}%</div>
                <div className="text-sm text-white/70">Score</div>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-lg font-medium mb-2">Time Taken</div>
              <div className="text-xl">{formatTime(timeTaken)}</div>
            </div>
            
            <Progress value={percentage} className="w-full h-3" />
            
            <div className={`text-xl font-bold flex items-center justify-center gap-2 ${
              passed ? "text-green-400" : "text-red-400"
            }`}>
              {passed ? <CheckCircle className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
              {passed ? "Great job! You passed!" : "Keep studying and try again!"}
            </div>
            
            <div className="flex gap-3 justify-center flex-wrap">
              <Button 
                onClick={() => setShowAnswers(true)} 
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Review Answers
              </Button>
              <Button 
                onClick={restartQuiz}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button 
                onClick={() => router.back()} 
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Quizzes
              </Button>
            </div>
          </CardContent>
          
          {showAnswers && (
            <Dialog open={showAnswers} onOpenChange={setShowAnswers}>
              <DialogContent className="h-[80vh] my-auto overflow-y-scroll bg-white/95 backdrop-blur-sm">
                <DialogHeader>
                  <DialogTitle>Review Your Answers</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {selectedQuestions.map((question, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <p className="font-semibold mb-3">Q{index + 1}: {question.question}</p>
                      <div className="space-y-2">
                        {question.options.map((option: string, optionIndex: number) => (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded-lg border ${
                              option === question.correctOption
                                ? "bg-green-100 border-green-300 text-green-800"
                                : answers[index] === option && option !== question.correctOption
                                ? "bg-red-100 border-red-300 text-red-800"
                                : "bg-gray-50 border-gray-200"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {option === question.correctOption && <CheckCircle className="h-4 w-4 text-green-600" />}
                              {answers[index] === option && option !== question.correctOption && <XCircle className="h-4 w-4 text-red-600" />}
                              <span>{option}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <DialogFooter>
                  <Button onClick={() => setShowAnswers(false)}>Close</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </Card>
      </motion.div>
    )
  }

  const currentQuestion = selectedQuestions[currentQuestionIndex]

  return (
    <>
      <div className="text-center mb-6">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2"
        >
          {currentQuiz.title}
        </motion.h1>
        <p className="text-white/80 text-lg">{currentQuiz.description}</p>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl mx-auto"
      >
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                Question {currentQuestionIndex + 1} of {selectedQuestions.length}
              </CardTitle>
              <div className="flex items-center gap-2 mt-2 text-white/70">
                <Clock className="h-4 w-4" />
                <span>Time left: {formatTime(timer)}</span>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <InfoIcon className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white/95 backdrop-blur-sm">
                <DialogHeader>
                  <DialogTitle>Quiz Instructions</DialogTitle>
                  <DialogDescription>
                    <ul className="list-disc list-inside space-y-2">
                      <li>This quiz contains 5 randomly selected questions from {currentQuiz.questions.length} available questions.</li>
                      <li>Answer each question by selecting an option.</li>
                      <li>Mark questions for review if you're unsure.</li>
                      <li>You have 5 minutes to complete the quiz.</li>
                      <li>You can retake the quiz to see different questions!</li>
                    </ul>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Question Progress Indicators */}
            <div className="flex justify-center space-x-2 mb-6">
              {selectedQuestions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium transition-all ${
                    index === currentQuestionIndex
                      ? "bg-blue-500 border-blue-400 text-white"
                      : getQuestionStatus(index) === "green"
                      ? "bg-green-500 border-green-400 text-white"
                      : getQuestionStatus(index) === "yellow"
                      ? "bg-yellow-500 border-yellow-400 text-white"
                      : "bg-white/10 border-white/30 text-white/70 hover:bg-white/20"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="bg-white/5 rounded-lg p-6">
              <p className="text-xl font-medium leading-relaxed">{currentQuestion.question}</p>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {currentQuestion.options.map((option: string, index: number) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-300 ${
                    selectedAnswer === option
                      ? option === currentQuestion.correctOption
                        ? "bg-green-500/20 border-green-400 text-green-100"
                        : "bg-red-500/20 border-red-400 text-red-100"
                      : answers[currentQuestionIndex] === option
                      ? "bg-blue-500/20 border-blue-400 text-blue-100"
                      : "bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/40"
                  }`}
                  onClick={() => !selectedAnswer && handleAnswer(option)}
                  disabled={!!selectedAnswer}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === option
                        ? option === currentQuestion.correctOption
                          ? "border-green-400 bg-green-500"
                          : "border-red-400 bg-red-500"
                        : answers[currentQuestionIndex] === option
                        ? "border-blue-400 bg-blue-500"
                        : "border-white/40"
                    }`}>
                      {(selectedAnswer === option || answers[currentQuestionIndex] === option) && (
                        selectedAnswer === option && option === currentQuestion.correctOption ? (
                          <CheckCircle className="h-4 w-4 text-white" />
                        ) : selectedAnswer === option && option !== currentQuestion.correctOption ? (
                          <XCircle className="h-4 w-4 text-white" />
                        ) : (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        )
                      )}
                    </div>
                    <span className="font-medium">{option}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="flex space-x-2">
              <Button
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                ⬅️ Previous
              </Button>
              <Button 
                onClick={handleNextQuestion}
                disabled={!selectedAnswer}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {currentQuestionIndex === selectedQuestions.length - 1 ? "Finish 🏁" : "Next ➡️"}
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant={revisitList.includes(currentQuestionIndex) ? "default" : "outline"}
                onClick={handleRevisit}
                className={revisitList.includes(currentQuestionIndex) 
                  ? "bg-yellow-500 hover:bg-yellow-600 text-white" 
                  : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                }
              >
                {revisitList.includes(currentQuestionIndex) ? "Marked ⭐" : "Mark for Review 🔖"}
              </Button>
              <Button
                variant="outline"
                onClick={handleReviewMarked}
                disabled={revisitList.length === 0}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 disabled:opacity-50"
              >
                Review Marked 🔍
              </Button>
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      {showAlert && (
        <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
          <AlertDialogContent className="bg-white/95 backdrop-blur-sm">
            <AlertDialogHeader>
              <AlertDialogTitle>{alertContent.title}</AlertDialogTitle>
              <AlertDialogDescription>{alertContent.description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={() => setShowAlert(false)}>OK</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}