"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  HiOutlineArrowLeft,
  HiOutlinePlay,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlinePlus,
  HiOutlineBookOpen,
  HiOutlineCalendar
} from "react-icons/hi2"
import { FaFlipboard } from "react-icons/fa6"

interface Deck {
  id: string
  title: string
  description: string | null
  color: string
  isPublic: boolean
  tags: string
  studyMaterial: string | null
  totalCards: number
  lastStudied: string | null
  createdAt: string
  updatedAt: string
}

interface Flashcard {
  id: string
  deckId: string
  question: string
  answer: string
  difficulty: 'easy' | 'medium' | 'hard'
  topic: string
  hints: string
  explanation: string | null
  tags: string
  correctCount: number
  incorrectCount: number
  lastReviewed: string | null
  nextReview: string | null
  order: number
  createdAt: string
  updatedAt: string
}

const DeckDetailPage = () => {
  const params = useParams()
  const router = useRouter()
  const deckId = params.id as string
  
  const [deck, setDeck] = useState<Deck | null>(null)
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (deckId) {
      fetchDeck()
      fetchFlashcards()
    }
  }, [deckId])

  const fetchDeck = async () => {
    try {
      const response = await fetch(`/api/decks/${deckId}`)
      if (response.ok) {
        const data = await response.json()
        setDeck(data)
      } else {
        setError('Failed to fetch deck')
      }
    } catch (error) {
      setError('Error fetching deck')
    }
  }

  const fetchFlashcards = async () => {
    try {
      const response = await fetch(`/api/decks/${deckId}/flashcards`)
      if (response.ok) {
        const data = await response.json()
        setFlashcards(data)
      } else {
        setError('Failed to fetch flashcards')
      }
    } catch (error) {
      setError('Error fetching flashcards')
    } finally {
      setLoading(false)
    }
  }

  const deleteFlashcard = async (flashcardId: string) => {
    if (!confirm('Are you sure you want to delete this flashcard?')) {
      return
    }

    try {
      const response = await fetch(`/api/flashcards/${flashcardId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setFlashcards(prev => prev.filter(card => card.id !== flashcardId))
        if (deck) {
          setDeck(prev => prev ? { ...prev, totalCards: prev.totalCards - 1 } : null)
        }
      } else {
        console.error('Failed to delete flashcard')
      }
    } catch (error) {
      console.error('Error deleting flashcard:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const parseTags = (tagsString: string): string[] => {
    try {
      return JSON.parse(tagsString) || []
    } catch {
      return []
    }
  }

  const parseHints = (hintsString: string): string[] => {
    try {
      return JSON.parse(hintsString) || []
    } catch {
      return []
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !deck) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-foreground mb-2">Error</h3>
            <p className="text-muted-foreground mb-6">{error || 'Deck not found'}</p>
            <Link href="/dashboard/decks">
              <Button>
                <HiOutlineArrowLeft className="mr-2 h-4 w-4" />
                Back to Decks
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/dashboard/decks">
            <Button variant="outline" size="icon">
              <HiOutlineArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div 
                className="w-4 h-4 rounded"
                style={{ backgroundColor: deck.color }}
              />
              <h1 className="text-3xl font-bold text-foreground">{deck.title}</h1>
            </div>
            {deck.description && (
              <p className="text-lg text-muted-foreground">{deck.description}</p>
            )}
          </div>
          <div className="flex gap-2">
            <Link href={`/dashboard/decks/${deckId}/study`}>
              <Button disabled={flashcards.length === 0}>
                <HiOutlinePlay className="mr-2 h-4 w-4" />
                Study
              </Button>
            </Link>
            <Button variant="outline" onClick={() => router.push(`/dashboard/decks/${deckId}/edit`)}>
              <HiOutlinePencil className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Deck Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-foreground">{deck.totalCards}</div>
              <div className="text-sm text-muted-foreground">Total Cards</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-sm font-medium text-foreground">Last Studied</div>
              <div className="text-sm text-muted-foreground">
                {deck.lastStudied ? formatDate(deck.lastStudied) : 'Never'}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-sm font-medium text-foreground">Created</div>
              <div className="text-sm text-muted-foreground">{formatDate(deck.createdAt)}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-sm font-medium text-foreground">Updated</div>
              <div className="text-sm text-muted-foreground">{formatDate(deck.updatedAt)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tags */}
        {parseTags(deck.tags).length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-3">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {parseTags(deck.tags).map((tag: string, index: number) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Flashcards */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Flashcards</h2>
          <Button onClick={() => router.push('/dashboard/flashcards')}>
            <HiOutlinePlus className="mr-2 h-4 w-4" />
            Add Flashcards
          </Button>
        </div>

        {flashcards.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <FaFlipboard className="mx-auto text-6xl text-muted-foreground mb-4" />
            <h3 className="text-2xl font-semibold text-foreground mb-2">No flashcards yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Add flashcards to this deck to start studying. You can generate AI-powered flashcards or create them manually.
            </p>
            <Link href="/dashboard/flashcards">
              <Button>
                <HiOutlinePlus className="mr-2 h-4 w-4" />
                Add Flashcards
              </Button>
            </Link>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {flashcards.map((flashcard, index) => (
              <motion.div
                key={flashcard.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex gap-2 mb-2">
                        <Badge 
                          variant={flashcard.difficulty === 'easy' ? 'default' : 
                                 flashcard.difficulty === 'medium' ? 'secondary' : 'destructive'}
                        >
                          {flashcard.difficulty}
                        </Badge>
                        <Badge variant="outline">{flashcard.topic}</Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteFlashcard(flashcard.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <HiOutlineTrash className="h-4 w-4" />
                      </Button>
                    </div>
                    <CardTitle className="text-lg line-clamp-3">{flashcard.question}</CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground mb-1">Answer</p>
                        <p className="text-sm line-clamp-3">{flashcard.answer}</p>
                      </div>
                      
                      {flashcard.explanation && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Explanation</p>
                          <p className="text-sm line-clamp-2">{flashcard.explanation}</p>
                        </div>
                      )}

                      {parseHints(flashcard.hints).length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-muted-foreground mb-1">Hints</p>
                          <div className="flex flex-wrap gap-1">
                            {parseHints(flashcard.hints).slice(0, 2).map((hint: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                💡 {hint}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Stats */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
                        <span>✅ {flashcard.correctCount} correct</span>
                        <span>❌ {flashcard.incorrectCount} incorrect</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default DeckDetailPage
