'use client';

import React from 'react';
import Link from 'next/link';
import { useQuiz } from '@/context/QuizProvider';

export default function QuizListPage() {
  const { quizzes } = useQuiz();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Quizzes</h1>
        <Link href="/quizzes/create">
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
            + Create Quiz
          </button>
        </Link>
      </div>

      {quizzes.length === 0 ? (
        <p className="text-gray-500 text-lg">No quizzes created yet.</p>
      ) : (
        <ul className="space-y-4">
          {quizzes.map((quiz) => (
            <li
              key={quiz.id}
              className="border border-gray-300 p-4 rounded shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-xl font-semibold">{quiz.title}</h2>
              <p className="text-sm text-gray-500">Category: {quiz.category}</p>
              <p className="text-sm text-gray-400">
                Questions: {quiz.questions.length}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// src/app/quizzes/page.tsx
'use client';

import Link from 'next/link';
import React from 'react';

export default function QuizListPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">All Quizzes</h1>

      <Link href="/quizzes/create">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          + Create Quiz
        </button>
      </Link>

      {/* TODO: Quiz list can go here later */}
    </div>
  );
}
