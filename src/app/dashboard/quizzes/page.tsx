"use client"

import { useQuizzesContext } from "@/lib/quizzes/quizzes-provider"
import { Question, Quiz } from "@/lib/quizzes/types"
import { useCopilotAction, useCopilotReadable } from "@copilotkit/react-core"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2, Play, Info, Sparkles, Plus, Bookmark, CheckCircle, Filter, X } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

function QuizzesComponent() {
  const { 
    quizzes, 
    subjects, 
    topics, 
    createQuiz, 
    updateQuiz, 
    deleteQuiz,
    toggleBookmark,
    selectedSubject,
    selectedTopic,
    selectedDifficulty,
    showBookmarked,
    showCompleted,
    setSelectedSubject,
    setSelectedTopic,
    setSelectedDifficulty,
    setShowBookmarked,
    setShowCompleted,
    isLoading,
    resetQuizData,
    checkLocalStorageStatus
  } = useQuizzesContext()
  const router = useRouter()

  const handleDeleteQuiz = (id: string) => {
    deleteQuiz(id)
  }

  const handleBookmarkToggle = (quizId: string) => {
    toggleBookmark(quizId)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '🌱'
      case 'intermediate': return '🎯'
      case 'advanced': return '🧠'
      default: return '📚'
    }
  }

  const getTopicsForSubject = (subjectId: string) => {
    return topics.filter(topic => topic.subjectId === subjectId)
  }

  const clearFilters = () => {
    setSelectedSubject(null)
    setSelectedTopic(null)
    setSelectedDifficulty(null)
    setShowBookmarked(false)
    setShowCompleted(false)
  }

  const hasActiveFilters = selectedSubject || selectedTopic || selectedDifficulty || showBookmarked || showCompleted

  useCopilotReadable({
    description: "Quizzes list with filters and organization.",
    value: JSON.stringify({ quizzes, selectedSubject, selectedTopic, selectedDifficulty, showBookmarked, showCompleted }),
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
      {
        name: "subjectId",
        type: "string",
        description: "The subject ID for the quiz.",
        required: true,
      },
      {
        name: "topicId",
        type: "string",
        description: "The topic ID for the quiz.",
        required: true,
      },
      {
        name: "difficulty",
        type: "string",
        description: "The difficulty level (beginner, intermediate, advanced).",
        required: true,
      },
    ],
    handler: (args: {
      title: string
      description?: string
      questions: Question[]
      subjectId: string
      topicId: string
      difficulty: string
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

      const newQuiz: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'> = {
        userId: "1", // TODO: Get actual user ID
        subjectId: args.subjectId,
        topicId: args.topicId,
        title: args.title.trim(),
        description: args.description?.trim() || "",
        difficulty: args.difficulty as 'beginner' | 'intermediate' | 'advanced',
        questions: questionsWithIds,
        timeLimit: 300, // 5 minutes default
      }

      createQuiz(newQuiz)
    },
  })

  if (isLoading) {
    return (
      <div className="min-h-screen p-12">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg text-muted-foreground">Loading quizzes...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold">📚 Quizzes</h1>
          <p className="text-lg text-muted-foreground mt-2">
            ✏️ Create, ▶️ play, and ⚙️ manage quizzes by subject and difficulty.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => router.push('/dashboard/quizzes/generate')}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Generate AI Quiz
          </Button>
          
          <Button 
            onClick={resetQuizData}
            variant="outline"
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            Reset Quizzes
          </Button>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Info className="h-5 w-5" />
                  <span className="sr-only">Quiz Information</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Organize quizzes by subject and topic with difficulty levels.</p>
                <p className="mt-2">Bookmark quizzes for later review and track your progress.</p>
                <p className="mt-2 font-semibold">
                  💡 Use filters to find the perfect quiz for your learning level!
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <h3 className="text-lg font-semibold">Filters</h3>
            </div>
            {hasActiveFilters && (
              <Button variant="outline" size="sm" onClick={clearFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Subject Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <Select value={selectedSubject || "all"} onValueChange={(value) => setSelectedSubject(value === "all" ? null : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
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

            {/* Topic Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Topic</label>
              <Select value={selectedTopic || "all"} onValueChange={(value) => setSelectedTopic(value === "all" ? null : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Topics" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Topics</SelectItem>
                  {selectedSubject && getTopicsForSubject(selectedSubject).map((topic) => (
                    <SelectItem key={topic.id} value={topic.id}>
                      {topic.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty</label>
              <Select value={selectedDifficulty || "all"} onValueChange={(value) => setSelectedDifficulty(value === "all" ? null : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Difficulties" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Difficulties</SelectItem>
                  <SelectItem value="beginner">🌱 Beginner</SelectItem>
                  <SelectItem value="intermediate">🎯 Intermediate</SelectItem>
                  <SelectItem value="advanced">🧠 Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <div className="flex gap-2">
                <Button
                  variant={showBookmarked ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowBookmarked(!showBookmarked)}
                >
                  <Bookmark className="h-4 w-4 mr-1" />
                  Bookmarked
                </Button>
                <Button
                  variant={showCompleted ? "default" : "outline"}
                  size="sm"
                  onClick={() => setShowCompleted(!showCompleted)}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Completed
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quiz Display */}
      {quizzes.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <div className="space-y-4">
              <div className="text-muted-foreground">
                <p className="text-lg mb-2">
                  {hasActiveFilters 
                    ? "No quizzes match your current filters." 
                    : "You don't have any quizzes yet."
                  }
                </p>
                <p className="text-sm">
                  {hasActiveFilters 
                    ? "Try adjusting your filters or create a new quiz." 
                    : "Get started by creating your first quiz!"
                  }
                </p>
              </div>
              
              {hasActiveFilters && (
                <div className="flex justify-center mt-6">
                  <Button variant="outline" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
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
              <Card className="overflow-hidden h-full flex flex-col relative">
                {/* Completion Badge */}
                {quiz.isCompleted && (
                  <div className="absolute top-2 right-2 z-10">
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  </div>
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl">{quiz.title}</CardTitle>
                      <CardDescription className="text-sm mt-2">
                        {quiz.description.length > 60
                          ? quiz.description.slice(0, 60) + "..."
                          : quiz.description}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBookmarkToggle(quiz.id)}
                      className={`ml-2 ${quiz.isBookmarked ? 'text-yellow-500' : 'text-gray-400'}`}
                    >
                      <Bookmark className={`h-4 w-4 ${quiz.isBookmarked ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                  
                  {/* Subject and Topic Info */}
                  <div className="flex items-center gap-2 mt-2">
                    {quiz.subject && (
                      <Badge variant="outline" style={{ borderColor: quiz.subject.color, color: quiz.subject.color }}>
                        {quiz.subject.icon} {quiz.subject.name}
                      </Badge>
                    )}
                    {quiz.topic && (
                      <Badge variant="outline">
                        {quiz.topic.name}
                      </Badge>
                    )}
                  </div>

                  {/* Difficulty Badge */}
                  <div className="mt-2">
                    <Badge className={getDifficultyColor(quiz.difficulty)}>
                      {getDifficultyIcon(quiz.difficulty)} {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                    </Badge>
                  </div>

                  {/* Completion Score */}
                  {quiz.isCompleted && quiz.completionScore !== undefined && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      Score: {quiz.completionScore}/{quiz.questions.length} ({Math.round((quiz.completionScore / quiz.questions.length) * 100)}%)
                    </div>
                  )}
                </CardHeader>

                <CardContent className="flex justify-between items-center pt-2 mt-auto">
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
                    {quiz.isCompleted ? 'Retry' : 'Play'}
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
