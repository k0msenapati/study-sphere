"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { MdQuiz, MdTipsAndUpdates, MdTimer } from "react-icons/md"
import { GiStairsGoal } from "react-icons/gi"
import { FiRefreshCw } from "react-icons/fi"
import { IoFolderOpen, IoCalendarNumberSharp } from "react-icons/io5";
import { RiFileList3Line } from "react-icons/ri"
import { FaBookOpen, FaComments, FaLightbulb, FaBalanceScaleLeft } from "react-icons/fa"
import { HiOutlineSparkles } from "react-icons/hi2"

const Dashboard = () => {
  return (
    <div className="min-h-screen p-4 md:p-6">
      <header className="relative bg-blue-500 text-white p-8 md:p-12 rounded-lg shadow-md mb-8 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1500989145603-8e7ef71d639e?q=80&w=1776&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Study Background"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Good Morning, Student!</h1>
          <div className="flex items-center gap-3">
            <MdTipsAndUpdates className="shrink-0 text-yellow-400 text-4xl md:text-5xl" />
            <p className="text-lg md:text-2xl font-semibold">
              "The best way to predict the future is to create it." - Peter Drucker
            </p>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row flex-wrap gap-6 justify-between py-6">
        <Link href="/dashboard/notes" className="w-full md:w-[48%] lg:w-[32%]">
          <motion.div
            className="relative bg-white cursor-pointer p-6 rounded-lg shadow-md flex items-start transition-transform duration-300 ease-in-out h-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 border-2 border-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-start gap-4">
              <FaBookOpen className="text-blue-500 text-5xl" />
              <div>
                <h2 className="text-xl md:text-2xl font-semibold">Review Your Notes</h2>
                <p className="mt-2 text-sm md:text-base">
                  Make sure to revisit your study notes to reinforce your knowledge.
                </p>
              </div>
            </div>
          </motion.div>
        </Link>
        <Link href="/dashboard/quizzes" className="w-full md:w-[48%] lg:w-[32%]">
          <motion.div
            className="relative bg-white cursor-pointer p-6 rounded-lg shadow-md flex items-start transition-transform duration-300 ease-in-out h-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 border-2 border-gradient-to-r from-green-400 via-teal-400 to-cyan-400 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-start gap-4">
              <MdQuiz className="text-green-500 text-5xl" />
              <div>
                <h2 className="text-xl md:text-2xl font-semibold">Take a Quiz</h2>
                <p className="mt-2 text-sm md:text-base">
                  Challenge yourself with a quiz to test your understanding.
                </p>
              </div>
            </div>
          </motion.div>
        </Link>        <Link href="/dashboard/chat" className="w-full md:w-[48%] lg:w-[32%]">
          <motion.div
            className="relative bg-white cursor-pointer p-6 rounded-lg shadow-md flex items-start transition-transform duration-300 ease-in-out h-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 border-2 border-gradient-to-r from-red-400 via-orange-400 to-yellow-400 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-start gap-4">
              <FaComments className="text-red-500 text-5xl" />
              <div>
                <h2 className="text-xl md:text-2xl font-semibold">Chat with a Study Buddy</h2>
                <p className="mt-2 text-sm md:text-base">
                  Discuss any doubts or concepts with your study partner.
                </p>
              </div>
            </div>
          </motion.div>
        </Link>
        
        <Link href="/dashboard/flashcards" className="w-full md:w-[48%] lg:w-[32%]">
          <motion.div
            className="relative bg-white cursor-pointer p-6 rounded-lg shadow-md flex items-start transition-transform duration-300 ease-in-out h-full"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="absolute inset-0 border-2 border-gradient-to-r from-purple-400 via-pink-400 to-rose-400 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative z-10 flex items-start gap-4">
              <HiOutlineSparkles className="text-purple-500 text-5xl" />
              <div>
                <h2 className="text-xl md:text-2xl font-semibold">Generate Flashcards</h2>
                <p className="mt-2 text-sm md:text-base">
                  Create AI-powered flashcards from your study material for effective memorization.
                </p>
              </div>
            </div>
          </motion.div>
        </Link>
      </div>
      <div className="mt-12 mb-32 bg-gradient-to-r from-fuchsia-500 to-cyan-500 p-6 md:p-12 rounded-lg shadow-md">
        <div className="bg-white bg-opacity-30 backdrop-blur-lg rounded-lg shadow-xl p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center text-white flex items-center justify-center gap-4">
            <MdTipsAndUpdates className="shrink-0 text-white text-4xl md:text-5xl" />
            Tips for Effective Studying
          </h2>
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/2 pr-4 mb-6">
              <ul className="list-none space-y-4 text-white text-lg md:text-xl">
                <li key="goal" className="flex items-center gap-3">
                  <GiStairsGoal className="shrink-0 text-2xl md:text-4xl text-emerald-400" />
                  Set clear goals for each study session.
                </li>
                <li key="breaks" className="flex items-center gap-3">
                  <MdTimer className="shrink-0 text-2xl md:text-4xl text-yellow-400" />
                  Take regular breaks to avoid burnout.
                </li>
                <li key="recall" className="flex items-center gap-3">
                  <FiRefreshCw className="shrink-0 text-2xl md:text-4xl text-sky-400" />
                  Use active recall and spaced repetition techniques.
                </li>
                <li key="organization" className="flex items-center gap-3">
                  <IoFolderOpen className="shrink-0 text-2xl md:text-4xl text-amber-400" />
                  Stay organized and manage your time effectively.
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/2 pl-4 mb-6">
              <ul className="list-none space-y-4 text-white text-lg md:text-xl">
                <li key="balance" className="flex items-center gap-3">
                  <FaBalanceScaleLeft className="shrink-0 text-2xl md:text-4xl text-indigo-400" />
                  Keep a healthy balance between study and relaxation.
                </li>
                <li key="environment" className="flex items-center gap-3">
                  <FaLightbulb className="shrink-0 text-2xl md:text-4xl text-yellow-300" />
                  Find your optimal study environment.
                </li>
                <li key="practice" className="flex items-center gap-3">
                  <RiFileList3Line className="shrink-0 text-2xl md:text-4xl text-orange-400" />
                  Practice past papers and sample questions.
                </li>
                <li key="schedule" className="flex items-center gap-3">
                  <IoCalendarNumberSharp className="shrink-0 text-2xl md:text-4xl text-white" />
                  Create a study schedule and stick to it.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard