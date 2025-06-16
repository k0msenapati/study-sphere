"use client"

import { QuizzesProvider } from "@/lib/quizzes/quizzes-provider"

export default function QuizzesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <QuizzesProvider>{children}</QuizzesProvider>
}
