export type Question = {
  id: string
  question: string
  options: string[]
  correctOption: string
}

export type QuizSubject = {
  id: string
  name: string
  description?: string
  color: string
  icon: string
  createdAt: number
  updatedAt: number
}

export type QuizTopic = {
  id: string
  subjectId: string
  name: string
  description?: string
  createdAt: number
  updatedAt: number
}

export type Quiz = {
  id: string
  userId?: string
  subjectId: string
  topicId: string
  title: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  questions: Question[]
  timeLimit: number // in seconds
  createdAt: number
  updatedAt: number
}

export type QuizBookmark = {
  id: string
  userId: number
  quizId: string
  createdAt: number
}

export type QuizCompletion = {
  id: string
  userId: number
  quizId: string
  score: number
  totalQuestions: number
  timeSpent: number // in seconds
  completedAt: number
  answers: string[]
}

export type QuizWithDetails = Quiz & {
  subject?: QuizSubject
  topic?: QuizTopic
  isBookmarked?: boolean
  isCompleted?: boolean
  completionScore?: number
}
