"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Sparkles, Menu, X } from "lucide-react"
import { useState } from "react"

export default function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <motion.nav 
      className="fixed top-0 z-50 w-full border-b border-primary/10 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Animated gradient border */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Link href="/" className="flex items-center space-x-3">
            <div className="relative group">
              {/* Animated glow effect */}
              <div className="absolute -inset-2 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-60 blur-lg group-hover:opacity-80 transition-all duration-500 animate-pulse"></div>
              
              {/* Logo container */}
              <div className="relative flex items-center space-x-2 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 px-4 py-2 border border-primary/30 shadow-lg">
                <div className="relative">
                  <Sparkles className="h-6 w-6 text-blue-400 animate-spin" style={{ animationDuration: '3s' }} />
                  <div className="absolute inset-0 h-6 w-6 bg-blue-400 rounded-full blur-sm opacity-30 animate-ping"></div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Study Sphere
                </span>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          {[
            { name: "Features", href: "#features" },
            { name: "Testimonials", href: "#testimonials" },
          ].map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Link 
                href={item.href} 
                className="relative text-sm font-medium text-foreground/80 hover:text-foreground transition-all duration-300 group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button variant="ghost" asChild className="relative group overflow-hidden">
              <Link href="/dashboard" className="relative z-10">
                <span className="relative z-10">Sign In</span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button asChild className="relative group overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 border-0 shadow-lg shadow-blue-500/25 hover:shadow-purple-500/25 transition-all duration-300">
              <Link href="/dashboard" className="relative z-10 flex items-center gap-2">
                <span>Get Started</span>
                <Sparkles className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" />
                
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>
            </Button>
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(!isOpen)}
            className="relative p-2"
          >
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </motion.div>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isOpen ? 1 : 0, 
          height: isOpen ? "auto" : 0 
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="md:hidden overflow-hidden bg-background/95 backdrop-blur-xl border-t border-primary/10"
      >
        <div className="container px-4 py-6 space-y-4">
          {[
            { name: "Features", href: "#features" },
            { name: "Testimonials", href: "#testimonials" },
          ].map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -20 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link 
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block text-sm font-medium text-foreground/80 hover:text-foreground transition-colors py-2"
              >
                {item.name}
              </Link>
            </motion.div>
          ))}
          
          <div className="pt-4 space-y-3">
            <Button variant="ghost" asChild className="w-full justify-start">
              <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                Sign In
              </Link>
            </Button>
            <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.nav>
  )
}
