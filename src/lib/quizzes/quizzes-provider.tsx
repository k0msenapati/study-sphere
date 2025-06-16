import React, { createContext, useContext } from "react"
import { useQuizzes } from "./use-quizzes"

type QuizzesContextType = ReturnType<typeof useQuizzes>

const QuizzesContext = createContext<QuizzesContextType | undefined>(undefined)

export const QuizzesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const quizzes = useQuizzes()
  return <QuizzesContext.Provider value={quizzes}>{children}</QuizzesContext.Provider>
}

export const useQuizzesContext = () => {
  const context = useContext(QuizzesContext)
  if (!context) {
    throw new Error("useQuizzesContext must be used within a QuizzesProvider")
  }
  return context
}
