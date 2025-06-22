'use client';

import React, { createContext, useContext, useState } from 'react';
import { v4 as uuid } from 'uuid';

// Define Quiz and Question types
type QuestionType = {
  question: string;
  options: string[];
  correctIndex: number;
};

type QuizType = {
  id: string;
  title: string;
  category: string;
  questions: QuestionType[];
};

// Context Type
type QuizContextType = {
  quizzes: QuizType[];
  addQuiz: (quiz: QuizType) => void;
};

// Default Context
const QuizContext = createContext<QuizContextType | undefined>(undefined);

// Provider Component
export const QuizProvider = ({ children }) => {
  const [quizzes, setQuizzes] = useState<QuizType[]>([]);

  const addQuiz = (quiz: QuizType) => {
    setQuizzes((prev) => [...prev, quiz]);
  };

  return (
    <QuizContext.Provider value={{ quizzes, addQuiz }}>
      {children}
    </QuizContext.Provider>
  );
};

// Hook to access context
export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};
