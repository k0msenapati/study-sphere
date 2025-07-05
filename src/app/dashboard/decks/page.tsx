"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  HiOutlineSparkles, 
  HiOutlinePlus,
  HiOutlinePlay,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineBookOpen,
  HiOutlineAcademicCap,
  HiOutlineCalendar,
  HiOutlineChartBar,
  HiOutlineDocumentText
} from "react-icons/hi2"
import { FaFlipboard } from "react-icons/fa6"

interface Deck {
  id: string
  title: string
  description: string | null
  color: string
  isPublic: boolean
  tags: string // JSON string array
  studyMaterial: string | null
  totalCards: number
  lastStudied: string | null
  createdAt: string
  updatedAt: string
}

const DecksPage = () => {
  const [decks, setDecks] = useState<Deck[]>([])
  const [loading, setLoading] = useState(true)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [expandedDeckId, setExpandedDeckId] = useState<string | null>(null)
  const [newDeck, setNewDeck] = useState({
    title: "",
    description: "",
    color: "#3B82F6",
    tags: ""
  })
  const router = useRouter()

  // Helper function to safely parse tags
  const parseTags = (tagsString: string | null | undefined): string[] => {
    if (!tagsString) return []
    try {
      const parsed = JSON.parse(tagsString)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  // Toggle deck expansion
  const toggleDeckExpansion = (deckId: string) => {
    setExpandedDeckId(expandedDeckId === deckId ? null : deckId)
  }

  // Solitaire Deck Component
  const SolitaireDeck = ({ deck, index, isExpanded }: { deck: Deck, index: number, isExpanded: boolean }) => {
    const stackOffset = 3
    const cardCount = Math.min(deck.totalCards, 6) // Show max 6 cards in stack
    
    return (
      <motion.div
        key={deck.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
        className="relative"
        style={{ 
          height: isExpanded ? 'auto' : '300px',
          minHeight: '300px'
        }}
      >
        <div className="relative perspective-1000">
          {/* Stack of cards */}
          {!isExpanded && (
            <>
              {Array.from({ length: cardCount }).map((_, cardIndex) => (
                <motion.div
                  key={cardIndex}
                  className="absolute inset-0 w-full"
                  style={{
                    transform: `translate(${cardIndex * stackOffset}px, ${cardIndex * stackOffset}px)`,
                    zIndex: cardCount - cardIndex,
                  }}
                  whileHover={{
                    transform: `translate(${cardIndex * stackOffset + 2}px, ${cardIndex * stackOffset - 2}px)`,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className={`w-full h-[280px] border-2 transition-all duration-200 ${
                    cardIndex === cardCount - 1 
                      ? 'bg-gradient-to-br from-white via-blue-50 to-blue-100 dark:from-gray-800 dark:via-gray-750 dark:to-gray-700 solitaire-card-shadow-hover border-blue-200 dark:border-blue-600' 
                      : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 solitaire-card-shadow border-gray-300 dark:border-gray-600'
                  }`}>
                    <div 
                      className="h-2"
                      style={{ backgroundColor: deck.color }}
                    />
                    {cardIndex === cardCount - 1 && (
                      <div className="p-4 h-full flex flex-col bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg m-1">
                        <div className="text-center flex-1 flex flex-col justify-center">
                          <motion.div
                            animate={{ 
                              rotateY: [0, 5, -5, 0],
                              scale: [1, 1.02, 1] 
                            }}
                            transition={{ 
                              duration: 2, 
                              repeat: Infinity, 
                              repeatDelay: 3 
                            }}
                          >
                            <FaFlipboard className="mx-auto text-3xl text-gray-600 dark:text-gray-300 mb-2" />
                          </motion.div>
                          <h3 className="font-bold text-sm mb-2 line-clamp-2 text-gray-900 dark:text-white">
                            {deck.title || 'Study Deck'}
                          </h3>
                          <div className="flex flex-col items-center gap-1 mb-2">
                            <div className="flex items-center justify-center gap-1">
                              <Badge variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700">
                                {deck.totalCards} cards
                              </Badge>
                              {deck.totalCards > 0 && (
                                <Badge variant="outline" className="text-xs border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950">
                                  Ready
                                </Badge>
                              )}
                            </div>
                            {!deck.title && (
                              <Badge variant="outline" className="text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-600">
                                Needs title
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-gray-700 dark:text-gray-300 mb-2 flex items-center justify-center gap-1 font-medium">
                            <HiOutlineCalendar className="h-3 w-3" />
                            {formatDate(deck.createdAt)}
                          </div>
                          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-2 leading-tight">
                            {deck.description || "AI-generated flashcard collection"}
                          </p>
                          <div className="text-xs text-blue-700 dark:text-blue-300 font-semibold">
                            Click to expand ↗
                          </div>
                        </div>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))}
              
              {/* Click overlay */}
              <div 
                className="absolute inset-0 w-full h-[280px] cursor-pointer z-20 rounded-lg transition-all duration-200 hover:bg-blue-500/5 active:bg-blue-500/10"
                style={{
                  transform: `translate(${(cardCount - 1) * stackOffset}px, ${(cardCount - 1) * stackOffset}px)`,
                }}
                onClick={() => toggleDeckExpansion(deck.id)}
              />
            </>
          )}

          {/* Expanded view */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                transition={{ duration: 0.4, type: "spring", bounce: 0.2 }}
              >
                <Card className="overflow-hidden h-full flex flex-col hover:shadow-xl transition-all duration-300 border-2 border-blue-200 dark:border-blue-700">
                  <div 
                    className="h-3"
                    style={{ backgroundColor: deck.color }}
                  />
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl line-clamp-2 flex items-center gap-2">
                          {deck.title || (
                            <span className="text-muted-foreground italic">Untitled Deck</span>
                          )}
                          {!deck.title && (
                            <Badge variant="outline" className="text-xs bg-yellow-50 dark:bg-yellow-950/50 text-yellow-600 dark:text-yellow-400">
                              Add title
                            </Badge>
                          )}
                        </CardTitle>
                        {deck.description && (
                          <CardDescription className="mt-2 line-clamp-3">
                            {deck.description}
                          </CardDescription>
                        )}
                      </div>
                      <div className="flex gap-1 ml-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleDeckExpansion(deck.id)}
                          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          ✕
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/dashboard/decks/${deck.id}/edit`)}
                        >
                          <HiOutlinePencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteDeck(deck.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          <HiOutlineTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col">
                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-950/50">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{deck.totalCards}</div>
                        <div className="text-sm text-blue-600/70 dark:text-blue-400/70">Cards</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-950/50">
                        <div className="text-sm font-medium text-green-600 dark:text-green-400">Last Studied</div>
                        <div className="text-sm text-green-600/70 dark:text-green-400/70">{getLastStudiedText(deck.lastStudied)}</div>
                      </div>
                    </div>

                    {/* Tags */}
                    {(() => {
                      const tags = parseTags(deck.tags)
                      return tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-4">
                          {tags.slice(0, 3).map((tag: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      )
                    })()}

                    {/* Created Date */}
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <HiOutlineCalendar className="mr-1 h-4 w-4" />
                      Created {formatDate(deck.createdAt)}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-auto">
                      <Link href={`/dashboard/decks/${deck.id}/study`} className="flex-1">
                        <Button className="w-full" disabled={deck.totalCards === 0}>
                          <HiOutlinePlay className="mr-2 h-4 w-4" />
                          Study
                        </Button>
                      </Link>
                      <Link href={`/dashboard/decks/${deck.id}`}>
                        <Button variant="outline" size="icon">
                          <HiOutlineBookOpen className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    )
  }

  // Load decks on component mount
  useEffect(() => {
    fetchDecks()
  }, [])

  const fetchDecks = async () => {
    try {
      const response = await fetch('/api/decks')
      if (response.ok) {
        const data = await response.json()
        setDecks(data)
      } else {
        console.error('Failed to fetch decks')
      }
    } catch (error) {
      console.error('Error fetching decks:', error)
    } finally {
      setLoading(false)
    }
  }

  const createDeck = async () => {
    try {
      const response = await fetch('/api/decks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newDeck.title,
          description: newDeck.description,
          color: newDeck.color,
          tags: newDeck.tags ? JSON.stringify(newDeck.tags.split(',').map(tag => tag.trim())) : '[]'
        }),
      })

      if (response.ok) {
        const deck = await response.json()
        setDecks(prev => [deck, ...prev])
        setCreateDialogOpen(false)
        setNewDeck({ title: "", description: "", color: "#3B82F6", tags: "" })
      } else {
        console.error('Failed to create deck')
      }
    } catch (error) {
      console.error('Error creating deck:', error)
    }
  }

  const deleteDeck = async (deckId: string) => {
    if (!confirm('Are you sure you want to delete this deck? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/decks/${deckId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setDecks(prev => prev.filter(deck => deck.id !== deckId))
      } else {
        console.error('Failed to delete deck')
      }
    } catch (error) {
      console.error('Error deleting deck:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getLastStudiedText = (lastStudied: string | null) => {
    if (!lastStudied) return 'Never studied'
    const date = new Date(lastStudied)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return `${diffInHours} hours ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Study Decks
            </h1>
            <p className="text-lg text-muted-foreground">
              Your flashcard collections for effective learning
            </p>
          </div>
          
          <div className="flex gap-3 mt-4 md:mt-0">
            {/* Generate Flashcards Button */}
            <Link href="/dashboard/flashcards">
              <Button 
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <HiOutlineSparkles className="mr-2 h-5 w-5" />
                Generate Flashcards
              </Button>
            </Link>

            {/* Create Deck Button */}
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <HiOutlinePlus className="mr-2 h-4 w-4" />
                  Create Deck
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create New Deck</DialogTitle>
                  <DialogDescription>
                    Create a new flashcard deck to organize your study material.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Title</label>
                    <Input
                      value={newDeck.title}
                      onChange={(e) => setNewDeck(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g. Biology Chapter 3"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Description</label>
                    <Textarea
                      value={newDeck.description}
                      onChange={(e) => setNewDeck(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of the deck content"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Color</label>
                    <Select value={newDeck.color} onValueChange={(value) => setNewDeck(prev => ({ ...prev, color: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="#3B82F6">🔵 Blue</SelectItem>
                        <SelectItem value="#10B981">🟢 Green</SelectItem>
                        <SelectItem value="#F59E0B">🟡 Yellow</SelectItem>
                        <SelectItem value="#EF4444">🔴 Red</SelectItem>
                        <SelectItem value="#8B5CF6">🟣 Purple</SelectItem>
                        <SelectItem value="#06B6D4">🔵 Cyan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tags (comma-separated)</label>
                    <Input
                      value={newDeck.tags}
                      onChange={(e) => setNewDeck(prev => ({ ...prev, tags: e.target.value }))}
                      placeholder="e.g. biology, science, exam"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={createDeck}
                    disabled={!newDeck.title.trim()}
                  >
                    Create Deck
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Decks Grid */}
        {decks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <FaFlipboard className="mx-auto text-6xl text-muted-foreground mb-4" />
            <h3 className="text-2xl font-semibold text-foreground mb-2">No decks yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Create your first flashcard deck or generate AI-powered flashcards to get started with your studies.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/dashboard/flashcards">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  <HiOutlineSparkles className="mr-2 h-4 w-4" />
                  Generate Flashcards
                </Button>
              </Link>
              <Button variant="outline" onClick={() => setCreateDialogOpen(true)}>
                <HiOutlinePlus className="mr-2 h-4 w-4" />
                Create Deck
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            layout
          >
            {decks.map((deck, index) => (
              <SolitaireDeck 
                key={deck.id}
                deck={deck} 
                index={index} 
                isExpanded={expandedDeckId === deck.id}
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default DecksPage
