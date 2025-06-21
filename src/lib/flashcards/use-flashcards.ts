import { useCallback } from 'react'
import { useFlashcards } from './flashcards-provider'
import { Flashcard, FlashcardSet, FlashcardGenerationRequest, StudySession } from './types'

export function useFlashcardsOperations() {
  const { state, dispatch } = useFlashcards()

  const generateFlashcards = useCallback(async (request: FlashcardGenerationRequest): Promise<FlashcardSet> => {
    dispatch({ type: 'SET_GENERATING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })

    try {
      // Use fetch to call CopilotKit's AI generation
      const response = await fetch('/api/copilotkit/generate-flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studyMaterial: request.studyMaterial,
          numberOfCards: request.numberOfCards,
          difficulty: request.difficulty,
          focusArea: request.focusArea
        })
      })

      if (!response.ok) {
        throw new Error(`Failed to generate flashcards: ${response.statusText}`)
      }

      const aiGeneratedFlashcards = await response.json()
      
      // Transform AI response into our flashcard format
      const flashcards: Flashcard[] = aiGeneratedFlashcards.flashcards.map((card: any, i: number) => ({
        id: `card-${Date.now()}-${i}`,
        question: card.question,
        answer: card.answer,
        difficulty: request.difficulty,
        topic: card.topic || request.focusArea,
        createdAt: new Date(),
        correctCount: 0,
        incorrectCount: 0,
        tags: card.tags || []
      }))

      const newSet: FlashcardSet = {
        id: `set-${Date.now()}`,
        title: `AI Flashcards from ${new Date().toLocaleDateString()}`,
        description: `Generated ${request.numberOfCards} ${request.difficulty} difficulty flashcards focusing on ${request.focusArea}`,
        flashcards,
        createdAt: new Date(),
        updatedAt: new Date(),
        studyMaterial: request.studyMaterial,
        settings: {
          numberOfCards: request.numberOfCards,
          difficulty: request.difficulty,
          focusArea: request.focusArea
        }
      }

      dispatch({ type: 'ADD_FLASHCARD_SET', payload: newSet })
      dispatch({ type: 'SET_CURRENT_SET', payload: newSet })
      
      return newSet
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate flashcards'
      dispatch({ type: 'SET_ERROR', payload: errorMessage })
      throw error
    } finally {
      dispatch({ type: 'SET_GENERATING', payload: false })
    }
  }, [dispatch])

  const updateFlashcardStats = useCallback((flashcardId: string, result: 'correct' | 'incorrect') => {
    dispatch({ type: 'UPDATE_FLASHCARD_STATS', payload: { flashcardId, result } })
  }, [dispatch])

  const startStudySession = useCallback((flashcardSetId: string): StudySession => {
    const session: StudySession = {
      id: `session-${Date.now()}`,
      flashcardSetId,
      startTime: new Date(),
      results: {},
      totalCards: 0,
      correctAnswers: 0,
      incorrectAnswers: 0
    }

    dispatch({ type: 'SET_CURRENT_SESSION', payload: session })
    return session
  }, [dispatch])

  const endStudySession = useCallback((results: { [flashcardId: string]: 'correct' | 'incorrect' | 'partial' }) => {
    if (!state.currentSession) return

    const correctCount = Object.values(results).filter(r => r === 'correct').length
    const incorrectCount = Object.values(results).filter(r => r === 'incorrect').length

    const updatedSession: StudySession = {
      ...state.currentSession,
      endTime: new Date(),
      results,
      totalCards: Object.keys(results).length,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount
    }

    dispatch({ type: 'SET_CURRENT_SESSION', payload: updatedSession })
    
    // Update individual flashcard stats
    Object.entries(results).forEach(([flashcardId, result]) => {
      if (result === 'correct' || result === 'incorrect') {
        updateFlashcardStats(flashcardId, result)
      }
    })

    return updatedSession
  }, [state.currentSession, dispatch, updateFlashcardStats])

  const setCurrentSet = useCallback((set: FlashcardSet | null) => {
    dispatch({ type: 'SET_CURRENT_SET', payload: set })
  }, [dispatch])

  const deleteFlashcardSet = useCallback((setId: string) => {
    dispatch({ type: 'DELETE_FLASHCARD_SET', payload: setId })
  }, [dispatch])

  const exportFlashcards = useCallback((flashcardSet: FlashcardSet, format: 'json' | 'csv' = 'json') => {
    if (format === 'json') {
      const dataStr = JSON.stringify(flashcardSet, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${flashcardSet.title.replace(/[^a-z0-9]/gi, '_')}.json`
      link.click()
      URL.revokeObjectURL(url)
    } else if (format === 'csv') {
      const csvContent = [
        'Question,Answer,Difficulty,Topic,Correct Count,Incorrect Count',
        ...flashcardSet.flashcards.map(card => 
          `"${card.question}","${card.answer}","${card.difficulty}","${card.topic}",${card.correctCount},${card.incorrectCount}`
        )
      ].join('\n')
      
      const dataBlob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${flashcardSet.title.replace(/[^a-z0-9]/gi, '_')}.csv`
      link.click()
      URL.revokeObjectURL(url)
    }
  }, [])

  return {
    // State
    flashcardSets: state.flashcardSets,
    currentSet: state.currentSet,
    currentSession: state.currentSession,
    isGenerating: state.isGenerating,
    error: state.error,
    
    // Operations
    generateFlashcards,
    updateFlashcardStats,
    startStudySession,
    endStudySession,
    setCurrentSet,
    deleteFlashcardSet,
    exportFlashcards
  }
}
