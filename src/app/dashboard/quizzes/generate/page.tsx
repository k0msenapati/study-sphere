"use client"

import { useRouter } from "next/navigation"
import QuizGenerator from "@/components/quizzes/quiz-generator"
import { Quiz } from "@/lib/quizzes/types"

export default function QuizGeneratorPage() {
  const router = useRouter()

  const handleQuizCreated = (quiz: Quiz) => {
    // Navigate back to quizzes page after successful creation
    router.push('/dashboard/quizzes')
  }

  return <QuizGenerator onQuizCreated={handleQuizCreated} />
}
