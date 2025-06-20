"use client";

import { cn } from "@/lib/utils";
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
  const { scrollY } = useScroll();
  const lastYRef = useRef(0);

  const navbarWidth = useMotionValue(65);

  let target = 300;
  if(window.innerWidth<640) {
    target = 300
  } else {
    target = 500
  }

  const routesOpacity = useTransform(navbarWidth, [65, target], [0, 1]);

  useMotionValueEvent(scrollY, "change", (y) => {
    const difference = y - lastYRef.current;

    if (difference > 50) {
      setIsHidden(false);
      animate(navbarWidth, target, { duration: 0.25 });
    } else {
      setIsHidden(true);
      animate(navbarWidth, 65, { duration: 0.25 });
    }

    setHeight(difference);
  });

  const firstNavVariants = {
    hidden: {
      width: 65,
      background: "transparent",
    },
    vissible: {
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
        {(height >= 0 || !isHidden) && (
          <motion.ul className="flex items-center sm:gap-10 gap-4 w-fit">
            {routes.map((route, i) => (
              <Link href={route.url}>
                <motion.li
                  key={i}
                  className="text-white sm:text-xl text-xs cursor-pointer"
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
  );
};

export default Navbar;
