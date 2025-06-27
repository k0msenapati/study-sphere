"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, FileText } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 min-h-screen">
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

      {/* Metrics Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
        <motion.div
          className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4 border border-blue-100 hover:shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(59,130,246,0.15)" }}
        >
          <div className="bg-blue-100 p-3 rounded-full">
            <Clock className="h-7 w-7 text-blue-500" />
          </div>
          <div>
            <div className="text-lg font-semibold text-blue-700">No. of Hours Spent</div>
            <div className="text-3xl font-bold text-blue-900">12</div>
          </div>
        </motion.div>
        <motion.div
          className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4 border border-green-100 hover:shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.04, boxShadow: "0 8px 32px rgba(16,185,129,0.15)" }}
        >
          <div className="bg-green-100 p-3 rounded-full">
            <FileText className="h-7 w-7 text-green-500" />
          </div>
          <div>
            <div className="text-lg font-semibold text-green-700">No. of Tests Given</div>
            <div className="text-3xl font-bold text-green-900">8</div>
          </div>
        </motion.div>
      </div>

      {/* Feature Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-12">
        <Link href="/dashboard/notes">
          <motion.div
            className="relative bg-white cursor-pointer p-6 rounded-xl shadow-md flex items-center border border-blue-100 group transition-all duration-300"
            whileHover={{ scale: 1.05, boxShadow: "0 8px 32px rgba(59,130,246,0.15)" }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />
            <div className="relative z-10 flex items-center">
              <span className="text-blue-500 text-5xl mr-6">📚</span>
              <div>
                <h2 className="text-2xl font-semibold">Review Your Notes</h2>
                <p className="mt-2 text-lg text-gray-600">
                  Make sure to revisit your study notes to reinforce your knowledge.
                </p>
              </div>
            </div>
          </motion.div>
        </Link>
        <Link href="/dashboard/quizzes">
          <motion.div
            className="relative bg-white cursor-pointer p-6 rounded-xl shadow-md flex items-center border border-green-100 group transition-all duration-300"
            whileHover={{ scale: 1.05, boxShadow: "0 8px 32px rgba(16,185,129,0.15)" }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-400 via-teal-400 to-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />
            <div className="relative z-10 flex items-center">
              <span className="text-green-500 text-5xl mr-6">📝</span>
              <div>
                <h2 className="text-2xl font-semibold">Take a Quiz</h2>
                <p className="mt-2 text-lg text-gray-600">
                  Challenge yourself with a quiz to test your understanding.
                </p>
              </div>
            </div>
          </motion.div>
        </Link>
        <Link href="/dashboard/chat">
          <motion.div
            className="relative bg-white cursor-pointer p-6 rounded-xl shadow-md flex items-center border border-red-100 group transition-all duration-300"
            whileHover={{ scale: 1.05, boxShadow: "0 8px 32px rgba(239,68,68,0.15)" }}
            whileTap={{ scale: 0.97 }}
          >
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" />
            <div className="relative z-10 flex items-center">
              <span className="text-red-500 text-5xl mr-6">💬</span>
              <div>
                <h2 className="text-2xl font-semibold">Chat with a Study Buddy</h2>
                <p className="mt-2 text-lg text-gray-600">
                  Discuss any doubts or concepts with your study partner.
                </p>
              </div>
            </div>
          </motion.div>
        </Link>
      </div>

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
              </ul>
            </div>
            <div className="w-full md:w-1/2 pl-4 mb-6">
              <ul className="list-disc pl-6 text-white text-xl">
                <li>⚖️ Keep a healthy balance between study and relaxation.</li>
                <li>💡 Find your optimal study environment.</li>
                <li>📝 Practice past papers and sample questions.</li>
                <li>📅 Create a study schedule and stick to it.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
