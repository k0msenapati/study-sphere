"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Spotlight from "@/components/ui/spotlight"
import { motion } from "framer-motion"
import { ArrowRight, Play } from "lucide-react"
import Image from "next/image"

export default function HeroSection() {
  return (    <section className="relative overflow-hidden py-24 lg:py-32">
      {/* Spotlight Effect */}
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="rgba(59, 130, 246, 0.5)"
      />
      
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-primary/5 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.2),rgba(0,0,0,0))]" />
      
      <div className="container relative z-10 mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 flex justify-center"
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-20 blur-xl animate-pulse"></div>
              <Image
                src="/study-sphere-logo1.png"
                alt="Study Sphere Logo"
                width={120}
                height={120}
                className="relative h-20 w-20 sm:h-24 sm:w-24 lg:h-30 lg:w-30"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 inline-flex items-center rounded-full border border-primary/20 bg-primary/10 backdrop-blur-sm px-4 py-2 text-sm"
          >
            🚀 AI-Powered Learning Platform
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          >            Revolutionize Your{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Study Routine
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-8 text-xl text-muted-foreground sm:text-2xl"
          >
            Enhance your learning experience with AI-powered notes, quizzes, and a personal study
            buddy that adapts to your unique learning style.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >            <Button 
              size="lg" 
              asChild
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-6 text-lg shadow-2xl shadow-blue-500/25 border-0"
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                Get Started Free 
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            
            <Button 
              size="lg" 
              variant="outline"
              className="flex items-center gap-2 px-8 py-6 text-lg border-primary/30 bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/50"
            >
              <Play className="h-5 w-5" />
              Watch Demo
            </Button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-16"
          >
            <p className="text-sm text-muted-foreground mb-4">Trusted by 10,000+ students worldwide</p>
            <div className="flex justify-center items-center space-x-8 opacity-60">
              <div className="text-2xl font-bold">🎓</div>
              <div className="text-2xl font-bold">📚</div>
              <div className="text-2xl font-bold">🧠</div>
              <div className="text-2xl font-bold">⚡</div>
              <div className="text-2xl font-bold">🚀</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
