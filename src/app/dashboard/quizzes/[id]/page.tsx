"use client"

import { useState, useEffect } from "react"
import { useQuizzesContext } from "@/lib/quizzes/quizzes-provider"
import { Quiz } from "@/lib/quizzes/types"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
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
import { InfoIcon, AlertTriangle } from "lucide-react"

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen p-12 flex flex-col gap-8 items-center justify-center">
      <QuizGame quizId={params.id} />
    </div>
  )
}

function QuizGame({ quizId }: { quizId: string }) {
  const router = useRouter()
  const { quizzes } = useQuizzesContext()
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

  useEffect(() => {
    const quiz = quizzes.find(q => q.id === quizId)
    if (quiz) {
      setCurrentQuiz(quiz)
      setAnswers(new Array(quiz.questions.length).fill(null))
    }
  }, [quizId, quizzes])

  useEffect(() => {
    if (timer > 0 && !isQuizFinished) {
      const interval = setInterval(() => {
        setTimer(timer - 1)
      }, 1000)
      return () => clearInterval(interval)
    } else if (timer === 0) {
      setIsQuizFinished(true)
    }
  }, [timer, isQuizFinished])

  const handleAnswer = (selectedOption: string) => {
    if (currentQuiz) {
      const newAnswers = [...answers]
      newAnswers[currentQuestionIndex] = selectedOption
      setAnswers(newAnswers)

      const currentQuestion = currentQuiz.questions[currentQuestionIndex]
      if (selectedOption === currentQuestion.correctOption) {
        setScore(prevScore => prevScore + 1)
      }
      handleNextQuestion()
    }
  }

  const handleNextQuestion = () => {
    if (currentQuiz) {
      if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1)
      } else {
        // Show submission confirmation dialog instead of direct submission
        setShowSubmissionDialog(true)
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

  const getQuestionStatus = (index: number) => {
    if (revisitList.includes(index)) return "orange"
    if (answers[index] !== null) return "green"
    return "red"
  }

  const getQuestionStatusColor = (index: number) => {
    const status = getQuestionStatus(index)
    switch (status) {
      case "green":
        return "bg-green-500 hover:bg-green-600"
      case "orange":
        return "bg-orange-400 hover:bg-orange-500"
      case "red":
        return "bg-red-500 hover:bg-red-600"
      default:
        return "bg-gray-300 hover:bg-gray-400"
    }
  }

  const getQuizSummary = () => {
    const answered = answers.filter(answer => answer !== null).length
    const unanswered = answers.filter(answer => answer === null).length
    const markedForReview = revisitList.length

    return { answered, unanswered, markedForReview }
  }

  const handleSubmitQuiz = () => {
    setShowSubmissionDialog(false)
    setIsQuizFinished(true)
  }

  if (!currentQuiz) {
    return <div>Loading...</div>
  }

  if (isQuizFinished) {
    const totalQuestions = currentQuiz.questions.length
    const timeTaken = 300 - timer
    const percentage = (score / totalQuestions) * 100
    const passed = percentage > 80

    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Quiz Finished!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">
            Your score: {score} / {totalQuestions}
          </p>
          <p className="text-lg">
            Time taken: {Math.floor(timeTaken / 60)}:{("0" + (timeTaken % 60)).slice(-2)} minutes
          </p>
          <p className="text-lg">Percentage: {percentage.toFixed(2)}%</p>
          <Progress value={percentage} className="w-full" />
          <p className={`text-xl font-bold ${passed ? "text-green-600" : "text-red-600"}`}>
            {passed ? "Hurray! You passed! 🎉" : "Unfortunately, you didn't pass. 😢"}
          </p>
          <div className="flex gap-2">
            <Button onClick={() => setShowAnswers(true)} className="mt-4">
              View All Answers
            </Button>
            <Button onClick={() => router.back()} className="mt-4">
              Back to Quizzes
            </Button>
          </div>
        </CardContent>
        {showAnswers && (
          <Dialog open={showAnswers} onOpenChange={setShowAnswers}>
            <DialogContent className="h-[80vh] my-auto overflow-y-scroll">
              <DialogHeader>
                <DialogTitle>Review Your Answers</DialogTitle>
              </DialogHeader>
              <div>
                {currentQuiz.questions.map((question, index) => {
                  const userAnswer = answers[index]
                  const isCorrect = userAnswer === question.correctOption
                  const wasAnswered = userAnswer !== null

                  return (
                    <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                      <div className="mb-3">
                        <p className="font-bold text-white text-lg mb-2">
                          Question {index + 1}: {question.question}
                        </p>
                        {/* Question feedback */}
                        <div className="text-sm mb-3">
                          {!wasAnswered ? (
                            <span className="text-gray-500 font-medium">❌ Not answered</span>
                          ) : isCorrect ? (
                            <span className="text-green-600 font-medium">✅ Correct answer</span>
                          ) : (
                            <span className="text-red-600 font-medium">❌ Incorrect answer</span>
                          )}
                        </div>
                        {/* Show user's answer if they answered */}
                        {wasAnswered && (
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <span className="font-medium">Your answer: </span>
                            <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                              {userAnswer}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <p
                            key={optionIndex}
                            className={`p-3 rounded-lg border ${option === question.correctOption
                                ? "bg-green-500 border-green-600 text-white font-bold"
                                : userAnswer === option && option !== question.correctOption
                                  ? "bg-red-500 border-red-600 text-white font-bold"
                                  : "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300"
                              }`}
                          >
                            {option}
                            {option === question.correctOption && (
                              <span className="ml-2 text-xs">✅ Correct</span>
                            )}
                            {userAnswer === option && option !== question.correctOption && (
                              <span className="ml-2 text-xs">❌ Your choice</span>
                            )}
                          </p>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
              <DialogFooter>
                <Button onClick={() => setShowAnswers(false)}>Close</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </Card>
    )
  }

  const currentQuestion = currentQuiz.questions[currentQuestionIndex]
  const { answered, unanswered, markedForReview } = getQuizSummary()

  return (
    <>
      <div className="text-center">
        <h1 className="text-3xl font-bold">{currentQuiz.title}</h1>
        <p className="text-lg mt-2">{currentQuiz.description}</p>
      </div>

      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
          </CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <InfoIcon className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Quiz Instructions</DialogTitle>
                <DialogDescription>
                  <ul className="list-disc list-inside space-y-2">
                    <li>Answer each question by selecting an option.</li>
                    <li>Mark questions for review if you're unsure.</li>
                    <li>Review marked questions before submitting the quiz.</li>
                    <li>Time left: {timer} seconds.</li>
                  </ul>
                  <div className="mt-4 space-y-2">
                    <p className="font-medium">Question Status Legend:</p>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-sm">Answered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-orange-400 rounded"></div>
                      <span className="text-sm">Marked for Review</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 rounded"></div>
                      <span className="text-sm">Unanswered</span>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent className="space-y-4">
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
          <p className="text-lg">{currentQuestion.question}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={answers[currentQuestionIndex] === option ? "default" : "outline"}
                className="w-full text-left justify-start h-auto py-4 px-6"
                onClick={() => handleAnswer(option)}
              >
                {option}
              </Button>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="flex space-x-2">
            <Button
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              disabled={currentQuestionIndex === 0}
            >
              ⬅️ Previous
            </Button>
            <Button onClick={handleNextQuestion}>
              {currentQuestionIndex === currentQuiz.questions.length - 1 ? "Finish 🏁" : "Next ➡️"}
            </Button>
          </div>
          <div className="flex space-x-2">
            <Button
              variant={revisitList.includes(currentQuestionIndex) ? "default" : "outline"}
              onClick={handleRevisit}
            >
              {revisitList.includes(currentQuestionIndex) ? "Marked ⭐" : "Mark for Revisit 🔖"}
            </Button>
            <Button
              variant="outline"
              onClick={handleReviewMarked}
              disabled={revisitList.length === 0}
            >
              Review Marked 🔍
            </Button>
          </div>
        </CardFooter>
        <div className="px-6 py-4 text-right">
          <p className="text-sm text-gray-600">
            Time left: {Math.floor(timer / 60)}:{("0" + (timer % 60)).slice(-2)} minutes
          </p>
        </div>
      </Card>

      <Button
        onClick={() => {
          router.push("/dashboard/quizzes")
        }}
        className="ml-96 mr-auto"
      >
        Back to Quizzes
      </Button>

      {/* Submission Confirmation Dialog */}
      <AlertDialog open={showSubmissionDialog} onOpenChange={setShowSubmissionDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Confirm Quiz Submission
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-3 mt-2">
                <p>Please review your quiz status before submitting:</p>
                <div className="space-y-2 bg-black-50 p-3 rounded-md">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded"></div>
                      <span>Answered Questions:</span>
                    </div>
                    <span className="font-medium">{answered}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-500 rounded"></div>
                      <span>Unanswered Questions:</span>
                    </div>
                    <span className="font-medium">{unanswered}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-400 rounded"></div>
                      <span>Marked for Review:</span>
                    </div>
                    <span className="font-medium">{markedForReview}</span>
                  </div>
                </div>
                {(unanswered > 0 || markedForReview > 0) && (
                  <p className="text-orange-600 text-sm">
                    ⚠️ You have {unanswered > 0 ? `${unanswered} unanswered` : ""}
                    {unanswered > 0 && markedForReview > 0 ? " and " : ""}
                    {markedForReview > 0 ? `${markedForReview} marked for review` : ""} question(s).
                  </p>
                )}
                <p className="text-sm text-white-600">Are you sure you want to submit your quiz?</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back to Quiz</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmitQuiz}>Submit Quiz</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {showAlert && (
        <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
          <AlertDialogContent>
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
