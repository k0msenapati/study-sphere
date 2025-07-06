"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Quote, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

const motivationalQuotes = [
  {
    text: "The best way to predict the future is to create it.",
    author: "Peter Drucker"
  },
  {
    text: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier"
  },
  {
    text: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela"
  },
  {
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    text: "Learning never exhausts the mind.",
    author: "Leonardo da Vinci"
  },
  {
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes"
  },
  {
    text: "Don't watch the clock; do what it does. Keep going.",
    author: "Sam Levenson"
  },
  {
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill"
  },
  {
    text: "The beautiful thing about learning is that no one can take it away from you.",
    author: "B.B. King"
  },
  {
    text: "Believe you can and you're halfway there.",
    author: "Theodore Roosevelt"
  }
]

export function DynamicQuote() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [isChanging, setIsChanging] = useState(false)

  const currentQuote = motivationalQuotes[currentQuoteIndex]

  // Auto-change quote every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      changeQuote()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [currentQuoteIndex])

  const changeQuote = () => {
    setIsChanging(true)
    setTimeout(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % motivationalQuotes.length)
      setIsChanging(false)
    }, 300)
  }

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuoteIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="flex items-start gap-4"
        >
          <Quote className="shrink-0 text-primary text-2xl mt-1" />
          <div className="flex-1">
            <blockquote className="text-lg md:text-xl font-medium text-foreground leading-relaxed">
              "{currentQuote.text}"
            </blockquote>
            <cite className="text-sm text-muted-foreground mt-2 block">
              — {currentQuote.author}
            </cite>
          </div>
        </motion.div>
      </AnimatePresence>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={changeQuote}
        disabled={isChanging}
        className="absolute top-0 right-0 h-8 w-8 p-0 hover:bg-primary/10"
      >
        <RefreshCw className={`h-4 w-4 ${isChanging ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  )
}
