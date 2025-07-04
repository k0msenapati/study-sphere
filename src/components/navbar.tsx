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
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import { useRef, useState, useEffect } from "react";
import Logout from "../components/auth/Logout";

interface NavbarProps {
  session: {
    userId: number;
    email: string;
  };
}

const Navbar: React.FC<NavbarProps> = ({ session }) =>  {
  const [isHidden, setIsHidden] = useState(false);
  const [height, setHeight] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { scrollY } = useScroll();
  const lastYRef = useRef(0);
  const navbarWidth = useMotionValue(65);

  const target = 650;
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const routesOpacity = useTransform(navbarWidth, [65, target], [0, 1]);

  useMotionValueEvent(scrollY, "change", (y) => {
    if (!isMobile) {
      const difference = y - lastYRef.current;
      if (difference > 50) {
        setIsHidden(false);
        animate(navbarWidth, target, { duration: 0.25 });
      } else {
        setIsHidden(true);
        animate(navbarWidth, 65, { duration: 0.25 });
      }
      setHeight(difference);
    }
  });

  const firstNavVariants = {
    hidden: {
      width: 65,
      background: "transparent",
    },
    vissible: {
      width: isMobile ? 65 : target,
      background: "rgb(0,0,0,0.5)",
    },
  };

  const routes = [
    { text: "Dashboard", url: "/dashboard" },
    { text: "Quizzes", url: "/dashboard/quizzes" },
    { text: "Notes", url: "/dashboard/notes" },
    { text: "Todos", url: "/dashboard/todos" },
    { text: "Chat", url: "/dashboard/chat" },
    { text: "Profile", url: "/dashboard/profile" },
  ];

  return (
    <>
      <motion.nav
        animate={!isMobile && height > 50 && !isHidden ? "vissible" : "hidden"}
        whileHover="vissible"
        initial="hidden"
        exit="hidden"
        onFocusCapture={() => setIsHidden(false)}
        variants={firstNavVariants}
        transition={{ duration: 0.25 }}
        className={cn(
          "fixed text-neutral-700 p-[10px] z-[10000000000] h-[65px] backdrop-blur bottom-10 left-4 right-4 mx-auto overflow-hidden rounded-lg flex items-center sm:justify-between justify-start pr-6 gap-0"
        )}
      >
        <motion.div
          animate={{ height: 50 }}
          onClick={() => isMobile && setSidebarOpen(true)}
          className="bg-black rounded-lg max-w-[50px] min-w-[50px] flex items-center justify-center cursor-pointer"
        >
          <div className="h-4 rounded w-4 bg-white rotate-45" />
        </motion.div>

        {!isMobile && (
          <div className="sm:mr-10 mr-4" />
        )}

        {!isMobile && (
          <AnimatePresence>
            {(height >= 0 || !isHidden) && (
              <motion.ul className="flex items-center sm:gap-10 gap-4 w-fit">
                {routes.map((route, i) => (
                  <Link key={i} href={route.url}>
                    <motion.li
                      className="text-white sm:text-xl text-sm cursor-pointer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      style={{ opacity: routesOpacity }}
                    >
                      {route.text}
                    </motion.li>
                  </Link>
                ))}
                <motion.li
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ opacity: routesOpacity }}
                >
                  <Logout />
                </motion.li>
              </motion.ul>
            )}
          </AnimatePresence>
        )}
      </motion.nav>

      <AnimatePresence>
        {isMobile && sidebarOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 h-full w-64 bg-black text-white z-[10000000001] p-6 sm:hidden shadow-xl"
          >
            {/* Title and Close */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold tracking-wide">Study Sphere</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-white text-2xl"
              >
                <FiArrowLeft />
              </button>
            </div>

            {/* Animated List */}
            <motion.ul
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: {},
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
                exit: {
                  transition: {
                    staggerChildren: 0.05,
                    staggerDirection: -1,
                  },
                },
              }}
              className="space-y-6 mt-4"
            >
              {routes.map((route, i) => (
                <motion.li
                  key={i}
                  variants={{
                    hidden: { opacity: 0, x: -30 },
                    visible: { opacity: 1, x: 0 },
                    exit: { opacity: 0, x: -30 },
                  }}
                >
                  <Link
                    href={route.url}
                    onClick={() => setSidebarOpen(false)}
                    className="block text-lg font-medium hover:text-gray-300 transition-all"
                  >
                    {route.text}
                  </Link>
                </motion.li>
              ))}
              <motion.li
                variants={{
                  hidden: { opacity: 0, x: -30 },
                  visible: { opacity: 1, x: 0 },
                  exit: { opacity: 0, x: -30 },
                }}
              >
                <Logout />
              </motion.li>
            </motion.ul>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
