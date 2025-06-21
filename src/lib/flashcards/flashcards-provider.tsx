"use client"

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react'
import { Flashcard, FlashcardSet, StudySession } from './types'

interface FlashcardsState {
  flashcardSets: FlashcardSet[]
  currentSet: FlashcardSet | null
  currentSession: StudySession | null
  isGenerating: boolean
  error: string | null
}

type FlashcardsAction =
  | { type: 'SET_FLASHCARD_SETS'; payload: FlashcardSet[] }
  | { type: 'ADD_FLASHCARD_SET'; payload: FlashcardSet }
  | { type: 'UPDATE_FLASHCARD_SET'; payload: FlashcardSet }
  | { type: 'DELETE_FLASHCARD_SET'; payload: string }
  | { type: 'SET_CURRENT_SET'; payload: FlashcardSet | null }
  | { type: 'SET_CURRENT_SESSION'; payload: StudySession | null }
  | { type: 'SET_GENERATING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_FLASHCARD_STATS'; payload: { flashcardId: string; result: 'correct' | 'incorrect' } }

const initialState: FlashcardsState = {
  flashcardSets: [],
  currentSet: null,
  currentSession: null,
  isGenerating: false,
  error: null,
}

function flashcardsReducer(state: FlashcardsState, action: FlashcardsAction): FlashcardsState {
  switch (action.type) {
    case 'SET_FLASHCARD_SETS':
      return { ...state, flashcardSets: action.payload }
    
    case 'ADD_FLASHCARD_SET':
      return { 
        ...state, 
        flashcardSets: [...state.flashcardSets, action.payload] 
      }
    
    case 'UPDATE_FLASHCARD_SET':
      return {
        ...state,
        flashcardSets: state.flashcardSets.map(set => 
          set.id === action.payload.id ? action.payload : set
        ),
        currentSet: state.currentSet?.id === action.payload.id ? action.payload : state.currentSet
      }
    
    case 'DELETE_FLASHCARD_SET':
      return {
        ...state,
        flashcardSets: state.flashcardSets.filter(set => set.id !== action.payload),
        currentSet: state.currentSet?.id === action.payload ? null : state.currentSet
      }
    
    case 'SET_CURRENT_SET':
      return { ...state, currentSet: action.payload }
    
    case 'SET_CURRENT_SESSION':
      return { ...state, currentSession: action.payload }
    
    case 'SET_GENERATING':
      return { ...state, isGenerating: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    case 'UPDATE_FLASHCARD_STATS':
      if (!state.currentSet) return state
      
      const updatedSet = {
        ...state.currentSet,
        flashcards: state.currentSet.flashcards.map(card => 
          card.id === action.payload.flashcardId
            ? {
                ...card,
                lastReviewed: new Date(),
                correctCount: action.payload.result === 'correct' ? card.correctCount + 1 : card.correctCount,
                incorrectCount: action.payload.result === 'incorrect' ? card.incorrectCount + 1 : card.incorrectCount
              }
            : card
        )
      }
      
      return {
        ...state,
        currentSet: updatedSet,
        flashcardSets: state.flashcardSets.map(set => 
          set.id === updatedSet.id ? updatedSet : set
        )
      }
    
    default:
      return state
  }
}

const FlashcardsContext = createContext<{
  state: FlashcardsState
  dispatch: React.Dispatch<FlashcardsAction>
} | null>(null)

export function FlashcardsProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(flashcardsReducer, initialState)

  // Load flashcard sets from localStorage on mount
  useEffect(() => {
    const savedSets = localStorage.getItem('flashcard-sets')
    if (savedSets) {
      try {
        const parsedSets = JSON.parse(savedSets).map((set: any) => ({
          ...set,
          createdAt: new Date(set.createdAt),
          updatedAt: new Date(set.updatedAt),
          flashcards: set.flashcards.map((card: any) => ({
            ...card,
            createdAt: new Date(card.createdAt),
            lastReviewed: card.lastReviewed ? new Date(card.lastReviewed) : undefined
          }))
        }))
        dispatch({ type: 'SET_FLASHCARD_SETS', payload: parsedSets })
      } catch (error) {
        console.error('Error loading flashcard sets:', error)
      }
    }
  }, [])

  // Save flashcard sets to localStorage whenever they change
  useEffect(() => {
    if (state.flashcardSets.length > 0) {
      localStorage.setItem('flashcard-sets', JSON.stringify(state.flashcardSets))
    }
  }, [state.flashcardSets])

  return (
    <FlashcardsContext.Provider value={{ state, dispatch }}>
      {children}
    </FlashcardsContext.Provider>
  )
}

export function useFlashcards() {
  const context = useContext(FlashcardsContext)
  if (!context) {
    throw new Error('useFlashcards must be used within a FlashcardsProvider')
  }
  return context
}
