"use client"

import { cn } from "@/lib/utils"
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  useMotionValue,
  AnimatePresence,
} from "framer-motion"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

const Navbar = () => {
  const [isHidden, setIsHidden] = useState(false)
  const [height, setHeight] = useState(0)
  const [mounted, setMounted] = useState(false)
  const { scrollY } = useScroll()
  const lastYRef = useRef(0)

  const navbarWidth = useMotionValue(65)
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
      width: 65,
      background: "transparent",
    },
    vissible: {
      width: 500,
      background: "rgb(0,0,0,0.5)",
    },
  }

  const routes = [
    {
      text: "Dashboard",
      url: "/dashboard",
    },
    {
      text: "Quizzes",
      url: "/dashboard/quizzes",
    },
    {
      text: "Notes",
      url: "/dashboard/notes",
    },
    {
      text: "Chat",
      url: "/dashboard/chat",
    },
  ]

  return (
    <motion.nav
      animate={height > 50 && !isHidden ? "vissible" : "hidden"}
      whileHover="vissible"
      initial="hidden"
      exit="hidden"
      onFocusCapture={() => setIsHidden(false)}
      variants={firstNavVariants}
      transition={{ duration: 0.25 }}
      className={cn(
        "fixed text-neutral-700 p-[10px] z-[10000000000] h-[65px]  backdrop-blur bottom-10 left-0 right-0 mx-auto overflow-hidden rounded-lg flex items-center justify-between pr-6"
      )}
      style={{
        width: navbarWidth,
      }}
    >
      <motion.div
        animate={{
          height: 50,
        }}
        className="bg-black rounded-lg max-w-[50px] min-w-[50px] flex items-center justify-center"
      >
        <div className="h-4 rounded w-4 bg-white rotate-45" />
      </motion.div>
      <div className="mr-10" />
      <AnimatePresence>
        {(height >= 0 || !isHidden) && (
          <motion.ul className="flex items-center gap-10">
            {routes.map((route, i) => (
              <Link href={route.url}>
                <motion.li
                  key={i}
                  className="text-white text-xl cursor-pointer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    opacity: routesOpacity,
                  }}
                >
                  {route.text}
                </motion.li>
              </Link>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

export default Navbar
