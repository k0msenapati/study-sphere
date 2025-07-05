export interface Flashcard {
  id: string
  deckId: string
  question: string
  answer: string
  difficulty: 'easy' | 'medium' | 'hard'
  topic: string
  hints?: string // JSON array of strings
  explanation?: string
  tags: string // JSON array of strings
  correctCount: number
  incorrectCount: number
  lastReviewed?: Date
  nextReview?: Date
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface Deck {
  id: string
  userId: number
  title: string
  description?: string
  color: string
  isPublic: boolean
  tags: string // JSON array of strings
  studyMaterial?: string
  totalCards: number
  lastStudied?: Date
  createdAt: Date
  updatedAt: Date
}

export interface FlashcardSet {
  id: string
  title: string
  description: string
  flashcards: Flashcard[]
  createdAt: Date
  updatedAt: Date
  studyMaterial: string
  settings: {
    numberOfCards: number
    difficulty: 'easy' | 'medium' | 'hard'
    focusArea: 'general' | 'definitions' | 'concepts' | 'problem-solving'
  }
}

export interface StudySession {
  id: string
  flashcardSetId: string
  startTime: Date
  endTime?: Date
  results: {
    [flashcardId: string]: 'correct' | 'incorrect' | 'partial'
  }
  totalCards: number
  correctAnswers: number
  incorrectAnswers: number
}

export interface FlashcardGenerationRequest {
  studyMaterial: string
  numberOfCards: number
  difficulty: 'easy' | 'medium' | 'hard'
  focusArea: 'general' | 'definitions' | 'concepts' | 'problem-solving'
  topics?: string[]
  customInstructions?: string
}

export interface FlashcardReviewMode {
  mode: 'study' | 'test' | 'review'
  shuffled: boolean
  showCorrectCount: boolean
  autoAdvance: boolean
  timeLimit?: number
}
