import React, { createContext, useContext, useState, useEffect } from "react"
import { Quiz, QuizSubject, QuizTopic, QuizBookmark, QuizCompletion, QuizWithDetails } from "./types"

type QuizzesContextType = {
  quizzes: QuizWithDetails[]
  subjects: QuizSubject[]
  topics: QuizTopic[]
  bookmarks: QuizBookmark[]
  completions: QuizCompletion[]
  selectedSubject: string | null
  selectedTopic: string | null
  selectedDifficulty: string | null
  showBookmarked: boolean
  showCompleted: boolean
  createQuiz: (quiz: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateQuiz: (id: string, updatedQuiz: Partial<Quiz>) => void
  deleteQuiz: (id: string) => void
  toggleBookmark: (quizId: string) => void
  markAsCompleted: (quizId: string, score: number, timeSpent: number, answers: string[]) => void
  setSelectedSubject: (subjectId: string | null) => void
  setSelectedTopic: (topicId: string | null) => void
  setSelectedDifficulty: (difficulty: string | null) => void
  setShowBookmarked: (show: boolean) => void
  setShowCompleted: (show: boolean) => void
  getFilteredQuizzes: () => QuizWithDetails[]
  isLoading: boolean
  clearFilters: () => void
  resetQuizData: () => void
  checkLocalStorageStatus: () => { quizzes: Quiz[], bookmarks: QuizBookmark[], completions: QuizCompletion[] }
}

const QuizzesContext = createContext<QuizzesContextType | undefined>(undefined)

export const useQuizzesContext = () => {
  const context = useContext(QuizzesContext)
  if (!context) {
    throw new Error("useQuizzesContext must be used within a QuizzesProvider")
  }
  return context
}

export const QuizzesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [subjects, setSubjects] = useState<QuizSubject[]>([])
  const [topics, setTopics] = useState<QuizTopic[]>([])
  const [bookmarks, setBookmarks] = useState<QuizBookmark[]>([])
  const [completions, setCompletions] = useState<QuizCompletion[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null)
  const [showBookmarked, setShowBookmarked] = useState(false)
  const [showCompleted, setShowCompleted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load data from localStorage and database on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load quizzes, bookmarks, and completions from localStorage
        const savedQuizzes = localStorage.getItem('quizzes')
        const savedBookmarks = localStorage.getItem('quizBookmarks')
        const savedCompletions = localStorage.getItem('quizCompletions')
        
        if (savedQuizzes) {
          try {
            const parsedQuizzes = JSON.parse(savedQuizzes)
            console.log('📥 Loading quizzes from localStorage:', parsedQuizzes)
            
            if (Array.isArray(parsedQuizzes) && parsedQuizzes.length > 0) {
              // Check if the quizzes have valid structure
              const hasValidQuizzes = parsedQuizzes.every(quiz => 
                quiz.questions && 
                Array.isArray(quiz.questions) &&
                quiz.questions.every((q: any) => 
                  q.correctOption && 
                  typeof q.correctOption === 'string' &&
                  q.correctOption.length > 0
                )
              )
              
              if (hasValidQuizzes) {
                console.log('✅ Valid quizzes found, setting quizzes:', parsedQuizzes.length, 'quizzes')
                setQuizzes(parsedQuizzes)
              } else {
                console.log('❌ Found corrupted quiz data, clearing and using sample quizzes')
                localStorage.removeItem('quizzes')
                setQuizzes([])
              }
            } else {
              console.log('📝 No saved quizzes found or empty array, will load sample quizzes')
            }
          } catch (error) {
            console.error('❌ Error parsing saved quizzes:', error)
            localStorage.removeItem('quizzes')
            setQuizzes([])
          }
        } else {
          console.log('📝 No saved quizzes found, will load sample quizzes')
        }
        
        // Load sample quizzes only if no valid quizzes were found
        const currentQuizzes = JSON.parse(localStorage.getItem('quizzes') || '[]')
        if (currentQuizzes.length === 0) {
          console.log('📚 Loading sample quizzes...')
          const sampleQuizzes: Quiz[] = [
            {
              id: "sample-math-1",
              userId: 1,
              subjectId: "math",
              topicId: "algebra",
              title: "🌱 Basic Algebra Quiz",
              description: "Test your knowledge of basic algebraic concepts with 5 beginner-level questions.",
              difficulty: "beginner",
              questions: [
                {
                  id: "q1",
                  question: "What is the value of x in the equation 2x + 3 = 7?",
                  options: ["2", "3", "4", "5"],
                  correctOption: "2"
                },
                {
                  id: "q2",
                  question: "Which of the following is a linear equation?",
                  options: ["x² + 2x + 1", "2x + 3 = 7", "x³ + x", "√x + 2"],
                  correctOption: "2x + 3 = 7"
                },
                {
                  id: "q3",
                  question: "What is the slope of the line y = 3x + 2?",
                  options: ["2", "3", "5", "6"],
                  correctOption: "3"
                },
                {
                  id: "q4",
                  question: "Solve for x: 3x - 6 = 12",
                  options: ["2", "4", "6", "8"],
                  correctOption: "6"
                },
                {
                  id: "q5",
                  question: "What is the y-intercept of y = 2x + 5?",
                  options: ["2", "5", "7", "10"],
                  correctOption: "5"
                }
              ],
              timeLimit: 300,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            },
            {
              id: "sample-science-1",
              userId: 1,
              subjectId: "science",
              topicId: "physics",
              title: "🎯 Physics Fundamentals",
              description: "Test your understanding of basic physics concepts with 5 intermediate-level questions.",
              difficulty: "intermediate",
              questions: [
                {
                  id: "q1",
                  question: "What is the SI unit of force?",
                  options: ["Joule", "Newton", "Watt", "Pascal"],
                  correctOption: "Newton"
                },
                {
                  id: "q2",
                  question: "Which law states that every action has an equal and opposite reaction?",
                  options: ["Newton's First Law", "Newton's Second Law", "Newton's Third Law", "Law of Gravity"],
                  correctOption: "Newton's Third Law"
                },
                {
                  id: "q3",
                  question: "What is the formula for kinetic energy?",
                  options: ["KE = mgh", "KE = ½mv²", "KE = mv", "KE = Fd"],
                  correctOption: "KE = ½mv²"
                },
                {
                  id: "q4",
                  question: "What is the unit of power?",
                  options: ["Joule", "Newton", "Watt", "Meter"],
                  correctOption: "Watt"
                },
                {
                  id: "q5",
                  question: "Which of the following is a vector quantity?",
                  options: ["Mass", "Temperature", "Velocity", "Time"],
                  correctOption: "Velocity"
                }
              ],
              timeLimit: 300,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            }
          ]
          
          // Check if sample quizzes already exist to prevent duplicates
          const existingSampleIds = new Set(['sample-math-1', 'sample-science-1'])
          const hasSampleQuizzes = currentQuizzes.some((quiz: Quiz) => existingSampleIds.has(quiz.id))
          
          if (!hasSampleQuizzes) {
            console.log('📚 Loading sample quizzes...')
            setQuizzes(sampleQuizzes)
            // Save to localStorage immediately
            try {
              localStorage.setItem('quizzes', JSON.stringify(sampleQuizzes))
              console.log('✅ Sample quizzes saved to localStorage')
            } catch (error) {
              console.error('❌ Error saving sample quizzes to localStorage:', error)
            }
          } else {
            console.log('📚 Sample quizzes already exist, skipping...')
          }
        }
        
        if (savedBookmarks) {
          try {
            const parsedBookmarks = JSON.parse(savedBookmarks)
            if (Array.isArray(parsedBookmarks)) {
              setBookmarks(parsedBookmarks)
            }
          } catch (error) {
            console.error('Error parsing saved bookmarks:', error)
          }
        }
        
        if (savedCompletions) {
          try {
            const parsedCompletions = JSON.parse(savedCompletions)
            if (Array.isArray(parsedCompletions)) {
              setCompletions(parsedCompletions)
            }
          } catch (error) {
            console.error('Error parsing saved completions:', error)
          }
        }

        // Load subjects and topics from database
        try {
          const [subjectsResponse, topicsResponse] = await Promise.all([
            fetch('/api/quiz-subjects'),
            fetch('/api/quiz-topics')
          ])

          if (subjectsResponse.ok) {
            const subjectsData = await subjectsResponse.json()
            setSubjects(subjectsData)
          }

          if (topicsResponse.ok) {
            const topicsData = await topicsResponse.json()
            setTopics(topicsData)
          }
        } catch (error) {
          console.error('Error loading subjects/topics:', error)
        }
      } catch (error) {
        console.error('Error loading quiz data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Save data to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem('quizzes', JSON.stringify(quizzes))
    } catch (error) {
      console.error('Error saving quizzes to localStorage:', error)
    }
  }, [quizzes])

  useEffect(() => {
    try {
      localStorage.setItem('quizBookmarks', JSON.stringify(bookmarks))
    } catch (error) {
      console.error('Error saving bookmarks to localStorage:', error)
    }
  }, [bookmarks])

  useEffect(() => {
    try {
      localStorage.setItem('quizCompletions', JSON.stringify(completions))
    } catch (error) {
      console.error('Error saving completions to localStorage:', error)
    }
  }, [completions])

  const createQuiz = (quizData: Omit<Quiz, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log('=== CREATING QUIZ ===')
    console.log('Quiz data:', quizData)
    
    const newQuiz: Quiz = {
      ...quizData,
      id: `quiz-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }
    
    console.log('New quiz object:', newQuiz)
    
    setQuizzes(prev => {
      const updatedQuizzes = [...prev, newQuiz]
      console.log('Updated quizzes array:', updatedQuizzes)
      
      // Immediately save to localStorage
      try {
        localStorage.setItem('quizzes', JSON.stringify(updatedQuizzes))
        console.log('✅ Quiz saved to localStorage successfully')
      } catch (error) {
        console.error('❌ Error saving quiz to localStorage:', error)
      }
      return updatedQuizzes
    })
  }

  const updateQuiz = (id: string, updatedQuiz: Partial<Quiz>) => {
    setQuizzes(prev => prev.map(quiz => 
      quiz.id === id ? { ...quiz, ...updatedQuiz, updatedAt: Date.now() } : quiz
    ))
  }

  const deleteQuiz = (id: string) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this quiz?")
    if (!confirmDelete) return

    setQuizzes(prev => prev.filter(quiz => quiz.id !== id))
    // Also remove bookmarks and completions for this quiz
    setBookmarks(prev => prev.filter(bookmark => bookmark.quizId !== id))
    setCompletions(prev => prev.filter(completion => completion.quizId !== id))
  }

  const toggleBookmark = (quizId: string) => {
    setBookmarks(prev => {
      const existingBookmark = prev.find(b => b.quizId === quizId)
      if (existingBookmark) {
        return prev.filter(b => b.quizId !== quizId)
      } else {
        const newBookmark: QuizBookmark = {
          id: `bookmark-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
          userId: 1, // TODO: Get actual user ID
          quizId,
          createdAt: Date.now(),
        }
        return [...prev, newBookmark]
      }
    })
  }

  const markAsCompleted = (quizId: string, score: number, timeSpent: number, answers: string[]) => {
    const quiz = quizzes.find(q => q.id === quizId)
    if (!quiz) return

    const completion: QuizCompletion = {
      id: `completion-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
      userId: 1, // TODO: Get actual user ID
      quizId,
      score,
      totalQuestions: quiz.questions.length,
      timeSpent,
      completedAt: Date.now(),
      answers,
    }

    setCompletions(prev => {
      const existingCompletion = prev.find(c => c.quizId === quizId)
      if (existingCompletion) {
        return prev.map(c => c.quizId === quizId ? completion : c)
      } else {
        return [...prev, completion]
      }
    })
  }

  const getFilteredQuizzes = (): QuizWithDetails[] => {
    let filtered = quizzes.map(quiz => {
      const subject = subjects.find(s => s.id === quiz.subjectId)
      const topic = topics.find(t => t.id === quiz.topicId)
      const isBookmarked = bookmarks.some(b => b.quizId === quiz.id)
      const completion = completions.find(c => c.quizId === quiz.id)
      
      return {
        ...quiz,
        subject,
        topic,
        isBookmarked,
        isCompleted: !!completion,
        completionScore: completion?.score,
      }
    })

    // Filter by subject
    if (selectedSubject) {
      filtered = filtered.filter(quiz => quiz.subjectId === selectedSubject)
    }

    // Filter by topic
    if (selectedTopic) {
      filtered = filtered.filter(quiz => quiz.topicId === selectedTopic)
    }

    // Filter by difficulty
    if (selectedDifficulty) {
      filtered = filtered.filter(quiz => quiz.difficulty === selectedDifficulty)
    }

    // Filter by bookmarked
    if (showBookmarked) {
      filtered = filtered.filter(quiz => quiz.isBookmarked)
    }

    // Filter by completed
    if (showCompleted) {
      filtered = filtered.filter(quiz => quiz.isCompleted)
    }

    return filtered
  }

  const clearFilters = () => {
    setSelectedSubject(null)
    setSelectedTopic(null)
    setSelectedDifficulty(null)
    setShowBookmarked(false)
    setShowCompleted(false)
  }

  const resetQuizData = () => {
    localStorage.removeItem('quizzes')
    localStorage.removeItem('quizBookmarks')
    localStorage.removeItem('quizCompletions')
    setQuizzes([])
    setBookmarks([])
    setCompletions([])
    // Reload sample quizzes without page reload
    const sampleQuizzes = fetchSampleQuizzes()
    setQuizzes(sampleQuizzes)
  }

  const checkLocalStorageStatus = () => {
    console.log('🔍 Checking localStorage status...')
    const savedQuizzes = localStorage.getItem('quizzes')
    const savedBookmarks = localStorage.getItem('quizBookmarks')
    const savedCompletions = localStorage.getItem('quizCompletions')
    
    console.log('📊 localStorage status:')
    console.log('- Quizzes:', savedQuizzes ? JSON.parse(savedQuizzes).length : 0, 'quizzes')
    console.log('- Bookmarks:', savedBookmarks ? JSON.parse(savedBookmarks).length : 0, 'bookmarks')
    console.log('- Completions:', savedCompletions ? JSON.parse(savedCompletions).length : 0, 'completions')
    
    return {
      quizzes: savedQuizzes ? JSON.parse(savedQuizzes) : [],
      bookmarks: savedBookmarks ? JSON.parse(savedBookmarks) : [],
      completions: savedCompletions ? JSON.parse(savedCompletions) : []
    }
  }

  const value: QuizzesContextType = {
    quizzes: getFilteredQuizzes(),
    subjects,
    topics,
    bookmarks,
    completions,
    selectedSubject,
    selectedTopic,
    selectedDifficulty,
    showBookmarked,
    showCompleted,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    toggleBookmark,
    markAsCompleted,
    setSelectedSubject,
    setSelectedTopic,
    setSelectedDifficulty,
    setShowBookmarked,
    setShowCompleted,
    getFilteredQuizzes,
    isLoading,
    clearFilters,
    resetQuizData,
    checkLocalStorageStatus,
  }

  return (
    <QuizzesContext.Provider value={value}>
      {children}
    </QuizzesContext.Provider>
  )
}
