"use client"

import React, { createContext, useContext, useReducer, ReactNode } from 'react'
import { Flowchart } from './types'

interface FlowchartsState {
  flowcharts: Flowchart[]
  isLoading: boolean
  error: string | null
}

type FlowchartsAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_FLOWCHARTS'; payload: Flowchart[] }
  | { type: 'ADD_FLOWCHART'; payload: Flowchart }
  | { type: 'UPDATE_FLOWCHART'; payload: Flowchart }
  | { type: 'DELETE_FLOWCHART'; payload: string }

interface FlowchartsContextType {
  state: FlowchartsState
  dispatch: React.Dispatch<FlowchartsAction>
  flowcharts: Flowchart[]
  createFlowchart: (flowchart: Flowchart) => Promise<void>
  updateFlowchart: (flowchart: Flowchart) => Promise<void>
  deleteFlowchart: (id: string) => Promise<void>
  loadFlowcharts: () => Promise<void>
}

const FlowchartsContext = createContext<FlowchartsContextType | undefined>(undefined)

function flowchartsReducer(state: FlowchartsState, action: FlowchartsAction): FlowchartsState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    
    case 'SET_FLOWCHARTS':
      return { ...state, flowcharts: action.payload }
    
    case 'ADD_FLOWCHART':
      return { 
        ...state, 
        flowcharts: [...state.flowcharts, action.payload]
      }
    
    case 'UPDATE_FLOWCHART':
      return {
        ...state,
        flowcharts: state.flowcharts.map(flowchart =>
          flowchart.id === action.payload.id ? action.payload : flowchart
        )
      }
    
    case 'DELETE_FLOWCHART':
      return {
        ...state,
        flowcharts: state.flowcharts.filter(flowchart => flowchart.id !== action.payload)
      }
    
    default:
      return state
  }
}

export function FlowchartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(flowchartsReducer, {
    flowcharts: [],
    isLoading: false,
    error: null
  })

  const loadFlowcharts = async () => {
    dispatch({ type: 'SET_LOADING', payload: true })
    dispatch({ type: 'SET_ERROR', payload: null })

    try {
      // Load flowcharts from localStorage for now
      // In a real app, this would be an API call
      const stored = localStorage.getItem('study-sphere-flowcharts')
      if (stored) {
        const flowcharts = JSON.parse(stored).map((f: any) => ({
          ...f,
          createdAt: new Date(f.createdAt),
          updatedAt: new Date(f.updatedAt)
        }))
        dispatch({ type: 'SET_FLOWCHARTS', payload: flowcharts })
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load flowcharts' })
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const createFlowchart = async (flowchart: Flowchart) => {
    dispatch({ type: 'SET_ERROR', payload: null })

    try {
      // Save to localStorage for now
      // In a real app, this would be an API call
      const updatedFlowcharts = [...state.flowcharts, flowchart]
      localStorage.setItem('study-sphere-flowcharts', JSON.stringify(updatedFlowcharts))
      dispatch({ type: 'ADD_FLOWCHART', payload: flowchart })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to create flowchart' })
      throw error
    }
  }

  const updateFlowchart = async (flowchart: Flowchart) => {
    dispatch({ type: 'SET_ERROR', payload: null })

    try {
      const updatedFlowchart = { ...flowchart, updatedAt: new Date() }
      const updatedFlowcharts = state.flowcharts.map(f =>
        f.id === flowchart.id ? updatedFlowchart : f
      )
      localStorage.setItem('study-sphere-flowcharts', JSON.stringify(updatedFlowcharts))
      dispatch({ type: 'UPDATE_FLOWCHART', payload: updatedFlowchart })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update flowchart' })
      throw error
    }
  }

  const deleteFlowchart = async (id: string) => {
    dispatch({ type: 'SET_ERROR', payload: null })

    try {
      const updatedFlowcharts = state.flowcharts.filter(f => f.id !== id)
      localStorage.setItem('study-sphere-flowcharts', JSON.stringify(updatedFlowcharts))
      dispatch({ type: 'DELETE_FLOWCHART', payload: id })
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete flowchart' })
      throw error
    }
  }

  // Load flowcharts on mount
  React.useEffect(() => {
    loadFlowcharts()
  }, [])

  const contextValue: FlowchartsContextType = {
    state,
    dispatch,
    flowcharts: state.flowcharts,
    createFlowchart,
    updateFlowchart,
    deleteFlowchart,
    loadFlowcharts
  }

  return (
    <FlowchartsContext.Provider value={contextValue}>
      {children}
    </FlowchartsContext.Provider>
  )
}

export function useFlowcharts() {
  const context = useContext(FlowchartsContext)
  if (context === undefined) {
    throw new Error('useFlowcharts must be used within a FlowchartProvider')
  }
  return context
}
