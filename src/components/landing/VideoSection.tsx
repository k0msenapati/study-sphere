"use client"

import { motion } from "framer-motion"
import { Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export default function VideoSection() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (    <section className="py-24 bg-slate-900/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-4">            See Study Sphere in{" "}
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Action
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Watch how AI transforms the way you study, take notes, and prepare for exams
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative max-w-4xl mx-auto"
        >          <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-primary/20 shadow-2xl shadow-blue-500/10">
            {!isPlaying ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  size="lg"
                  onClick={() => setIsPlaying(true)}
                  className="rounded-full w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-2xl shadow-blue-500/25 hover:shadow-purple-500/25 transition-all duration-300"
                >
                  <Play className="h-8 w-8 ml-1" fill="currentColor" />
                </Button>
                  {/* Decorative elements */}
                <div className="absolute top-8 left-8 w-4 h-4 bg-blue-400 rounded-full opacity-80 animate-pulse" />
                <div className="absolute top-12 right-12 w-3 h-3 bg-purple-400 rounded-full opacity-60 animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-8 left-12 w-2 h-2 bg-cyan-400 rounded-full opacity-70 animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute bottom-12 right-8 w-5 h-5 bg-pink-400 rounded-full opacity-50 animate-pulse" style={{ animationDelay: '0.5s' }} />
                
                {/* Mock interface elements */}
                <div className="absolute top-4 left-4 right-4 h-2 bg-primary/20 rounded-full" />
                <div className="absolute top-8 left-4 w-32 h-1 bg-primary/30 rounded-full" />
                <div className="absolute bottom-4 left-4 right-4 h-12 bg-primary/5 rounded-lg border border-primary/20" />
              </div>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-black">
                <p className="text-white text-lg">Video would play here</p>
              </div>
            )}
          </div>
          
          {/* Floating elements */}          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="absolute -top-4 -left-4 bg-blue-500 text-white p-3 rounded-lg shadow-lg border border-blue-400/50 backdrop-blur-sm"
          >
            📚 AI Notes
          </motion.div>
          
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 1 }}
            className="absolute -top-4 -right-4 bg-purple-500 text-white p-3 rounded-lg shadow-lg border border-purple-400/50 backdrop-blur-sm"
          >
            🤖 Study Buddy
          </motion.div>
          
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: 2 }}
            className="absolute -bottom-4 -left-4 bg-cyan-500 text-white p-3 rounded-lg shadow-lg border border-cyan-400/50 backdrop-blur-sm"
          >
            ⚡ Quick Quiz
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
