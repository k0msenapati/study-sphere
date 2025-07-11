"use client"

import { useQuizzesContext } from "@/lib/quizzes/quizzes-provider"
import { Question, Quiz } from "@/lib/quizzes/types"
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Play, Info } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

function QuizzesComponent() {
  const { quizzes, createQuiz, updateQuiz, deleteQuiz } = useQuizzesContext()
  const router = useRouter()

  const handleDeleteQuiz = (id: string) => {
    deleteQuiz(id)
  }

  useCopilotReadable({
    description: "Quizzes list.",
    value: JSON.stringify(quizzes),
  })

  useCopilotAction({
    name: "Create a Quiz",
    description: "Adds a quiz to quizzes list.",
    parameters: [
      {
        name: "title",
        type: "string",
        description: "The title of the quiz.",
        required: true,
      },
      {
        name: "questions",
        type: "object[]",
        description: "An array of questions.",
        required: true,
      },
      {
        name: "description",
        type: "string",
        description: "The description of the quiz.",
        required: false,
      },
    ],
    handler: (args: {
      title: string
      description?: string
      questions: Question[]
    }) => {
      // Check if a quiz with the same title already exists
      const existingQuiz = quizzes.find(quiz =>
        quiz.title.toLowerCase().trim() === args.title.toLowerCase().trim()
      )

      if (existingQuiz) {
        throw new Error(`A quiz with the title "${args.title}" already exists. Please choose a different title.`)
      }

      // Generate unique ID using timestamp and random string
      const generateUniqueId = () => {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
      }

      // Ensure questions have unique IDs
      const questionsWithIds = (args.questions as Question[]).map((question, index) => ({
        ...question,
        id: question.id || `q-${generateUniqueId()}-${index}`
      }))

      const newQuiz: Quiz = {
        id: `quiz-${generateUniqueId()}`,
        title: args.title.trim(),
        description: args.description?.trim() || "",
        questions: questionsWithIds,
      }

      createQuiz(newQuiz)
    },
  })

  useCopilotAction({
    name: "Delete a Quiz",
    description: "Deletes a quiz from quizzes list.",
    parameters: [
      {
        name: "id",
        type: "string",
        description: "The id of the quiz to delete.",
        required: true,
      },
    ],
    handler: (args: { id: string }) => {
      deleteQuiz(args.id as string)
    },
  })

  useCopilotAction({
    name: "Update a Quiz",
    description: "Updates a quiz in quizzes list.",
    parameters: [
      {
        name: "id",
        type: "string",
        description: "The id of the quiz to update.",
        required: true,
      },
      {
        name: "title",
        type: "string",
        description: "The title of the quiz.",
        required: false,
      },
      {
        name: "questions",
        type: "object[]",
        description: "An array of questions.",
        required: false,
      },
    ],
    handler: (args: { id: string; title?: string; questions?: Question[] }) => {
      const updatedQuiz: Partial<Quiz> = {}
      if (args.title) {
        updatedQuiz.title = args.title as string
      }
      if (args.questions) {
        updatedQuiz.questions = args.questions as Question[]
      }
      updateQuiz(args.id as string, updatedQuiz)
    },
  })

  return (
    <div className="min-h-screen p-12">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold">📚 Quizzes</h1>
          <p className="text-lg text-muted-foreground mt-2">
            ✏️ Create, ▶️ play, and ⚙️ manage quizzes.
          </p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon">
                <Info className="h-5 w-5" />
                <span className="sr-only">Quiz Information</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-xs">
              <p>Quizzes are a great way to test your knowledge and learn new things.</p>
              <p className="mt-2">
                Playing quizzes can help improve memory retention and make learning more engaging.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      {quizzes.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              You don&apos;t have any quizzes yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {quizzes.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden h-full flex flex-col">
                <CardHeader className="pb-4">
                  <CardTitle className="text-2xl">{quiz.title}</CardTitle>
                  <CardDescription className="text-md">
                    {quiz.description.length > 50
                      ? quiz.description.slice(0, 50) + "..."
                      : quiz.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-between items-center pt-2">
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteQuiz(quiz.id)}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() => router.push(`/dashboard/quizzes/${quiz.id}`)}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Play
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default function Quizzes() {
  return <QuizzesComponent />
}
