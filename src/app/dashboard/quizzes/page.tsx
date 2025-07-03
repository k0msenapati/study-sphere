"use client"

import { useQuizzesContext } from "@/lib/quizzes/quizzes-provider"
import { Question, Quiz } from "@/lib/quizzes/types"
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2, Play, Info, BookOpen, Brain, Calculator, Globe, Palette, Music, Film, Dna, Atom, Zap, TrendingUp } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const topicIcons = {
  "General Knowledge": Globe,
  "Science": Atom,
  "Math": Calculator,
  "History": BookOpen,
  "Literature": BookOpen,
  "Computer Science": Brain,
  "Sports": Zap,
  "Geography": Globe,
  "Art": Palette,
  "Music": Music,
  "Movies": Film,
  "Biology": Dna,
  "Chemistry": Atom,
  "Physics": Zap,
  "Economics": TrendingUp
}

function QuizzesComponent() {
  const { quizzes, createQuiz, updateQuiz, deleteQuiz } = useQuizzesContext()
  const router = useRouter()

  const handleDeleteQuiz = (id: string) => {
    deleteQuiz(id)
  }

  const getTopicIcon = (title: string) => {
    for (const [topic, Icon] of Object.entries(topicIcons)) {
      if (title.toLowerCase().includes(topic.toLowerCase())) {
        return Icon
      }
    }
    return Brain
  }

  const getDifficultyColor = (title: string) => {
    if (title.toLowerCase().includes('easy')) return 'from-green-400 to-emerald-500'
    if (title.toLowerCase().includes('medium')) return 'from-yellow-400 to-orange-500'
    if (title.toLowerCase().includes('hard')) return 'from-red-400 to-pink-500'
    return 'from-blue-400 to-purple-500'
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
      const newQuiz: Quiz = {
        id: Math.random().toString(36).substring(7),
        title: args.title as string,
        description: args.description as string,
        questions: args.questions as Question[],
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
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-20 w-4 h-4 bg-white/20 rounded-full"
      />
      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-20 w-6 h-6 bg-white/10 rounded-full"
      />

      <div className="relative z-10 p-12">
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              📚 Knowledge Quizzes
            </h1>
            <p className="text-xl text-white/80 max-w-2xl">
              Test your knowledge across various subjects. Each quiz randomly selects 5 questions from our extensive question bank.
            </p>
          </motion.div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white/60 hover:text-white">
                  <Info className="h-5 w-5" />
                  <span className="sr-only">Quiz Information</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <p>Each quiz contains 10-15 questions but only shows 5 random questions per attempt.</p>
                <p className="mt-2">
                  Take the same quiz multiple times to see different questions and improve your knowledge!
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {quizzes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardContent className="pt-6">
                <p className="text-center text-white/80">
                  Loading quiz collection...
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {quizzes.map((quiz, index) => {
              const IconComponent = getTopicIcon(quiz.title)
              const gradientColor = getDifficultyColor(quiz.title)
              
              return (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="group"
                >
                  <Card className="overflow-hidden h-full flex flex-col bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/15 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10">
                    {/* Header with gradient */}
                    <div className={`h-2 bg-gradient-to-r ${gradientColor}`} />
                    
                    <CardHeader className="pb-4 flex-1">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className={`p-3 rounded-lg bg-gradient-to-r ${gradientColor} shadow-lg`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                              {quiz.title}
                            </CardTitle>
                          </div>
                        </div>
                      </div>
                      
                      <CardDescription className="text-white/70 text-sm mt-3 line-clamp-3">
                        {quiz.description}
                      </CardDescription>
                      
                      <div className="flex items-center justify-between mt-4 text-xs text-white/60">
                        <span className="flex items-center gap-1">
                          <Brain className="h-3 w-3" />
                          {quiz.questions.length} questions available
                        </span>
                        <span className="bg-white/10 px-2 py-1 rounded-full">
                          5 random questions
                        </span>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0 pb-4">
                      <div className="flex items-center justify-between gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteQuiz(quiz.id)}
                          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-red-400/30 hover:border-red-300/50"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                        
                        <Button
                          size="sm"
                          onClick={() => router.push(`/dashboard/quizzes/${quiz.id}`)}
                          className={`bg-gradient-to-r ${gradientColor} hover:opacity-90 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 flex-1`}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Start Quiz
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default function Quizzes() {
  return <QuizzesComponent />
}