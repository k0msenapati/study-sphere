"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Github, Twitter, Linkedin, Mail, Heart } from "lucide-react"
import Image from "next/image"
const XIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const socialLinks = [
  { name: "GitHub", href: "https://github.com/kom-senapati", icon: Github },
  { name: "X", href: "https://twitter.com/kom-senapati", icon: XIcon },,
  { name: "LinkedIn", href: "https://linkedin.com/in/kom-senapati", icon: Linkedin },
  { name: "Email", href: "mailto:contact@studysphere.com", icon: Mail }
]

export default function LandingFooter() {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4">
        {/* Minimal footer content */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <Link href="/" className="flex items-center space-x-3">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 opacity-75 blur"></div>
                  <div className="relative rounded-lg bg-background px-3 py-2 flex items-center space-x-2">
                    <Image
                      src="/study-sphere-logo1.png"
                      alt="Study Sphere Logo"
                      width={24}
                      height={24}
                      className="h-6 w-6"
                    />
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Study Sphere
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex space-x-6"
            >
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.name}</span>
                </a>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-border py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="flex items-center text-sm text-muted-foreground"
            >
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 mx-1" fill="currentColor" />
              <span>by</span>
              <a
                href="https://github.com/kom-senapati"
                className="text-primary hover:underline ml-1"
                target="_blank"
                rel="noopener noreferrer"
              >
                kom-senapati
              </a>
              <span className="mx-2">using</span>
              <span className="font-medium">CopilotKit 🪁</span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-sm text-muted-foreground"
            >
              © 2024 Study Sphere. All rights reserved.
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  )
}
