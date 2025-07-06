"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  BookOpen,
  MessageSquare,
  CheckSquare,
  CreditCard,
  Layers,
  BarChart3,
  User,
  Settings,
  LogOut,
  Menu,
  ChevronLeft
} from "lucide-react"
import { useState } from "react"
import Logout from "@/components/auth/Logout"
import { ThemeToggleButtonWithDB } from "@/components/theme-toggle-with-db"

interface SidebarProps {
  session: {
    userId: number
    email: string
  }
}

const sidebarNavItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Notes",
    href: "/dashboard/notes",
    icon: BookOpen,
  },
  {
    title: "Chat",
    href: "/dashboard/chat",
    icon: MessageSquare,
  },
  {
    title: "Tasks",
    href: "/dashboard/todos",
    icon: CheckSquare,
  },
  {
    title: "Flashcards",
    href: "/dashboard/flashcards",
    icon: CreditCard,
  },
  {
    title: "Decks",
    href: "/dashboard/decks",
    icon: Layers,
  },
  {
    title: "Quizzes",
    href: "/dashboard/quizzes",
    icon: BarChart3,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
]

export function Sidebar({ session }: SidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <motion.div 
      className="relative flex h-full flex-col border-r border-border bg-card shadow-sm"
      initial={{ width: 256 }}
      animate={{ 
        width: collapsed ? 64 : 256,
        boxShadow: collapsed ? "none" : "0 0 10px rgba(0,0,0,0.1)"
      }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      {/* Header */}
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, delay: 0.1 }}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <BookOpen className="h-4 w-4" />
              </div>
              <span className="font-semibold">StudySphere</span>
            </motion.div>
          )}
        </AnimatePresence>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 hover:bg-muted transition-colors"
          title={collapsed ? "Expand sidebar (Show navigation labels)" : "Collapse sidebar (Hide navigation labels)"}
        >
          <motion.div
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ChevronLeft className="h-4 w-4" />
          </motion.div>
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-2">
          {sidebarNavItems.map((item, index) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Link href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start gap-3 relative overflow-hidden transition-all duration-200",
                      collapsed && "justify-center px-2",
                      isActive && "bg-secondary text-secondary-foreground font-medium",
                      !isActive && "hover:bg-muted/50 hover:translate-x-1"
                    )}
                    title={collapsed ? item.title : undefined}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2, delay: 0.1 }}
                          className="truncate"
                        >
                          {item.title}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </Link>
              </motion.div>
            )
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-border p-4">
        <div className="space-y-3">
          {/* Theme and Logout row */}
          <div className={cn(
            "flex items-center gap-2",
            collapsed ? "justify-center flex-col space-y-2" : "justify-between"
          )}>
            <ThemeToggleButtonWithDB />
            <Logout />
          </div>
          
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Separator className="my-2" />
                <div className="flex items-center gap-3 rounded-lg p-2 bg-muted/50">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                    {session.email.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{session.email}</p>
                    <p className="text-xs text-muted-foreground">Student</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}
