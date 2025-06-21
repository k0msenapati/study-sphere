"use client"

import { motion } from "framer-motion"
import { Sparkles, Zap, Target, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const solutions = [
  {
    icon: Sparkles,
    title: "AI-Powered Automation",
    description: "Automatically generate comprehensive notes, flashcards, and quizzes from any content in seconds."
  },
  {
    icon: Target,
    title: "Personalized Learning",
    description: "Adaptive AI that learns your style and creates customized study materials just for you."
  },
  {
    icon: Zap,
    title: "Instant Feedback",
    description: "Get immediate explanations, corrections, and guidance from your personal AI study buddy."
  },
  {
    icon: Heart,
    title: "Engaging Experience",
    description: "Make studying enjoyable with interactive content and gamified learning experiences."
  }
]

export default function SolutionSection() {
  return (    <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-4">            The{" "}
            <span className="bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
              Smart Solution
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Study Sphere revolutionizes learning with AI-powered tools that adapt to your unique needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="relative group"
            >              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
              <div className="relative bg-card/80 backdrop-blur-sm p-8 rounded-lg border border-primary/20">
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-emerald-500/20 rounded-lg mr-4 border border-emerald-500/30">
                    <solution.icon className="h-6 w-6 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-semibold">{solution.title}</h3>
                </div>
                <p className="text-muted-foreground">{solution.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="inline-flex flex-col items-center justify-center p-8 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 rounded-2xl border border-green-200 dark:border-green-800">
            <p className="text-lg font-medium text-green-700 dark:text-green-400 mb-6">
              ✨ Join 10,000+ students who've already transformed their learning
            </p>
            <Button 
              size="lg" 
              asChild
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8"
            >
              <Link href="/dashboard">
                Start Your Transformation Today
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
