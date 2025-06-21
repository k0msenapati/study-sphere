"use client";

import { cn } from "@/lib/utils"
import { DashboardThemeToggle } from "./ui/dashboard-theme-toggle"
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  useMotionValue,
  AnimatePresence,
  animate,
} from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const Navbar = () => {
  const [isHidden, setIsHidden] = useState(false);
  const [height, setHeight] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [isNavExpanded, setIsNavExpanded] = useState(false)
  const [target, setTarget] = useState(300);
  const { scrollY } = useScroll();
  const lastYRef = useRef(0);

  const navbarWidth = useMotionValue(65);

  // Handle window object safely for hydration
  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      if (window.innerWidth < 640) {
        setTarget(300);
      } else {
        setTarget(500);
      }
    }
  }, []);

  const routesOpacity = useTransform(navbarWidth, [65, target], [0, 1]);

  useMotionValueEvent(scrollY, "change", (y) => {
    const difference = y - lastYRef.current;

    if (difference > 50) {
      // animate(navbarWidth, target, { duration: 0.25 });
      setIsHidden(false);
    } else {
      // animate(navbarWidth, 65, { duration: 0.25 });
      setIsHidden(true);
    }

    setHeight(difference);
  });

  const firstNavVariants = {
    hidden: {
      width: 65,
      background: "transparent",
    },
    visible: {
      width: target,
      background: "rgb(0,0,0,0.5)",
    },
  };

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
  ];

  // Don't render until mounted to avoid hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <motion.nav
      animate={height > 50 && !isHidden ? "visible" : "hidden"}
      whileHover="visible"
      initial="hidden"
      exit="hidden"
      onFocusCapture={() => setIsHidden(false)}
      variants={firstNavVariants}
      onUpdate={(latest) => {
        if (latest.width) {
          const widthValue =
            typeof latest.width === "string" ? parseFloat(latest.width) : latest.width
          navbarWidth.set(widthValue)
          setIsNavExpanded(widthValue > 70)
        }
      }}
      transition={{ duration: 0.25 }}
      className={cn(
        "fixed text-neutral-700 p-[10px] z-[10000000000] h-[65px]  backdrop-blur bottom-10 left-0 right-0 mx-auto overflow-hidden rounded-lg flex items-center sm:justify-between justify-start pr-6 gap-0"
      )}
    >
      <motion.div
        animate={{
          height: 50,
        }}
        className="bg-black rounded-lg max-w-[50px] min-w-[50px] flex items-center justify-center"
      >
        <div className="h-4 rounded w-4 bg-white rotate-45" />
      </motion.div>
      <div className="sm:mr-10 mr-4" />
      <AnimatePresence>
        {isNavExpanded && (
          <motion.ul className="flex items-center sm:gap-8 gap-2 w-fit">
            {routes.map((route, i) => (
              <Link key={route.url} href={route.url} className="text-foreground">
                <motion.li
                  key={i}
                  className="text-foreground sm:text-lg text-xs cursor-pointer"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{
                    opacity: routesOpacity,
                  }}
                  transition={{
                    delay: 0.1 * i,
                  }}
                >
                  {route.text}
                </motion.li>
              </Link>
            ))}
            {/* Theme toggle at the end */}
            <motion.li
              className="text-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                opacity: routesOpacity,
              }}
              transition={{
                delay: 0.1 * routes.length,
              }}
            >
              <DashboardThemeToggle />
            </motion.li>
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
