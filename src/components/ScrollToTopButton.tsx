// components/ScrollToTopButton.tsx
"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react"; // Optional: install lucide-react icons
import clsx from "clsx";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={clsx(
        "fixed bottom-6 right-6 z-50 p-3 rounded-full shadow-md bg-gray-800 text-white hover:bg-gray-700 focus:outline-none transition-opacity",
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      )}
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
