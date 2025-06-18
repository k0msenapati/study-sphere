

"use client"

import React from 'react'; // No longer need useState, useEffect for Dashboard itself
import { motion } from "framer-motion" // Corrected import: was framer-variants
import Link from "next/link"

// NOTE: The Todo interface, initialTodos, and all To-Do related state/handlers
// have been moved to a *new* separate page (e.g., app/dashboard/todos/page.tsx or pages/dashboard/todos.tsx)

const Dashboard = () => {
  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <header className="relative bg-blue-500 text-white p-12 rounded-lg shadow-md mb-8 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1500989145603-8e7ef71d639e?q=80&w=1776&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Study Background"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 p-8">
          <h1 className="text-5xl font-bold mb-4">Good Morning, Student!</h1>
          <div className="flex items-center space-x-4">
            <span className="text-yellow-400 text-4xl">🌟</span>
            <p className="text-2xl font-semibold">
              "The best way to predict the future is to create it." – Peter Drucker
            </p>
          </div>
        </div>
      </header>

      {/* Navigation Links including the new To-Do link */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
        <Link href="/dashboard/notes" className="block"> {/* Added block to Link for full area click */}
          <motion.div
            className="relative bg-white cursor-pointer p-6 rounded-lg shadow-md flex items-center transition-transform duration-300 ease-in-out hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 border-2 border-transparent hover:border-blue-400 hover:border-t-blue-400 hover:border-b-purple-400 hover:border-l-pink-400 hover:border-r-blue-400 rounded-lg opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100"></div> {/* Simplified hover border */}
            <div className="relative z-10 flex items-center">
              <span className="text-blue-500 text-5xl mr-6">📚</span>
              <div>
                <h2 className="text-2xl font-semibold">Review Your Notes</h2>
                <p className="mt-2 text-lg text-gray-700">
                  Make sure to revisit your study notes to reinforce your knowledge.
                </p>
              </div>
            </div>
          </motion.div>
        </Link>

        <Link href="/dashboard/quizzes" className="block">
          <motion.div
            className="relative bg-white cursor-pointer p-6 rounded-lg shadow-md flex items-center transition-transform duration-300 ease-in-out hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 border-2 border-transparent hover:border-green-400 hover:border-t-green-400 hover:border-b-teal-400 hover:border-l-cyan-400 hover:border-r-green-400 rounded-lg opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100"></div> {/* Simplified hover border */}
            <div className="relative z-10 flex items-center">
              <span className="text-green-500 text-5xl mr-6">📝</span>
              <div>
                <h2 className="text-2xl font-semibold">Take a Quiz</h2>
                <p className="mt-2 text-lg text-gray-700">
                  Challenge yourself with a quiz to test your understanding.
                </p>
              </div>
            </div>
          </motion.div>
        </Link>

        {/* New To-Do List Link Card */}
        <Link href="/dashboard/todo" className="block">
          <motion.div
            className="relative bg-white cursor-pointer p-6 rounded-lg shadow-md flex items-center transition-transform duration-300 ease-in-out hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* The border-gradient-to-r was problematic, using simpler hover borders now */}
            <div className="absolute inset-0 border-2 border-transparent hover:border-purple-400 hover:border-t-purple-400 hover:border-b-indigo-400 hover:border-l-blue-400 hover:border-r-purple-400 rounded-lg opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100"></div>
            <div className="relative z-10 flex items-center">
              <span className="text-purple-500 text-5xl mr-6">✅</span> {/* Checkmark icon */}
              <div>
                <h2 className="text-2xl font-semibold">Manage Your To-Dos</h2>
                <p className="mt-2 text-lg text-gray-700">
                  Keep track of your tasks and stay organized.
                </p>
              </div>
            </div>
          </motion.div>
        </Link>

        <Link href="/dashboard/chat" className="block">
          <motion.div
            className="relative bg-white cursor-pointer p-6 rounded-lg shadow-md flex items-center transition-transform duration-300 ease-in-out hover:shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 border-2 border-transparent hover:border-red-400 hover:border-t-red-400 hover:border-b-orange-400 hover:border-l-yellow-400 hover:border-r-red-400 rounded-lg opacity-0 transition-opacity duration-300 ease-in-out hover:opacity-100"></div>
            <div className="relative z-10 flex items-center">
              <span className="text-red-500 text-5xl mr-6">💬</span>
              <div>
                <h2 className="text-2xl font-semibold">Chat with a Study Buddy</h2>
                <p className="mt-2 text-lg text-gray-700">
                  Discuss any doubts or concepts with your study partner.
                </p>
              </div>
            </div>
          </motion.div>
        </Link>
      </div>

      {/* The "Tips for Effective Studying" section remains */}
      <div className="mt-12 mb-32 bg-gradient-to-r from-fuchsia-500 to-cyan-500 p-12 rounded-lg shadow-md">
        <div className="bg-white bg-opacity-30 backdrop-blur-lg rounded-lg shadow-xl p-8">
          <h2 className="text-4xl font-bold mb-6 text-center text-white">
            📚 Tips for Effective Studying 📚
          </h2>
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/2 pr-4 mb-6">
              <ul className="list-disc pl-6 text-white text-xl">
                <li>🎯 Set clear goals for each study session.</li>
                <li>⏲️ Take regular breaks to avoid burnout.</li>
                <li>🔄 Use active recall and spaced repetition techniques.</li>
                <li>🗂️ Stay organized and manage your time effectively.</li>
                <li>⚖️ Keep a healthy balance between study and relaxation.</li>
              </ul>
            </div>
            <div className="w-full md:w-1/2 pl-4 mb-6">
              <ul className="list-disc pl-6 text-white text-xl">
                <li>💡 Find your optimal study environment.</li>
                <li>📝 Practice past papers and sample questions.</li>
                <li>📅 Create a study schedule and stick to it.</li>
                <li>🗣️ Explain concepts to others to solidify understanding.</li>
                <li>🧘 Practice mindfulness to improve focus.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard