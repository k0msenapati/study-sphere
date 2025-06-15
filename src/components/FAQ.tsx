"use client"
import React, { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { Plus, Minus } from "lucide-react" // Import Minus icon

const tabs = [
  {
    title: "What is Study Sphere?",
    description:
      "Study Sphere is a free and open-source educational platform designed to help students enhance their learning experience. It offers features such as note-taking, quizzes, and interactive chat with study buddies.",
  },
  {
    title: "Which technologies are used in Study Sphere?",
    description:
      "Study Sphere is built using modern technologies including CopilotKit, Next.js, Framer Motion for animations, and Tailwind CSS for styling. These technologies ensure a responsive and interactive user experience.",
  },
  {
    title: "How can I contribute to Study Sphere?",
    description:
      "Since Study Sphere is open source, you can contribute by visiting our GitHub repository. You can submit bug reports, suggest new features, or contribute code to help improve the app.",
  },
  {
    title: "Is Study Sphere free to use?",
    description:
      "Yes, Study Sphere is completely free to use. Our goal is to provide valuable educational tools to students without any cost. You can access all features of the app without any subscriptions or hidden fees.",
  },
  {
    title: "Is it okay to start learning from scratch with Study Sphere if I have less experience?",
    description:
      "Absolutely! Study Sphere provides beginner-friendly resources, interactive tutorials, and guided learning paths to help students of all experience levels build their knowledge from basic concepts to advanced topics.",
  },
  {
    title: "How do I balance my academic studies with using Study Sphere?",
    description:
      "Study Sphere is designed to integrate seamlessly with your academic schedule. You can use its note-taking features during lectures, create custom quizzes for self-assessment, and use the chat feature to collaborate with study buddies on challenging topics, making your study time more efficient.",
  },
  {
    title: "What makes Study Sphere different from other educational platforms?",
    description:
      "Study Sphere stands out due to its comprehensive and open-source nature. It offers a unique combination of note-taking, quiz creation, and real-time chat functionalities, fostering a collaborative and personalized learning environment without any cost.",
  },
  {
    title: "Are Study Sphere resources suitable for students from all academic backgrounds?",
    description:
      "Yes, Study Sphere's resources are designed to be adaptable and beneficial for students across various academic disciplines. Whether you're in science, humanities, or engineering, you'll find tools and content to support your learning journey.",
  },
]

function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(0)

  const handleClick = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-inter py-10">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <h1 className="text-center text-4xl md:text-5xl font-bold mb-10 tracking-wide text-gray-900">
          Frequently Asked Questions
        </h1>
        <div className="bg-white">
          {" "}
          {/* Removed outer border, background is white */}
          {tabs.map((tab, index) => (
            <motion.div
              key={index}
              // Conditional styling for active/inactive items
              className={`rounded-lg mb-4 overflow-hidden ${
                activeIndex === index
                  ? "bg-orange-50 shadow-md" // Light orange background and shadow for active
                  : "bg-white border border-gray-200" // White background, border for inactive
              }`}
              onClick={() => handleClick(index)}
            >
              <button
                className={`w-full text-left py-4 px-6 flex justify-between items-center cursor-pointer text-lg font-semibold transition-colors duration-300 ${
                  activeIndex === index ? "text-orange-600" : "text-gray-900" // Orange text for active, dark gray for inactive
                }`}
              >
                <span>{tab.title}</span>
                {activeIndex === index ? (
                  <Minus className="w-6 h-6 text-orange-600" /> // Minus icon for active, orange color
                ) : (
                  <Plus className="w-6 h-6 text-gray-500" /> // Plus icon for inactive, gray color
                )}
              </button>
              <AnimatePresence mode="sync">
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      duration: 0.3,
                      ease: "easeInOut",
                    }}
                    className="px-6 pb-4" // Adjusted padding
                  >
                    <p className="text-gray-700 text-base leading-relaxed">
                      {" "}
                      {/* Darker gray text for description */}
                      {tab.description}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FAQ
