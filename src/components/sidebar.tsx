import {
  Bell,
  Home,
  Menu,
  X,
  Package2,
  MessageCircle,
  BookOpen,
  ClipboardList,
} from "lucide-react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import React from "react"

export function Sidebar({ open, onClose }: { open?: boolean; onClose?: () => void }) {
  // Only render when open
  if (!open) return null;
  return (
    <>
      {/* Overlay for all screens */}
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={onClose}
        aria-label="Close sidebar overlay"
      />
      {/* Sidebar for all screens */}
      <div className="fixed z-50 top-0 left-0 h-full w-64 bg-white border-r shadow-lg transition-transform duration-200" style={{ maxWidth: 280 }}>
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <Package2 className="h-6 w-6" />
            <span className="">Study Sphere</span>
          </Link>
          <Button variant="outline" size="icon" className="ml-auto h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/quizzes"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <ClipboardList className="h-4 w-4" />
              Quizzes
            </Link>
            <Link
              href="/dashboard/notes"
              className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all hover:text-primary"
            >
              <BookOpen className="h-4 w-4" />
              Notes{" "}
            </Link>
            <Link
              href="/dashboard/chat"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
            >
              <MessageCircle className="h-4 w-4" />
              Chat
            </Link>
          </nav>
        </div>
        <div className="mt-auto p-4">
          <Card>
            <CardHeader className="p-2 pt-0 md:p-4">
              <CardTitle>Upgrade to Pro</CardTitle>
              <CardDescription>
                Unlock all features and get unlimited access to our support team.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
              <Button size="sm" className="w-full">
                Upgrade
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
} 