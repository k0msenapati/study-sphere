"use client"

import { cn } from "@/lib/utils"
import { motion, useMotionValueEvent, useScroll, useTransform, useMotionValue, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import LogoutButton from "@/components/auth/Logout"

interface NavbarProps {
  session: {
    email: string
    userId: string
  }
}

const Navbar = ({ session }: NavbarProps) => {
  const [isHidden, setIsHidden] = useState(false)
  const [height, setHeight] = useState(0)
  const [mounted, setMounted] = useState(false)
  const { scrollY } = useScroll()
  const lastYRef = useRef(0)

  const navbarWidth = useMotionValue(100)
  const routesOpacity = useTransform(navbarWidth, [65, 500], [0, 1])

  useEffect(() => {
    setMounted(true)
  }, [])

  useMotionValueEvent(scrollY, "change", y => {
    const difference = y - lastYRef.current

    if (difference > 50) {
      setIsHidden(false)
    } else {
      setIsHidden(true)
    }

    setHeight(difference)
  })

  const firstNavVariants = {
    hidden: {
      width: 50,
      background: "transparent",
    },
    visible: {
      width: 900,
      background: "rgba(0, 0, 0, 0.5)",
    },
  }

  const routes = [
    { text: "Dashboard", url: "/dashboard" },
    { text: "Quizzes", url: "/dashboard/quizzes" },
    { text: "Notes", url: "/dashboard/notes" },
    { text: "Chat", url: "/dashboard/chat" },
  ]

  return (
    <motion.nav
      animate={height > 50 && !isHidden ? "visible" : "hidden"}
      whileHover="visible"
      initial="hidden"
      exit="hidden"
      onFocusCapture={() => setIsHidden(false)}
      variants={firstNavVariants}
      transition={{ duration: 0.25 }}
      className={cn(
        "fixed text-neutral-700 p-[10px] z-[10000000000] h-[65px] w-full backdrop-blur bottom-10 left-0 right-0 mx-auto overflow-hidden rounded-lg flex items-center justify-between pr-6"
      )}
      style={{ width: navbarWidth }}
    >
      <motion.div
        animate={{ height: 50 }}
        className="bg-black rounded-lg max-w-[50px] min-w-[50px] flex items-center justify-center"
      >
        <div className="h-4 rounded w-4 bg-white rotate-45" />
      </motion.div>

      <div className="mr-10" />

      <AnimatePresence>
        {(height >= 0 || !isHidden) && (
          <motion.ul className="flex items-center gap-6">
            {routes.map((route, i) => (
              <Link key={i} href={route.url}>
                <motion.li
                  className="text-white text-md cursor-pointer hover:text-blue-400 transition"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ opacity: routesOpacity }}
                >
                  {route.text}
                </motion.li>
              </Link>
            ))}
            {/* Session Info & Logout */}
            <motion.li
              className="flex items-center gap-3 text-white text-sm"
              style={{ opacity: routesOpacity }}
            >
              <span className="font-semibold hidden sm:inline">{session.email}</span>
              <LogoutButton />
            </motion.li>
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
