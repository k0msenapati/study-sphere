"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Check } from "lucide-react"
import Link from "next/link"

const benefits = [
  "Free to start, no credit card required",
  "Access to all AI-powered features",
  "24/7 study buddy support",
  "Unlimited notes and quizzes"
]

export default function CTASection() {
  return (    <section className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900" />
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center text-white"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
          >
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Limited Time Offer</span>
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl mb-6"
          >
            Ready to Transform Your
            <br />
            Study Experience?
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="text-xl opacity-90 max-w-2xl mx-auto mb-8"
          >
            Join thousands of students who have revolutionized their learning with AI-powered study tools
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto mb-8"
          >
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-300" />
                <span className="opacity-90">{benefit}</span>
              </div>
            ))}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >            <Button 
              size="lg" 
              asChild
              className="bg-white text-slate-900 hover:bg-gray-50 px-8 py-6 text-lg font-semibold shadow-2xl shadow-white/10 hover:shadow-white/20 transition-all duration-300 border-0"
            >
              <Link href="/dashboard" className="flex items-center gap-2">
                Start Learning for Free
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            
            <div className="text-sm opacity-75">
              No credit card required • 2 minutes setup
            </div>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Decorative elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-10 left-10 w-20 h-20 border border-white/20 rounded-full"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-10 right-10 w-16 h-16 border border-white/20 rounded-full"
      />
      <motion.div
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-20 w-4 h-4 bg-white/20 rounded-full"
      />
      <motion.div
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 right-20 w-6 h-6 bg-white/10 rounded-full"
      />
    </section>
  )
}
