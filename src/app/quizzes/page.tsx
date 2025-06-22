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
